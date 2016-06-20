/*
各种配置
2016年6月16日10:15:27,张维金
QQ:452076103
 */

//引入express模板:主框架
var express = require('express');

//引入path模块:项目根路径
var path = require('path');


var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore=require('connect-mongo')(session);

//上传图片组件
/*var multer = require('multer');*/


//mongodb数据库
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/weibo?poolSize=40');

//指定routes路由器文件的路径
var routes1 = require('./routes/before');
var routes2 = require('./routes/after');

//启动web服务器,将实例赋给变量:app
var app = express();

// view engine setup 设置视图的根目录
app.set('views', path.join(__dirname, 'views'));

//设置默认模板引擎:ejs
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//表单提交的数据进行格式化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//定义文件上传的路径,1.0以上版本已经不能当做中间件使用
//app.use(multer({dest: 'uploads/tmp/'}));

app.use(cookieParser());

//session设置,存入到mongodb数据库,实现持久化
app.use(session({
  secret:'weibo',
  store:new mongoStore({
    url:'mongodb://localhost/weibo',
    collection:'sessions'
  })
}));

//静态资源路径,image,css,js等文件
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//前台业务逻辑路由-不需要登陆就可以访问
app.use('/before', routes1);

//后台业务逻辑路由-必须登陆后才可以访问
app.use('/after', routes2);

//socket.io修改
app.ready=function(server){
  routes1.prepareSocketIO(server);
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
