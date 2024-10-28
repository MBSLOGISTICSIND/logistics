const mysql = require('mysql2');

// Create a connection pool to manage database connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Asrar@121', // Update this to your MySQL password
    database: 'logistics_billing', // Ensure this is the correct database name
    waitForConnections: true,
    connectionLimit: 10, // Adjust based on your application's needs
    queueLimit: 0
});

// Function to execute a query and return results
const queryDatabase = async (query, params) => {
    try {
        const [results] = await pool.promise().query(query, params);
        return results; // Return the results from the query
    } catch (error) {
        console.error('Database query error:', error);
        throw error; // Rethrow the error for further handling
    }
};

// Test connection to the database
const testConnection = async () => {
    try {
        const results = await queryDatabase('SELECT * FROM bills');
        console.log('Results:', results); // Log the results
    } catch (error) {
        console.error('Error fetching data:', error);
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

module.exports = { pool, queryDatabase }; // Export the pool and query function