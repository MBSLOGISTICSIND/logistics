const { Pool } = require('pg');

// Create a connection pool to manage database connections
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',          // Use your external DB host if deployed
    user: process.env.DB_USER || 'postgres',           // Use environment variable for DB username
    password: process.env.DB_PASSWORD || 'Asrar@121',   // Use environment variable for DB password
    database: process.env.DB_NAME || 'logistics_billing', // Use environment variable for DB name
    port: process.env.DB_PORT || 5432,                  // Default PostgreSQL port
    max: 10,                                            // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,                          // Close clients after 30 seconds of inactivity
});

// Function to execute a query and return results
const queryDatabase = async (query, params) => {
    try {
        const results = await pool.query(query, params);
        return results.rows; // Return the rows from the result
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

const testConnection = async () => {
    try {
        // Test if we can get a connection from the pool
        const client = await pool.connect();
        console.log("Successfully connected to the database.");

        // Optional: Perform a simple query to check the connection further
        const res = await client.query('SELECT 1'); // Simple query to check connection
        console.log('Connection test result:', res.rows);

        // Release the client back to the pool
        client.release();
    } catch (error) {
        console.error('Error fetching data:', error);
        switch (error.code) {
            case 'ECONNREFUSED':
                console.error('Connection refused. Please check your database server and configuration.');
                break;
            case '28P01': // PostgreSQL access denied error code
                console.error('Access denied. Check your username and password.');
                break;
            case 'ENOTFOUND':
                console.error('Database host not found. Please check your host configuration.');
                break;
            case '3D000': // PostgreSQL database does not exist error code
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
