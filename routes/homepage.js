var express = require('express');
var router = express.Router();
var fs=require('fs');
var path=require('path');
var bodyParser = require('body-parser');
var getTime=require('../self_modules/getTime.js');//自定义模块，获取时间
var getBtn=require('../self_modules/getBtn.js');
var mongodb=require('mongodb');
var async = require('async');
router.get('/', function(req, res){
        var page;
        if(!req.query.moods_page)
		{page=1;}
	    else if(req.query.moods_page=='>')
	    {page=Number(req.session.page)+1;}
	    else if(req.query.moods_page=='<')
		{page=Number(req.session.page)-1;}
	    else{page=Number(req.query.moods_page)}
		req.session.page=page;
        var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
	    var user={};//存储user的信息
	    var thoughtsArr=[];//存储左栏thoughts
	    var moodsArr=[];//存储moods
	    var pageNum;//moods页数
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
                         //读取前5条thoughts，这里嵌套两个回调
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
                           userMoods.collection(req.session.account).count(function(err,count){
                               pageNum=Math.ceil(count/10);
                               userMoods.collection(req.session.account).find().sort({"number":-1}).skip((page-1)*10).limit(10).toArray(function(err,result){
                                for(let i=0;i<10;i++)
                                {
                                if(result[i])
                                   {moodsArr[i]=result[i];
                                   	if(moodsArr[i].content.length>=120)
                                       {
                                       	moodsArr[i].content=moodsArr[i].content.substring(0,120)+'...'}
                                   }
                                  else{
                                  	moodsArr[i]={};
                                  	moodsArr[i].number='';
                                  	moodsArr[i].time='';
                                  	moodsArr[i].title='';
                                  	moodsArr[i].content='';                                 	
                                  }
                                }
                                callback(err);
                               })
                           }) 
                         }],
                         //总回调函数
                         function(err){
                           if(err){console.log(err);
                           	       res.send('网页发生错误！')} 
         //由于整个async.waterfall模块本身也是异步执行的，所以要把res.render等语句也放到总回调函数中才能同步执行                  	                              	             
        var a=getBtn.getBtn(pageNum,page,9,'mo-button','mo-button-select','mo-button-none');
        res.render('homepage',{username:user.username,
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
							   moTitle0:moodsArr[0].title,
							   moTitle1:moodsArr[1].title,
							   moTitle2:moodsArr[2].title,
							   moTitle3:moodsArr[3].title,
							   moTitle4:moodsArr[4].title,
							   moTitle5:moodsArr[5].title,
							   moTitle6:moodsArr[6].title,
							   moTitle7:moodsArr[7].title,
							   moTitle8:moodsArr[8].title,
							   moTitle9:moodsArr[9].title,
							   moShort0:moodsArr[0].content,
							   moShort1:moodsArr[1].content,
							   moShort2:moodsArr[2].content,
							   moShort3:moodsArr[3].content,
							   moShort4:moodsArr[4].content,
							   moShort5:moodsArr[5].content,
							   moShort6:moodsArr[6].content,
							   moShort7:moodsArr[7].content,
							   moShort8:moodsArr[8].content,
							   moShort9:moodsArr[9].content,
							   moTime0:moodsArr[0].time,
							   moTime1:moodsArr[1].time,
							   moTime2:moodsArr[2].time,
							   moTime3:moodsArr[3].time,
							   moTime4:moodsArr[4].time,
							   moTime5:moodsArr[5].time,
							   moTime6:moodsArr[6].time,
							   moTime7:moodsArr[7].time,
							   moTime8:moodsArr[8].time,
							   moTime9:moodsArr[9].time,
							   moBtn0:a.content[0],
							   moBtn1:a.content[1],
							   moBtn2:a.content[2],
							   moBtn3:a.content[3],
							   moBtn4:a.content[4],
							   moBtn5:a.content[5],
							   moBtn6:a.content[6],
							   moBtn7:a.content[7],
							   moBtn8:a.content[8],
							   moBtnClass0:a.class[0],
							   moBtnClass1:a.class[1],
							   moBtnClass2:a.class[2],
							   moBtnClass3:a.class[3],
							   moBtnClass4:a.class[4],
							   moBtnClass5:a.class[5],
							   moBtnClass6:a.class[6],
							   moBtnClass7:a.class[7],
							   moBtnClass8:a.class[8],
							   moNumber0:moodsArr[0].number,
							   moNumber1:moodsArr[1].number,
							   moNumber2:moodsArr[2].number,
							   moNumber3:moodsArr[3].number,
							   moNumber4:moodsArr[4].number,
							   moNumber5:moodsArr[5].number,
							   moNumber6:moodsArr[6].number,
							   moNumber7:moodsArr[7].number,
							   moNumber8:moodsArr[8].number,
							   moNumber9:moodsArr[9].number,
							   }
							   );
        }
        );
	       	  
	  
});
module.exports = router;