var express = require('express');
var router = express.Router();
router.get('/', function(req, res){
  res.render('index');
});//以render的文件作为get的响应
module.exports = router;