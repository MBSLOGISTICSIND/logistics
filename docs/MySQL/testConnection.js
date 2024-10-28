const mysql = require('mysql2');

// Create a connection pool to manage database connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Asrar@121',  // Update this to your MySQL password
    database: 'logistics_billing',  // Update this to your actual database name
    waitForConnections: true,
    connectionLimit: 10,  // You can adjust the number of connections in the pool
    queueLimit: 0
});

// Example query to select data from the database
pool.query('SELECT * FROM bills', function (err, results, fields) {
    if (err) {
        console.error('Error executing query:', err);
        return;
    }
    console.log('Results:', results);
});

// Close the pool when the application terminates
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing the connection pool:', err);
        } else {
            console.log('Connection pool closed');
        }
        process.exit(0);
    });
});
