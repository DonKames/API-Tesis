const db = require('../config/db');

const getTasksHistory = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM tasks_history');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTaskHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM tasks_history WHERE history_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createTaskHistory = async (req, res) => {
    try {
        const { task_id, status_id, timestamp } = req.body;
        const response = await db.query(
            'INSERT INTO tasks_history (task_id, status_id, timestamp) VALUES ($1, $2, $3) RETURNING *',
            [task_id, status_id, timestamp],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTaskHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { task_id, status_id, timestamp } = req.body;
        const response = await db.query(
            'UPDATE tasks_history SET task_id = $1, status_id = $2, timestamp = $3 WHERE history_id = $4 RETURNING *',
            [task_id, status_id, timestamp, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteTaskHistory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks_history WHERE history_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getTasksHistory,
    getTaskHistoryById,
    createTaskHistory,
    updateTaskHistory,
    deleteTaskHistory,
};
