const db = require('../config/db');

const getReaders = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM readers');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getReaderById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM readers WHERE reader_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createReader = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const response = await db.query(
            'INSERT INTO readers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, address],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateReader = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        const response = await db.query(
            'UPDATE readers SET name = $1, email = $2, phone = $3, address = $4 WHERE reader_id = $5 RETURNING *',
            [name, email, phone, address, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReader = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM readers WHERE reader_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getReaders,
    getReaderById,
    createReader,
    updateReader,
    deleteReader,
};
