const db = require('../config/db');

const getTasks = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM tasks');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM tasks WHERE task_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { task_name, task_description } = req.body;
        const response = await db.query(
            'INSERT INTO tasks (task_name, task_description) VALUES ($1, $2) RETURNING *',
            [task_name, task_description],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { task_name, task_description } = req.body;
        const response = await db.query(
            'UPDATE tasks SET task_name = $1, task_description = $2 WHERE task_id = $3 RETURNING *',
            [task_name, task_description, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE task_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};
