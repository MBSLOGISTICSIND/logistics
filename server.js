const express = require('express');
const path = require('path');
const { queryDatabase } = require(path.join(__dirname, 'docs/MySQL/db_connection')); // Import queryDatabase correctly
const cors = require('cors');
require('dotenv').config(); // To manage environment variables

const PORT = process.env.PORT || 4000; // Set the port
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Increased payload limit
app.use(cors({
    origin: 'https://mbslogisticsind.github.io', // Specify your GitHub Pages URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
// Serve static files from the specified directory
app.use(express.static(path.join(__dirname, 'docs/MySQL/home and login')));

// Serve Home.html at the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/MySQL/home and login', 'Home.html'));
});

// API route to fetch all vehicle records
app.get('/api/get-vehicles', async (req, res) => {
    const query = `SELECT * FROM vehicle_records`;

    try {
        const results = await queryDatabase(query);
        console.log('SQL Query:', query);
        console.log('Results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching vehicle records:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API route to save a vehicle record
app.post('/api/save-vehicle', async (req, res) => {
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;

    const maxImageSize = 4294967295; // LongText max size in bytes
    if (image.length > maxImageSize) {
        return res.status(400).send('Image data is too long.');
    }

    const query = `
        INSERT INTO vehicle_records (image, name, owner, driver, license, fc, expiry, permit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

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
        UPDATE vehicle_records SET
            image = ?, name = ?, owner = ?, driver = ?, license = ?,
            fc = ?, expiry = ?, permit = ?
        WHERE id = ?
    `;

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

    const query = `DELETE FROM vehicle_records WHERE id = ?`;

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
    const query = `SELECT * FROM bills`;
    try {
        const results = await queryDatabase(query);
        console.log('SQL Query:', query);
        console.log('Results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).send('Internal Server Error');
    }
});
// API route to save a bill
app.post('/api/save-bill', async (req, res) => {
    const {
        lrNo, date, gstPaidBy, paymentMode, from, to,
        consignor, consignorAddress, consignee, consigneeAddress,
        consigneeInvoiceNo, total, goodsEntries
    } = req.body;
    // Insert the bill into the database (adjust the query according to your schema)
    const query = `
        INSERT INTO bills (lrNo, date, gstPaidBy, paymentMode, \`from\`, \`to\`, consignor, consignorAddress,
                           consignee, consigneeAddress, consigneeInvoiceNo, \`No of Articles\`, total, goodsEntries)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const result = await queryDatabase(query, [
            lrNo, date, gstPaidBy, paymentMode, from, to, consignor, consignorAddress,
            consignee, consigneeAddress, consigneeInvoiceNo, consignorAddress, total, JSON.stringify(goodsEntries)
        ]);
        res.status(200).json({ message: "Bill saved successfully", billId: result.insertId });
    } catch (error) {
        console.error('Error saving bill:', error);
        res.status(500).send('Error saving bill');
    }
});
// Update GET endpoint to fetch by lrNo
app.get('/api/bill/:lrNo', async (req, res) => {
    const { lrNo } = req.params; // Use lrNo from URL params
    
    const query = `SELECT * FROM bills WHERE lrNo = ?`; // Query by lrNo, not id
    
    try {
        console.log('Querying for bill LR No:', lrNo); // Debugging line
        const bill = await queryDatabase(query, [lrNo]);
        if (bill.length > 0) {
            res.status(200).json(bill[0]); // Return the bill if found
        } else {
            res.status(404).json({ error: 'Bill not found for the given LR No' });
        }
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API route to update a bill
app.put('/api/update-bill/:id', async (req, res) => {
    const { id } = req.params;
    const {
        lrNo, date, gstPaidBy, paymentMode, from, to,
        consignor, consignorAddress, consignee, consigneeAddress,
        consigneeInvoiceNo, total, goodsEntries
    } = req.body;

    // Ensure the goods entries are in the right format
    const goodsEntriesJson = JSON.stringify(goodsEntries);

    const query = `
        UPDATE bills SET lrNo = ?, date = ?, gstPaidBy = ?, paymentMode = ?, \`from\` = ?, \`to\` = ?,
                        consignor = ?, consignorAddress = ?, consignee = ?, consigneeAddress = ?,
                        consigneeInvoiceNo = ?, \`No of Articles\` = ?, total = ?, goodsEntries = ?
        WHERE id = ?
    `;
    
    try {
        await queryDatabase(query, [
            lrNo, date, gstPaidBy, paymentMode, from, to, consignor, consignorAddress,
            consignee, consigneeAddress, consigneeInvoiceNo, goodsEntries.length, total, goodsEntriesJson, id
        ]);
        res.status(200).json({ message: "Bill updated successfully" });
    } catch (error) {
        console.error('Error updating bill:', error);
        res.status(500).send('Error updating bill');
    }
});


app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


// Start the server and set the timeouts
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
// Set timeout values
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds    