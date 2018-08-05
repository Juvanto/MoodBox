var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs=require('fs');
var path=require('path');
var mongodb=require('mongodb');
var async = require('async');
router.get('/', function(req,res){ 
	    var MongoClient = mongodb.MongoClient;
	    var dburl = 'mongodb://localhost:27017';
		 MongoClient.connect(dburl, function (err,db){  
	        if (err) {console.log(err)}
            if(req.query.thoughts_number)
            {var userThoughts=db.db('userThoughts');
             userThoughts.collection(req.session.account).deleteOne({"number":Number(req.query.thoughts_number)},function(err,obj){
             	if(err){console.log(err);
             	        res.send('删除失败！');}
                res.redirect('/homepage/thoughts?thoughts_page=1')
             }) 
            }
            else if(req.query.moods_number)
            {var userMoods=db.db('userMoods');
             userMoods.collection(req.session.account).deleteOne({"number":Number(req.query.moods_number)},function(err,obj){
             	if(err){console.log(err);
             	        res.send('删除失败！');}
                res.redirect('/homepage')
             })
            }
            else{
             res.send('操作失败！')
            }
	        	})  
		})
module.exports = router;
