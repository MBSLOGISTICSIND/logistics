const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',           // Use 'localhost' for local MySQL server
    user: 'root',                // Your MySQL username, which is 'root' for local
    password: 'Asrar@121',   // Replace with your MySQL root password
    database: 'logistics_billing',  // The database you want to use
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000,        // Connection timeout
    ssl: false                    // Disable SSL for local connection (unless required)
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
        // Test if we can get a connection from the pool
        const connection = await pool.promise().getConnection();
        console.log("Successfully connected to the database.");

        // Perform a simple query to further check the connection
        const [results] = await connection.query('SELECT 1'); // Simple query to check connection
        console.log('Connection test result:', results);
        
        // Release the connection back to the pool
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
