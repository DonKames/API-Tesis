const db = require('../config/db');

const getUsers = async (limit, offset, showInactive) => {
    let query = `
        SELECT
            u.user_id, u.first_name, u.last_name, u.fk_role_id, u.email, u.active,
            r.name AS role_name
        FROM users AS u
        LEFT JOIN roles AS r ON u.fk_role_id = r.role_id
    `;

    if (!showInactive) {
        query += ' WHERE u.active = true';
    }

    query += ' ORDER BY u.active ASC, u.user_id ASC LIMIT $1 OFFSET $2';

    const params = [limit, offset];
    return await db.query(query, params);
};

const getUsersQty = async () => {
    const query = 'SELECT COUNT(*) FROM users';
    return await db.query(query);
};

const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    return await db.query(query, [id]);
};

const getUserByUid = async (uid) => {
    const query = 'SELECT * FROM users WHERE uid = $1';
    return await db.query(query, [uid]);
};

const getUserByEmail = async (email) => {
    const query =
        'SELECT uid, first_name, fk_role_id FROM users WHERE email = $1';
    return await db.query(query, [email]);
};

const createUser = async ({ name, lastName, role, email }) => {
    const query =
        'INSERT INTO users (first_name, last_name, email, fk_role_id) VALUES ($1, $2, $3, $4) RETURNING *';
    return await db.query(query, [name, lastName, email, role]);
};

const updateUserUid = async (email, uid) => {
    const query = 'UPDATE users SET uid = $1 WHERE email = $2 RETURNING *';
    return await db.query(query, [uid, email]);
};

const updateUser = async (id, { username, role, email }) => {
    const query =
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, fk_role_id = $4 WHERE user_id = $5 RETURNING *';
    return await db.query(query, [username, role, email, id]);
};

module.exports = {
    getUsers,
    getUsersQty,
    getUserById,
    getUserByUid,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserUid,
};
