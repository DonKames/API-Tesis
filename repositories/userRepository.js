const db = require('../config/db');

const getUsers = async (limit, offset, showInactive, searchTerm) => {
    let baseQuery = `
        FROM users AS u
        LEFT JOIN roles AS r ON u.fk_role_id = r.role_id
    `;

    const whereConditions = [];
    const params = [];

    if (!showInactive) {
        whereConditions.push('u.active = true');
    }

    if (searchTerm) {
        const searchTermCondition = `
            (u.first_name ILIKE $${params.length + 1} OR 
            u.last_name ILIKE $${params.length + 1} OR 
            u.email ILIKE $${params.length + 1} OR 
            r.name ILIKE $${params.length + 1})
        `;
        whereConditions.push(searchTermCondition);
        params.push(`%${searchTerm}%`);
    }

    if (whereConditions.length) {
        baseQuery += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Query para obtener los datos
    const dataQuery =
        `
        SELECT
            u.user_id, u.first_name, u.last_name, u.fk_role_id, u.email, u.active,
            r.name AS role_name
    ` +
        baseQuery +
        `
        ORDER BY u.active ASC, u.user_id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    // Query para contar el total de registros
    const countQuery = `SELECT COUNT(*) ` + baseQuery;

    params.push(limit, offset);

    const data = await db.query(dataQuery, params);
    const totalResult = await db.query(countQuery, params.slice(0, -2)); // Excluye limit y offset para el conteo
    const qty = parseInt(totalResult.rows[0].count, 10);

    return { data: data.rows, qty };
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
