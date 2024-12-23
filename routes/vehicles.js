const express = require('express');
const { queryDatabase } = require('../docs/MySQL/db_connection');

const router = express.Router();

// Fetch all vehicle records
router.get('/get-vehicles', async (req, res) => {
    const query = `SELECT * FROM vehicle_records`;
    try {
        const results = await queryDatabase(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching vehicle records:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Save a vehicle record
router.post('/save-vehicle', async (req, res) => {
    const { image, name, owner, driver, license, fc, expiry, permit } = req.body;
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

// Update a vehicle record
router.put('/update-vehicle/:id', async (req, res) => {
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

// Delete a vehicle record
router.delete('/delete-vehicle/:id', async (req, res) => {
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

module.exports = router;
