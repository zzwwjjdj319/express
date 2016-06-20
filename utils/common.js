/*工具类*/
var nodemailer = require('nodemailer');

var Ut = {
	 /*
  生成格式化的当前时间: yyyy-MM-dd HH:mm:ss
  示例： var str = Ut.now();
  */
  now: function () {
    return Ut.fmtDate(new Date());
  },

  fmtDate: function (date) {
    // 将数字格式化为两位长度的字符串
    var fmtTwo = function (number) {
      return (number < 10 ? '0' : '') + number;
    }

    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());

    var HH = fmtTwo(date.getHours());
    var mm = fmtTwo(date.getMinutes());
    var ss = fmtTwo(date.getSeconds());

    return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
  },

  // 后退并弹出提示框（用于保存失败，弹出提示框并回退到保存信息时的页面）
  redirectBack: function (res, msg) {
    res.writeHead(200, { "content-type": "text/html;charset=UTF-8" });
    res.write('<script type = "text/javascript" >');
    res.write('alert("' + msg + '");');
    res.write('window.history.go(-1)');
    res.end('</script>');
  },

  // 页面重定向并弹出提示框 （用户保存成功，弹出提示框并跳转页面）
  redirectPageMsg: function (res, msg, path) {
    res.writeHead(200, { "content-type": "text/html;charset=UTF-8" });
    res.write('<script type = "text/javascript" >');
    res.write('alert("' + msg + '");');
    res.write('window.location="' + path + '"');
    res.end('</script>');
  }
  /*,

	//发送邮件
  sendMail: function (mailer, messages, next) {
    var nowTime = Ut.now();

    var transporter = nodemailer.createTransport({
      service: 'qq',
      auth: {
        user: '452076103@qq.com',
        pass: 'drckgvaniifbbbbb'   //授权码自己获取
      }
    });

    var mailOptions = {
      from: '452076103@qq.com', // sender address
      to: `527828938@qq.com,${mailer}`, // list of receivers
      subject: '实时刷新微博', // Subject line
      //text: 'Hello world', // plaintext body
      html: `<h3>${nowTime}；</h3><h3><a href="http://www.baidu.com">项目源码</a></h3><div style="width:500px;font-size:15px">${messages}</div>` // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        next(error,null);
      }else{
        next(null,info);
      }
    });
  }*/
}

module.exports = Ut;