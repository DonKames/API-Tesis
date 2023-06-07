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

const getUserByUid = async (req, res) => {
    try {
        const { uid } = req.params;
        const response = await db.query('SELECT * FROM users WHERE uid = $1', [
            uid,
        ]);
        if (response.rows.length > 0) {
            res.status(200).json(response.rows[0]);
        } else {
            // Si no se encontró ningún usuario, envía una respuesta con un cuerpo vacío y un código de estado 204
            res.status(204).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error get Users by Id' });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const response = await db.query(
            'SELECT uid, first_name, fk_role_id FROM users WHERE email = $1',
            [email],
        );
        if (response.rows.length > 0) {
            res.status(200).json(response.rows[0]);
        } else {
            // Si no se encontró ningún usuario, envía una respuesta con un cuerpo vacío y un código de estado 204
            res.status(204).send();
        }
        // res.status(200).json(response.rows[0]);
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

const updateUserUid = async (req, res) => {
    console.log('cuerpo:', req.body);
    console.log('params:', req.params);
    try {
        console.log('update user uid');
        const { email } = req.params;
        const { uid } = req.body;

        const response = await db.query(
            'UPDATE users SET uid = $1 WHERE email = $2 RETURNING *',
            [uid, email],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.log(' error en update user uid', err);
        console.error(err);
        res.status(500).json({ error: 'Error Update User' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, role, email } = req.body;

        const response = await db.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, fk_role_id = $4, uid = $5 WHERE user_id = $5 RETURNING *',
            [username, role, email, id],
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
    getUserByUid,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserUid,
    deleteUser,
};
