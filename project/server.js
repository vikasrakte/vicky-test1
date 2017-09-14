var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'example.org',
  user     : 'bob',
  password : 'secret',
});

connection.connect(function(err) {
  connected! (unless `err` is set)
});
var post  = {id: 2, name: 'datta'};
var query = connection.query('INSERT INTO person SET ?', post, function(err, result) {
  if(err){
     console.log(err);
     return ;
  }
  console.log(query.sql); 
});
