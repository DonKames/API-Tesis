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

const getUsersQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM users';

    if (!showInactive) {
        query += ' WHERE active = true';
    }

    return await db.query(query);
};

const getUserById = async (id) => {
    const query = `
    SELECT users.*, roles.name AS role_name
    FROM users
    LEFT JOIN roles ON users.fk_role_id = roles.role_id
    WHERE user_id = $1`;
    return await db.query(query, [id]);
};

const getUserByUid = async (uid) => {
    const query = 'SELECT * FROM users WHERE uid = $1';
    return await db.query(query, [uid]);
};

const getUserByEmail = async (email) => {
    const query =
        'SELECT uid, first_name, fk_role_id, user_id FROM users WHERE email = $1';
    return await db.query(query, [email]);
};

const getUsersNames = async () => {
    return await db.query('SELECT user_id, first_name, last_name FROM users');
};

const createUser = async ({ name, lastName, roleId, email }) => {
    const query =
        'INSERT INTO users (first_name, last_name, email, fk_role_id, active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    return await db.query(query, [name, lastName, email, roleId, true]);
};

const updateUserUid = async (email, uid) => {
    const query = 'UPDATE users SET uid = $1 WHERE email = $2 RETURNING *';
    return await db.query(query, [uid, email]);
};

const updateUser = async (id, { name, lastName, email, roleId }) => {
    const query =
        'UPDATE users SET first_name = $1, last_name = $2, email = $3, fk_role_id = $4 WHERE user_id = $5 RETURNING *';
    return await db.query(query, [name, lastName, email, roleId, id]);
};

const changeActiveStateUser = async (id, isActive) => {
    const query = 'UPDATE users SET active = $1 WHERE user_id = $2 RETURNING *';
    return await db.query(query, [isActive, id]);
};

module.exports = {
    getUsers,
    getUsersQty,
    getUserById,
    getUserByUid,
    getUserByEmail,
    getUsersNames,
    createUser,
    updateUser,
    updateUserUid,
    changeActiveStateUser,
};
