const express = require('express');
const  router = express.Router();
const dbFunc = require('../util/dbfunc');

router.get('/all',function(req,res){
  dbFunc.getAll(function (result) {
    res.send(result);
  });
});

router.post('/add',function (req,res) {
  dbFunc.add(req.body,() => {
    res.end('ok');
  });
});

router.post('/edit',function (req, res) {
  dbFunc.updateById(req.body,()=>{
    res.end();
  });
});

router.get('/del',function (req,res) {
  let id = req.query.id;
  dbFunc.delById(id, () => {
    res.end('ok');
  });
});

router.post('/check',function (req, res) {
  dbFunc.getAll(function (result) {
    //获取数据
    let postData = [];
    for (let i = 0; i < result.length; i++)
      postData.push(result[i]);

    //获取并修改当前数据
    let curData = postData[req.body.index];
    curData.status = req.body.checked?"complete":"active";
    /** @namespace curData.things_id */
    let id = curData.things_id;
    dbFunc.updateById(curData,id,() => {
      res.end();
    });
  });
});

router.get('/fetch',function (req, res) {
  dbFunc.fetchById(req.query.id,function (result) {
    res.send(result);
  });
});



module.exports = router;
