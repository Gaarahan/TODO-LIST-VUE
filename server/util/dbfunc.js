const mysql = require('mysql');
const  config = require('./database_config');

module.exports.getAll = function(callback){
  const connection = mysql.createConnection(config);

  connection.connect();

  const sql = `select * from vue_todo.things order by things.thing_id desc;`;
  connection.query(sql, function (err, result) {
    if (err)
      throw err;
    callback(result);
  });
};

module.exports.add = function (addData, callback) {
  const connection = mysql.createConnection(config);

  connection.connect();

  const sql = `insert into vue_todo.things values(
      0,'${addData.title}',0);`;
  connection.query(sql, function (err, result) {
    if (err)
      throw err;
    callback(result);
  });
};

module.exports.delById = function (id, callback) {
  const connection = mysql.createConnection(config);

  connection.connect();

  const sql = `delete from vue_todo.things 
      where thing_id =  ${id} ;`;
  connection.query(sql, function (err, result) {
    if (err)
      throw err;
    callback(result);
  });
};

module.exports.updateById = function (messageJSON, callback) {
  const connection = mysql.createConnection(config);

  connection.connect();

  const sql = `update vue_todo.things 
    set thing_title='${messageJSON.title}', 
    thing_status= '${messageJSON.status}' 
    where thing_id = ${messageJSON.id};`;
  connection.query(sql, function (err, result) {
    if (err)
      throw err;
    callback(result);
  });
};

module.exports.fetchById = function (id,callback) {
  const connection = mysql.createConnection(config);

  connection.connect();

  const sql = `select * from vue_todo.things where thing_id=${id} order by things.thing_id desc;`

  connection.query(sql,function (err,result) {
    if(err)
      throw err;
    callback(result);
  })
};
