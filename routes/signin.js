var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var mongodb=require('mongodb');
var async = require('async');
//router.get的路径用'/'的原因:此处是相对的路径，代表该页面处理的路径
//防止用户直接访问/signin
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));       
router.post('/',function(req,res,next){if(!req.body.account||!req.body.password)
                                     {res.send('注册失败！')}
								     //如果是通过表单访问/signin，则交给下一个中间件
                                     else{next()}
									 })
								 
router.post('/', function(req,res){
	    var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
        //使用async模块瀑布流方式实现同步操作
        async.waterfall([
                          function(callback){
                          //连接数据库
                          MongoClient.connect(dburl, function (err,db){                        
                          callback(err,db);
                         })
                         },
                         function(db,callback){                                            
                         var userInfor=db.db('userInfor');
                         //判断userInfor数据库中注册用户名是否已经存在
                         userInfor.collection('userInfor').find({'account':req.body.account}).toArray(function(err,result){
                           if(result.length!==0){res.send('该用户名已存在！')}
                           else{callback(err,userInfor,db)}
                         })
                         },
                         function(userInfor,db,callback){
                           //注册一个新用户
                           var userThoughts=db.db('userThoughts');
                           var userMoods=db.db('userMoods');
                           var information={account:req.body.account,
			                                      password:req.body.password,
			                                      username:'您还没有设置用户名',
			                                      signature:'您还没有设置签名',
			                                      userhead:'/default/boy.jpg',
			                                      thoughts:0,
			                                      moods:0};
			              userInfor.collection('userInfor').insertOne(information,function(err,result){callback(err,userThoughts,userMoods)});               
	                     },
                         function(userThoughts,userMoods,callback){
                         //为新用户创建一个新的thoughts集合
                         userThoughts.createCollection(req.body.account, function (err,result){callback(err,userMoods)})
                         },
                         function(userMoods,callback){
                         ////为新用户创建一个新的thoughts集合
                         userMoods.createCollection(req.body.account, function (err,result){callback(err)})
                         }],
                         //总回调函数
                         function(err){
                         	if(err){console.log(err);res.send('注册失败！')}                   
                         	res.send('注册成功！')
                         })
     }
     )

module.exports = router;
