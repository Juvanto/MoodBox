//app.js
//使用express+html模版搭建http服务器
var express = require('express');
var app = express();
var path=require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var homepage= require('./routes/homepage');
var index = require('./routes/index');
var signin= require('./routes/signin');
var login= require('./routes/login');
var infor= require('./routes/infor');
var thoughtsSubmit= require('./routes/thoughtsSubmit');
var homeThoughts=require('./routes/homeThoughts');
var deleteThing=require('./routes/delete');
var moodsSubmit=require('./routes/moodsSubmit');
var homeMoods=require('./routes/homeMoods');
var moodsEdit=require('./routes/moodsEdit');
app.use(cookieParser('system'));
app.use(session({
 secret: 'system',
 resave: true,
 saveUninitialized:true
}));
app.use(express.static(path.join(__dirname, '/public')));//设置静态资源目录，放置js、css和图片等文件
app.use(express.static(path.join(__dirname, 'database/usershead')));//设置多个静态资源目录
app.use('/', index);//将根目录的访问路由到index.js
app.use('/signin', signin);
app.use('/login', login);
app.use('/homepage',homepage); 
app.use('/infor',infor);
app.use('/thoughts_submit',thoughtsSubmit);
app.use('/moods_submit',moodsSubmit);
app.use('/homepage/thoughts',homeThoughts);
app.use('/homepage/delete',deleteThing);
app.use('/homepage/moods',homeMoods);
app.use('/homepage/moods/moods_edit',moodsEdit);
app.set('views',path.join(__dirname , 'views'));//设置模版文件目录，类似于静态资源
app.set('view engine', 'ejs');//设置模版引擎
app.listen(3000);

//app.engine('html', require('ejs').renderFile);//用ejs模版的方法来渲染html，若用ejs模版则省略这条语句
//当路径'/'使用了路由，就不具备处理所有请求的能力，如app.use('/',index)，这时并不是所有请求都会经其处理
