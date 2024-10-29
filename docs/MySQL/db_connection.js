const mysql = require('mysql2');

// Create a connection pool to manage database connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',        // Use your external DB host if deployed
    user: process.env.DB_USER || 'root',             // Use environment variable for DB username
    password: process.env.DB_PASSWORD || 'Asrar@121', // Use environment variable for DB password
    database: process.env.DB_NAME || 'logistics_billing', // Use environment variable for DB name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to execute a query and return results
const queryDatabase = async (query, params) => {
    try {
        const [results] = await pool.promise().query(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

const testConnection = async () => {
    try {
        const results = await queryDatabase('SELECT * FROM bills');
        console.log('Results:', results);
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please check your database server and configuration.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Check your username and password.');
        } else if (error.code === 'ENOTFOUND') {
            console.error('Database host not found. Please check your host configuration.');
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
};


// Call the testConnection function to test the database connection
testConnection();

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

module.exports = { pool, queryDatabase };
