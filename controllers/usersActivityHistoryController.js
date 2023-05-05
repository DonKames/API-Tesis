const db = require('../config/db');

const getUsersActivityHistory = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM users_activity_history');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserActivityHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM users_activity_history WHERE history_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createUserActivityHistory = async (req, res) => {
    try {
        const { user_id, activity, timestamp } = req.body;
        const response = await db.query(
            'INSERT INTO users_activity_history (user_id, activity, timestamp) VALUES ($1, $2, $3) RETURNING *',
            [user_id, activity, timestamp],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserActivityHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, activity, timestamp } = req.body;
        const response = await db.query(
            'UPDATE users_activity_history SET user_id = $1, activity = $2, timestamp = $3 WHERE history_id = $4 RETURNING *',
            [user_id, activity, timestamp, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUserActivityHistory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM users_activity_history WHERE history_id = $1',
            [id],
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUsersActivityHistory,
    getUserActivityHistoryById,
    createUserActivityHistory,
    updateUserActivityHistory,
    deleteUserActivityHistory,
};
