const db = require('../config/db');

const getRfids = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM rfids');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getRfidById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM rfids WHERE rfid_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createRfid = async (req, res) => {
    try {
        const { rfid_code } = req.body;
        const response = await db.query(
            'INSERT INTO rfids (rfid_code) VALUES ($1) RETURNING *',
            [rfid_code],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateRfid = async (req, res) => {
    try {
        const { id } = req.params;
        const { rfid_code } = req.body;
        const response = await db.query(
            'UPDATE rfids SET rfid_code = $1 WHERE rfid_id = $2 RETURNING *',
            [rfid_code, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteRfid = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM rfids WHERE rfid_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getRfids,
    getRfidById,
    createRfid,
    updateRfid,
    deleteRfid,
};
