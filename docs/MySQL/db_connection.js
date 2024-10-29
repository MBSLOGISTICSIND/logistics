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
        // Test if we can get a connection from the pool
        const connection = await pool.promise().getConnection();
        console.log("Successfully connected to the database.");

        // Optional: Perform a simple query to check the connection further
        const results = await connection.query('SELECT 1'); // Simple query to check connection
        console.log('Connection test result:', results);
        
        // Release the connection back to the pool
        connection.release();
    } catch (error) {
        console.error('Error fetching data:', error);
        switch (error.code) {
            case 'ECONNREFUSED':
                console.error('Connection refused. Please check your database server and configuration.');
                break;
            case 'ER_ACCESS_DENIED_ERROR':
                console.error('Access denied. Check your username and password.');
                break;
            case 'ENOTFOUND':
                console.error('Database host not found. Please check your host configuration.');
                break;
            case 'ER_BAD_DB_ERROR':
                console.error('Database does not exist. Check your database name.');
                break;
            default:
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
