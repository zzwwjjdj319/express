/*
前台控制路由
2016年6月16日10:14:37,张维金
QQ:452076103
 */
var express = require('express');
var router = express.Router();
var ut = require('../utils/common.js');
var Users=require('../models/users');
var Microblog=require('../models/microblog');
var socket_io = require('socket.io');

// 所有/before下的页面请求拦截的路由
router.use(function (req, res, next) {
  req.users = req.session.users;
  //console.log(req.users);
  next();
});

/* GET home page. 主页*/
router.get('/index', function(req, res, next) {
  console.log('首页');
  //console.log(req.session.users);
  Microblog.fetch(function(err, microblogs){
    if (err) {
      console.log(err)
      return;
    }

    Users.count(function(err, result){
      if (err) {
        console.log(err)
        return;
      }
      req.num = result;
      req.microblogs = microblogs;
      res.render('index',req);
    });
  })


});

/*注册页面*/
router.get('/reg', function(req, res, next) {
  console.log('注册页');
  res.render('reg',req);
});

/*登陆页面*/
router.get('/login', function(req, res, next) {
  console.log('登录页');
  res.render('login',req);
});

/*退出*/
router.get('/logout', function(req, res, next) {
  console.log('退出');
  delete req.session.users;
  res.redirect('/before/login');
});

/*注册验证*/
router.post('/reg',function(req,res,next){
  console.log('注册验证,并响应!');
  var b = req.body;
  var _users={
    username: b.username,
    password: b.password,
    name: b.name,
    createDate: ut.now(),
    random: new Date().getTime()%10
  }
  
  Users.find({username:_users.username},function(err,users){
    if(err){
      console.log(err);
      return ut.redirectBack(res,'提交出错');
    }
    if(users.length>0){
      console.log('注册时根据username查询:'+users);
      ut.redirectBack(res,'用户名已存在');
    }else{
      var users=new Users(_users);
      users.save(function(err,users){
        if(err){
          console.log(err)
          return ut.redirectBack(res,'提交出错');
        }
        
        req.session.users=users;
        res.redirect('/before/index');
      })

    }
  });
});

/*登陆验证*/
router.post('/login',function(req,res,next){
  console.log('登陆验证,并响应!');
  var _users={
    username: req.body.username,
    password: req.body.password
  }
  Users.findOne({username:_users.username,password:_users.password},function(err,users){
    if(err){
      console.log(err);
    }
    
    if(!users){
      ut.redirectBack(res,'用户名或密码错误');
    }else {
      
      req.session.users=users;

      res.redirect('/before/index');
    }

  })
});

/*发布微博*/
router.post('/release', function(req, res, next) {
  console.log('发布微博');
  var ret = {};
  var connect=req.body.connect;
  var s = req.session.users;
  if (!connect){
    ret.result = 'null';
    res.json(ret);
  }else{
    var _microblog={
      connect: connect,
      createDate: ut.now(),
      userid: s._id
    };
    var microblog=new Microblog(_microblog);
    microblog.save(function(err,microblog) {
      if (err) {
        console.log(err)
        ret.result = 'no';
        res.json(ret);
        return;
      }
      
      ret.result = 'ok';
      res.json(ret);
    })

  }
});

//socket.io
router.prepareSocketIO = function (server) {
  var io = socket_io.listen(server);
  io.sockets.on('connection', function (socket) {
    
    socket.on('click',function(){

      Microblog.fetch(function(err,microblogs){
        if (err) {
          console.log(err)
          return;
        }
        
        socket.emit('microblog', {microblogs: microblogs});
        socket.broadcast.emit('microblog',  {microblogs: microblogs});
      })
    })
  })
}

module.exports = router;
