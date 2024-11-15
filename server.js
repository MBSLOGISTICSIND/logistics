const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
require('dotenv').config();
const { queryDatabase } = require(path.join(__dirname, 'docs/MySQL/db_connection')); // Import queryDatabase

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Handle larger payloads
// CORS middleware
app.use(cors({
    origin: 'https://mbslogisticsind.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Configure session
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true for HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'docs/MySQL/home and login')));

// Middleware to verify authentication
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
}

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const results = await queryDatabase(query, [username, password]);

        if (results.length > 0) {
            const sessionToken = crypto.randomBytes(64).toString('hex');
            req.session.user = { id: results[0].id, username: results[0].username, token: sessionToken };
            res.json({ message: 'Login successful', sessionToken });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// User logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged out successfully' });
    });
});

// Protect routes below this middleware
app.use(isAuthenticated);

// Fetch vehicle records
app.get('/api/get-vehicles', async (req, res) => {
    const query = `SELECT * FROM vehicle_records`;

    try {
        const results = await queryDatabase(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching vehicle records:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save a vehicle record
app.post('/api/save-vehicle', async (req, res) => {
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;

    const maxImageSize = 4294967295; // Maximum size for image data
    if (image.length > maxImageSize) {
        return res.status(400).json({ error: 'Image data is too large.' });
    }

    const query = `
        INSERT INTO vehicle_records (image, name, owner, driver, license, fc, expiry, permit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        await queryDatabase(query, [image, name, owner, driver, license, fc, expiry, permit]);
        res.status(201).json({ message: 'Vehicle record saved successfully' });
    } catch (error) {
        console.error('Error saving vehicle record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a vehicle record
app.put('/api/update-vehicle/:id', async (req, res) => {
    const { id } = req.params;
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;

    const query = `
        UPDATE vehicle_records SET
        image = ?, name = ?, owner = ?, driver = ?, license = ?,
        fc = ?, expiry = ?, permit = ?
        WHERE id = ?
    `;
    try {
        await queryDatabase(query, [image, name, owner, driver, license, fc, expiry, permit, id]);
        res.json({ message: 'Vehicle record updated successfully' });
    } catch (error) {
        console.error('Error updating vehicle record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a vehicle record
app.delete('/api/delete-vehicle/:id', async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM vehicle_records WHERE id = ?`;
    try {
        await queryDatabase(query, [id]);
        res.json({ message: 'Vehicle record deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle record:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

// Set timeout values for long-running requests
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
