const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '119.18.54.165',
    user: 'adzernmg',
    password: 'L01#$%lookupm',
    database: 'adzernmg_tap&relax'
  });

 connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;