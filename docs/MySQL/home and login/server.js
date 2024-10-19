const express = require('express');
const path = require('path');
const connection = require('./logistics/home/MySQL/MYSQL/db_connection');  // Import MySQL connection
const PORT = process.env.PORT || 4000; // Make sure to use correct port

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Serve static files
app.use(express.static(path.join(__dirname, 'logistics/home/MySQL/home_and_login')));

// Serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'logistics/home/MySQL/home_and_login', 'home.html'));
});

// API Route to fetch bills
app.get('/api/get-bills', (req, res) => {
    const query = 'SELECT * FROM bills';

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching bills:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results); // Send the results as JSON
    });
});

// API Route to save a bill
app.post('/api/save-bill', (req, res) => {
    const {
        lr_no,
        manual_bill_no,
        bill_no,
        customer_name,
        from_location,
        to_location,
        consignor,
        consignee,
        goods,
        no_of_articles,
        rate_per_article,
        gst_amount,
        freight,
        total,
        date,
        time
    } = req.body;

    const query = `
        INSERT INTO bills (
            lr_no,
            manual_bill_no,
            bill_no,
            customer_name,
            from_location,
            to_location,
            consignor,
            consignee,
            goods,
            no_of_articles,
            rate_per_article,
            gst_amount,
            freight,
            total,
            date,
            time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [
        lr_no,
        manual_bill_no,
        bill_no,
        customer_name,
        from_location,
        to_location,
        consignor,
        consignee,
        goods,
        no_of_articles,
        rate_per_article,
        gst_amount,
        freight,
        total,
        date,
        time
    ], (error) => {
        if (error) {
            console.error('Error saving bill:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).send('Bill saved successfully');
    });
});

// Start the server only once
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
