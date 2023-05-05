const db = require('../config/db');

const getStatuses = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM statuses');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM statuses WHERE status_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createStatus = async (req, res) => {
    try {
        const { status_name } = req.body;
        const response = await db.query(
            'INSERT INTO statuses (status_name) VALUES ($1) RETURNING *',
            [status_name],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_name } = req.body;
        const response = await db.query(
            'UPDATE statuses SET status_name = $1 WHERE status_id = $2 RETURNING *',
            [status_name, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM statuses WHERE status_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getStatuses,
    getStatusById,
    createStatus,
    updateStatus,
    deleteStatus,
};
