const db = require('../config/db');
const bcrypt = require('bcrypt');

const getUsers = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM users');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error Get Users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM users WHERE user_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error get Users by Id' });
    }
};

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, lastName, role, email, temporalPass } = req.body;

        // if (!temporalPass) {
        //     throw new Error('Campo temporalPassword requerido');
        // }

        const response = await db.query(
            'INSERT INTO users (first_name, last_name, email, fk_role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, lastName, email, role],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error('el error', err);
        res.status(500).json({
            error: err,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role, email } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const response = await db.query(
            'UPDATE users SET username = $1, password = $2, role = $3, email = $4 WHERE user_id = $5 RETURNING *',
            [username, hashedPassword, role, email, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error Update User' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE user_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error Delete User' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
