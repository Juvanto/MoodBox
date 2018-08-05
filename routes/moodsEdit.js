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
	 if(!req.query.moods_number){res.send('操作失败！')}
	 var MongoClient = mongodb.MongoClient;
	 var dburl = 'mongodb://localhost:27017';
	 MongoClient.connect(dburl, function (err,db){  
	    if (err) {console.log(err)}
        var userMoods=db.db('userMoods');
        userMoods.collection(req.session.account).updateMany({"number":Number(req.query.moods_number)},{$set:{"title":req.body.modeEditTitle,"content":req.body.modeEditContent}},function(err,result){
            if(err){console.log(err);
                    res.send('操作失败！')}
            res.redirect('/homepage/moods?moods_number='+req.query.moods_number)
        })
})
	})
module.exports = router;
