var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var mongodb=require('mongodb');
var async = require('async');
//router.get的路径用'/'的原因:此处是相对的路径，代表该页面处理的路径
//防止用户直接访问/login 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));      
router.post('/',function(req,res,next){if(!req.body.account||!req.body.password)
                                     {res.send('登录失败！')}
								      //如果是通过表单访问/signin，则交给下一个中间件
                                      else{next()}
									  })									 
router.post('/', function(req,res){
      var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
	    async.waterfall([
	    	                 function(callback){
                         //连接数据库
                         MongoClient.connect(dburl, function (err,db){                        
                         callback(err,db);
                         })
                         },
                         function(db,callback){                                            
                         var userInfor=db.db('userInfor');
                         //判断userInfor数据库中用户是否存在
                         userInfor.collection('userInfor').find({'account':req.body.account}).toArray(function(err,result){
                           if(result.length===0)
                           	 //验证账号是否存在
                           	 {res.json({"message":"账号或密码不正确！"})}
                           else if(result.length>1)
                           	      //找到两个有相同账号的文档，数据错误
                           	      {res.json({"message":"数据错误！"})}
                           else{if(req.body.password===result[0].password)
                           	       {//返回session
                           	       	req.session.account=req.body.account;	
 		                                res.json({"message":"登陆成功！",
 	                                            "url":"/homepage",});
                           	       }
                                }
                               callback(err);
                         })
                         }],
                         //总回调函数
                         function(err){
                          if(err){console.log(err);res.send('登录失败！')}                                                   
                         }  
                         )
})
module.exports = router;
