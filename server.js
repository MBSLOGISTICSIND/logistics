const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicles');
const billRoutes = require('./routes/bills');

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: 'https://mbslogisticsind.github.io',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'docs/MySQL/home and login')));

// Serve home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/MySQL/home and login', 'Home.html'));
});

// Use routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bills', billRoutes);

// Error handling
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Timeout settings
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
