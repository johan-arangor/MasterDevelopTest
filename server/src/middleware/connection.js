var mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'master_test_video',
  user: 'root',
  password: ''
});

module.exports = connection;