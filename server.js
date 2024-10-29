const express = require('express');
const path = require('path');
const { queryDatabase } = require(path.join(__dirname, 'docs/MySQL/db_connection')); // Import queryDatabase correctly
const cors = require('cors');

const PORT = process.env.PORT || 4000; // Set the port
const app = express();

app.use(express.json()); // Middleware for parsing JSON
app.use(cors({
    origin: '*', // Allows requests from any origin
    methods: ['GET', 'POST', 'PUT'] // Allows GET, POST, and PUT methods
}));

// Serve static files from the specified directory
app.use(express.static(path.join(__dirname, 'docs/MySQL/home and login')));

// Serve Home.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/MySQL/home and login', 'Home.html'));
});

// API route to fetch all vehicle records
app.get('/api/get-vehicles', async (req, res) => {
    const query = `SELECT * FROM \`vehicle records\``; // Use backticks for table name with space

    try {
        const results = await queryDatabase(query); // Use the queryDatabase function
        console.log('SQL Query:', query); // Log the query
        console.log('Results:', results); // Log results to check if data is correct
        res.json(results); // Send the results as JSON
    } catch (error) {
        console.error('Error fetching vehicle records:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to save a vehicle record
app.post('/api/save-vehicle', async (req, res) => {
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;

    const query = `
        INSERT INTO \`vehicle records\` (image, name, owner, driver, license, fc, expiry, permit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `; // Use backticks here as well

    try {
        await queryDatabase(query, [image, name, owner, driver, license, fc, expiry, permit]);
        res.status(201).send('Vehicle record saved successfully');
    } catch (error) {
        console.error('Error saving vehicle record:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to update a vehicle record
app.put('/api/update-vehicle/:id', async (req, res) => {
    const { id } = req.params;
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;

    const query = `
        UPDATE \`vehicle records\` SET
            image = ?, name = ?, owner = ?, driver = ?, license = ?,
            fc = ?, expiry = ?, permit = ?
        WHERE id = ?
    `; // Use backticks here as well

    try {
        await queryDatabase(query, [image, name, owner, driver, license, fc, expiry, permit, id]);
        res.send('Vehicle record updated successfully');
    } catch (error) {
        console.error('Error updating vehicle record:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to delete a vehicle record
app.delete('/api/delete-vehicle/:id', async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM \`vehicle records\` WHERE id = ?`; // Use backticks here as well

    try {
        await queryDatabase(query, [id]);
        res.send('Vehicle record deleted successfully');
    } catch (error) {
        console.error('Error deleting vehicle record:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to fetch all bills
app.get('/api/get-bills', async (req, res) => {
    const query = `SELECT * FROM bills`; // Select all fields from the bills table

    try {
        const results = await queryDatabase(query); // Use the queryDatabase function
        console.log('SQL Query:', query); // Log the query
        console.log('Results:', results); // Log results to check if data is correct
        res.json(results); // Send the results as JSON
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to save a bill
app.post('/api/save-bill', async (req, res) => {
    const {
        lrNo, date, gstPaidBy, paymentMode, from,
        to, consignor, consignorAddress, consignorInvoiceNo,
        consignee, consigneeAddress, consigneeInvoiceNo,
        totalAmount, goodsEntries
    } = req.body;

    const query = `
        INSERT INTO bills (
            lrNo, date, gstPaidBy, paymentMode, \`from\`,
            \`to\`, consignor, consignorAddress, consignorInvoiceNo,
            consignee, consigneeAddress, consigneeInvoiceNo, totalAmount, goodsEntries
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        await queryDatabase(query, [
            lrNo, date, gstPaidBy, paymentMode, from,
            to, consignor, consignorAddress, consignorInvoiceNo,
            consignee, consigneeAddress, consigneeInvoiceNo, totalAmount, JSON.stringify(goodsEntries) // Store goods entries as JSON
        ]);
        res.status(201).send('Bill saved successfully');
    } catch (error) {
        console.error('Error saving bill:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to update a bill
app.put('/api/update-bill/:id', async (req, res) => {
    const { id } = req.params;
    const {
        lrNo, date, gstPaidBy, paymentMode, from,
        to, consignor, consignorAddress, consignorInvoiceNo,
        consignee, consigneeAddress, consigneeInvoiceNo,
        totalAmount, goodsEntries
    } = req.body;

    const query = `
        UPDATE bills SET
            lrNo = ?, date = ?, gstPaidBy = ?, paymentMode = ?, \`from\` = ?,
            \`to\` = ?, consignor = ?, consignorAddress = ?, consignorInvoiceNo = ?,
            consignee = ?, consigneeAddress = ?, consigneeInvoiceNo = ?,
            totalAmount = ?, goodsEntries = ?
        WHERE id = ?
    `;

    try {
        await queryDatabase(query, [
            lrNo, date, gstPaidBy, paymentMode, from,
            to, consignor, consignorAddress, consignorInvoiceNo,
            consignee, consigneeAddress, consigneeInvoiceNo, totalAmount, JSON.stringify(goodsEntries), id
        ]);
        res.send('Bill updated successfully');
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});