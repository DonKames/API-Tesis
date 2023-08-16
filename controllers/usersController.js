const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getUsers = async (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;

    const response = await db.query(
        'SELECT * FROM users ORDER BY user_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );

    res.status(200).json(response.rows);
};

const getUsersQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM users');
    const usersQty = parseInt(response.rows[0].count);
    res.status(200).json(usersQty);
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

        console.log(email);
        const response = await db.query(
            'SELECT uid, first_name, fk_role_id FROM users WHERE email = $1',
            [email],
        );
        console.log(response.rows);

        // Se revisa si encontró un usuario con el email proporcionado
        if (response.rows.length > 0) {
            // Si encontró un usuario, envía una respuesta con el usuario y un código de estado 200
            res.status(200).json(response.rows[0]);
        } else {
            // Si no se encontró ningún usuario, envía una respuesta con un cuerpo vacío y un código de estado 204
            console.log(
                'No se encontró ningún usuario con el email proporcionado',
            );
            res.status(204).send();
        }
        // res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error get Users by Email' });
    }
};

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, lastName, role, email } = req.body;

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
        const { username, role, email } = req.body;

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
    getUsers: handleErrors(getUsers),
    getUsersQty: handleErrors(getUsersQty),
    getUserById: handleErrors(getUserById),
    getUserByUid: handleErrors(getUserByUid),
    getUserByEmail: handleErrors(getUserByEmail),
    createUser: handleErrors(createUser),
    updateUser: handleErrors(updateUser),
    updateUserUid: handleErrors(updateUserUid),
    deleteUser: handleErrors(deleteUser),
};
