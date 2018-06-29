var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var getTime=require('../self_modules/getTime.js');//自定义模块，获取时间
var getBtn=require('../self_modules/getBtn.js');
var mongodb=require('mongodb');
var async = require('async');
//router.get的路径用'/'的原因:此处是相对的路径，代表该页面处理的路径
//防止用户直接访问/thoughts       
router.get('/',function(req,res,next){if(!req.session.account)
	                                    {res.send('请先<a href="/">登录</a>！')}								       
                                      else{next()}
									 })
									 									 
router.get('/', function(req,res){
	    var page;
	    if(req.query.thoughts_page=='>')
	    {page=Number(req.session.page)+1;}
	    else if(req.query.thoughts_page=='<')
		{page=Number(req.session.page)-1;}
	    else{page=Number(req.query.thoughts_page)}
		req.session.page=page;//将访问页码以session返回客户端，当用户按下><号时可以用到
	    var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
	    var user={};//存储user的信息
	    var thoughtsArr=[];//存储左栏thoughts
	    var thArr=[];//存储thoughts列表
	    var thTimeCla=[];//存储thoughts列表的时间样式(作用是隐藏删除键)
	    var pageNum;//thoughts页数
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
                            callback(err,userThoughts,db);	
                          })  
                         },
                         function(userThoughts,b,callback){
                           userThoughts.collection(req.session.account).count(function(err,count){
                               pageNum=Math.ceil(count/10);
                               userThoughts.collection(req.session.account).find().sort({"number":-1}).skip((page-1)*10).limit(10).toArray(function(err,result){
                                for(let i=0;i<10;i++)
                                {
                                if(result[i])
                                   {thArr[i]=result[i];
                                   	thTimeCla[i]='';}
                                  else{
                                  	thArr[i]={};
                                  	thArr[i].number='';
                                  	thArr[i].time='';
                                  	thArr[i].content='';
                                  	thTimeCla[i]='th-time-none';                                 	
                                  }
                                }
                                callback(err);
                               })
                           }) 
                         }],
                         //回调总函数
                         function(err){
                           if(err){console.log(err);
                           	       res.send('网页发生错误！')}                          	       

	    let a=getBtn.getBtn(pageNum,page,9,'th-button','th-button-select','th-button-none');
		res.render('homeThoughts',{username:user.username,
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
								   thBtnClass0:a.class[0],
								   thBtnClass1:a.class[1],
								   thBtnClass2:a.class[2],
								   thBtnClass3:a.class[3],
								   thBtnClass4:a.class[4],
								   thBtnClass5:a.class[5],
								   thBtnClass6:a.class[6],
								   thBtnClass7:a.class[7],
								   thBtnClass8:a.class[8],
								   thBtn0:a.content[0],
								   thBtn1:a.content[1],
								   thBtn2:a.content[2],
								   thBtn3:a.content[3],
								   thBtn4:a.content[4],
								   thBtn5:a.content[5],
								   thBtn6:a.content[6],
								   thBtn7:a.content[7],
								   thBtn8:a.content[8],
								   th0:thArr[0].content,
								   th1:thArr[1].content,
								   th2:thArr[2].content,
								   th3:thArr[3].content,
								   th4:thArr[4].content,
								   th5:thArr[5].content,
								   th6:thArr[6].content,
								   th7:thArr[7].content,
								   th8:thArr[8].content,
								   th9:thArr[9].content,
								   thTime0:thArr[0].time,
								   thTime1:thArr[1].time,
								   thTime2:thArr[2].time,
								   thTime3:thArr[3].time,
								   thTime4:thArr[4].time,
								   thTime5:thArr[5].time,
								   thTime6:thArr[6].time,
								   thTime7:thArr[7].time,
								   thTime8:thArr[8].time,
								   thTime9:thArr[9].time,
                                   thTimeCla0:thTimeCla[0],
  								   thTimeCla1:thTimeCla[1],
								   thTimeCla2:thTimeCla[2],
								   thTimeCla3:thTimeCla[3],
								   thTimeCla4:thTimeCla[4],
								   thTimeCla5:thTimeCla[5],
								   thTimeCla6:thTimeCla[6],
								   thTimeCla7:thTimeCla[7],
								   thTimeCla8:thTimeCla[8],
								   thTimeCla9:thTimeCla[9],
								   thNumber0:thArr[0].number,
								   thNumber1:thArr[1].number,
								   thNumber2:thArr[2].number,
								   thNumber3:thArr[3].number,
								   thNumber4:thArr[4].number,
								   thNumber5:thArr[5].number,
								   thNumber6:thArr[6].number,
								   thNumber7:thArr[7].number,
								   thNumber8:thArr[8].number,
								   thNumber9:thArr[9].number
							      }
							      );
	         })
	  }     	  
	  );       	 

module.exports = router;