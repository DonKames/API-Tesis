const db = require('../config/db');

const getRfidReadings = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM rfid_readings');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getRfidReadingById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM rfid_readings WHERE reading_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createRfidReading = async (req, res) => {
    try {
        const { reader_id, product_id, timestamp } = req.body;
        const response = await db.query(
            'INSERT INTO rfid_readings (reader_id, product_id, timestamp) VALUES ($1, $2, $3) RETURNING *',
            [reader_id, product_id, timestamp],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteRfidReading = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM rfid_readings WHERE reading_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getRfidReadings,
    getRfidReadingById,
    createRfidReading,
    deleteRfidReading,
};
