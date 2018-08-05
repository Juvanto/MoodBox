var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var getTime=require('../self_modules/getTime.js');//自定义模块，获取时间
var getBtn=require('../self_modules/getBtn.js');
var mongodb=require('mongodb');
var async = require('async');									 									 
router.get('/', function(req,res){
        var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
	    var user={};//存储user的信息
	    var thoughtsArr=[];//存储左栏thoughts
	    var moods={};//存储moods具体信息
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
                           if(result.length===0){res.send('网页发生错误！')}
                           else{
                           	     user.username=result[0].username;
                           	     user.signature=result[0].signature;
                           	     user.userhead=result[0].userhead;
                           	     callback(err,db)
                               }  
                         })
                         },
                         function(db,callback){
                          var userThoughts=db.db('userThoughts');
                          userThoughts.collection(req.session.account).count(function(err,count){
                            if(count>=5)
                            {
                             userThoughts.collection(req.session.account).find().sort({"number":-1}).limit(5).toArray(function(err,result){
                                  thoughtsArr=result;                                
                             })
                            }
                            else{userThoughts.collection(req.session.account).find().sort({"number":-1}).toArray(function(err,result){
                            	 thoughtsArr=result;                              
                            	 for(let i=0;i<5;i++)
                            	 {
                            	  if(!thoughtsArr[i])
                                  {thoughtsArr[i]={};
                                   thoughtsArr[i].number='';
                                   thoughtsArr[i].time='';
                                   thoughtsArr[i].content='';
                                  }
                            	 }                                
                                }
                            )}
                            callback(err,db);	
                          })  
                         },
                         function(db,callback){
                         	 var userMoods=db.db('userMoods');
                         	 userMoods.collection(req.session.account).find({"number":Number(req.query.moods_number)}).toArray(function(err,result){
                              moods.title=result[0].title;
                              moods.time=result[0].time;
                              moods.content=result[0].content;                     
                              callback(err);
                         	 })
                         }],
                         //总回调函数
                         function(err){
                           if(err){console.log(err);
                           	       res.send('网页发生错误！')}

		res.render('homeMoods',{username:user.username,
		                        signature:user.signature,
							    userhead:user.userhead,
							    thoughts0:thoughtsArr[0].content,
							    thoughts1:thoughtsArr[1].content,
							    thoughts2:thoughtsArr[2].content,
							    thoughts3:thoughtsArr[3].content,
							    thoughts4:thoughtsArr[4].content,
							    thoughtsTime0:thoughtsArr[0].time,
							    thoughtsTime1:thoughtsArr[1].time,
							    thoughtsTime2:thoughtsArr[2].time,
							    thoughtsTime3:thoughtsArr[3].time,
							    thoughtsTime4:thoughtsArr[4].time,
								modeTitle:moods.title,
								modeTime:moods.time,
								modeContent:moods.content,
                                modeNumber:req.query.moods_number//返回文章号码用于编辑和删除								   
							    }
							    );
	}
	)	        	 
})
module.exports = router;
