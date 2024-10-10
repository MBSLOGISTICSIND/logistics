const connection = require('./db_connection');

connection.query('SELECT * FROM your_table', function (err, results) {
  if (err) throw err;
  console.log(results);
});
