var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var getTime=require('../self_modules/getTime.js')//自定义模块，获取时间
var bodyParser = require('body-parser');
var mongodb=require('mongodb');
var async = require('async');
//先用bodyParser对post请求的请求体作处理									 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));									 
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
                         userInfor.collection('userInfor').find({'account':req.session.account}).toArray(function(err,result){
                           if(result.length===0){res.send('上传失败！')}
                           else{callback(err,userInfor,result,db)}
                         })
                         },
                         function(userInfor,user,db,callback){
                           var userThoughts=db.db('userThoughts');
                           var number=user[0].thoughts+1;
                           var time=getTime.getTime();
                           var thoughts={number:number,
 			                                   time:time,
                                         content:req.body.thoughts};
                           //thoughts信息写入userThoughts数据库        
                           userThoughts.collection(req.session.account).insertOne(thoughts,function(err){callback(err,userInfor,number)});
                         },
                         function(userInfor,number,callback){
                           //更新userInfor数据库的thoughts信息 
                           userInfor.collection('userInfor').updateOne({"account":req.session.account},{$set:{"thoughts":number}},function(err,result){
                                callback(err);
                           })                          
                         }],
                         //总回调函数
                         function(err){
                         if(err){console.log(err);res.send('上传失败！')}                   
                         if(req.query.current_page=='home')
		                     {res.redirect('/homepage')}
 	                     else{res.redirect('/homepage/thoughts?thoughts_page=1')}
                         }
                         )

})
module.exports = router;
