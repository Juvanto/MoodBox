var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs=require('fs');
var path=require('path');
var mongodb=require('mongodb');
var async = require('async');
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
                            var form = new multiparty.Form();
	                        //上传图片保存的目录  目录必须存在 
                            form.uploadDir='./database/usershead';
                            form.parse(req, function(err, fields, files){
                                var username=fields.inforFormName[0];
                                var signature=fields.inforFormSign[0];
                                var userhead;
                                //如果表单中上传了文件，则执行保存等操作
                                if(files.inforFormFile[0].size>0)
                                {//利用文件后缀名获取文件类型
                                 var temp=files.inforFormFile[0].originalFilename.split('.');
	                             var fileType=temp[temp.length-1];
	                             //userhead路径，要写入userInfor数据库
	                             userhead='/'+req.session.account+'.'+fileType;
	                             fs.rename(files.inforFormFile[0].path,'./database/usershead/'+req.session.account+'.'+fileType,function(err){	                               
                                    callback(err,db,username,signature,userhead);  
	                              })
                                }
                                //即使表单里没有文件，multiparty也会创建一个大小为0的文件，用unlink删掉这个空文件
                                else{fs.unlink(files.inforFormFile[0].path,function (err) {
                                	 userhead='';
                                	 callback(err,db,username,signature,userhead);
                                     })
                                }    
                             })
                          },
                          function(db,username,signature,userhead,callback){
                               var userInfor=db.db('userInfor');                              
                               userInfor.collection('userInfor').find({'account':req.session.account}).toArray(function(err,result){
                               if(result.length===0){res.send('上传失败！')}
                               else{callback(err,userInfor,username,signature,userhead)}})
                          },
                          function(userInfor,username,signature,userhead,callback){
                          	 //头像文件改变写入
                          	 if (userhead){
                                userInfor.collection('userInfor').updateMany({"account":req.session.account},{$set:{"username":username,"signature":signature,"userhead":userhead}},function(err,result){
                                callback(err);
                           })}
                            //没有上传头像文件不写入
                           else{
                           	    userInfor.collection('userInfor').updateMany({"account":req.session.account},{$set:{"username":username,"signature":signature}},function(err,result){
                                callback(err)})
                                }  
                          }],
                          //总回调函数
                          function(err){
                          if(err){console.log(err);res.send('上传失败！')}
                          //这里用redirect不能用res.render，因为用res.render的话浏览器地址栏上仍然访问的是/infor
			                    res.redirect('/homepage');                                                 
                          })
                        
		});
module.exports = router;

