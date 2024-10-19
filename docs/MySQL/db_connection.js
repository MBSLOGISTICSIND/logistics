
const mysql = require('mysql2'); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asrar@121',
    database: 'logistics_billing'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

module.exports = connection; // Ensure this line is present
 
// Connect to the database
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);

    // Example query to select data
    connection.query('SELECT * FROM your_table_name', function (err, results, fields) {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        console.log('Results:', results);

        // Close the connection
        connection.end();
    });
});