const db = require('../config/db');

const getRolesSelect = async () => {
    const query = `SELECT role_id, name FROM roles ORDER BY role_id ASC`;
    return await db.query(query);
};

module.exports = {
    getRolesSelect,
};
