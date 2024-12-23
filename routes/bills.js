const express = require('express');
const { queryDatabase } = require('../docs/MySQL/db_connection');

const router = express.Router();

// Fetch all bills
router.get('/get-bills', async (req, res) => {
    const query = `SELECT * FROM bills`;
    try {
        const results = await queryDatabase(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Save a bill
router.post('/save-bill', async (req, res) => {
    const {
        lrNo, date, gstPaidBy, paymentMode, from, to,
        consignor, consignorAddress, consignee, consigneeAddress,
        consigneeInvoiceNo, total, goodsEntries
    } = req.body;
    const query = `
        INSERT INTO bills (lrNo, date, gstPaidBy, paymentMode, \`from\`, \`to\`, consignor, consignorAddress,
                           consignee, consigneeAddress, consigneeInvoiceNo, total, goodsEntries)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        const result = await queryDatabase(query, [
            lrNo, date, gstPaidBy, paymentMode, from, to, consignor, consignorAddress,
            consignee, consigneeAddress, consigneeInvoiceNo, total, JSON.stringify(goodsEntries)
        ]);
        res.status(200).json({ message: "Bill saved successfully", billId: result.insertId });
    } catch (error) {
        console.error('Error saving bill:', error);
        res.status(500).send('Error saving bill');
    }
});

// Fetch bill by LR No
router.get('/get-bill/:lrNo', async (req, res) => {
    const { lrNo } = req.params;
    const query = `SELECT * FROM bills WHERE lrNo = ?`;
    try {
        const result = await queryDatabase(query, [lrNo]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json(result[0]);
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).send('Internal Server Error');
    }
});
// API route to update a bill
router.put('/api/update-bill/:id', async (req, res) => {
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
module.exports = router;
