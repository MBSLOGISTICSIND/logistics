const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'database-1.cfwkgks48tas.eu-north-1.rds.amazonaws.com', // RDS endpoint
    user: 'admin',               // Master username
    password: 'Asrar94811',      // Master password
    database: 'logistics',  // Replace with the actual database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000,
    ssl: {
        rejectUnauthorized: false, // Disable certificate validation
    }
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

// Function to test the database connection
const testConnection = async () => {
    try {
        const connection = await pool.promise().getConnection();
        console.log("Successfully connected to the database.");

        const [results] = await connection.query('SELECT 1'); // Simple query to check connection
        console.log('Connection test result:', results);
        
        connection.release();
    } catch (error) {
        console.error('Error testing the database connection:', error);
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

// Call the testConnection function to check the connection when the script is executed
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

// Export the pool and queryDatabase function for use in other parts of the application
module.exports = { pool, queryDatabase };
