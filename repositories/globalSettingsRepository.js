const db = require('../config/db');

const getGlobalSettings = async () => {
    return await db.query('SELECT * FROM global_settings');
};

const createGlobalSettings = async (idWarehouse) => {
    return await db.query(
        'INSERT INTO global_settings (main_warehouse) VALUES ($1) RETURNING *',
        [idWarehouse],
    );
};

const updateGlobalSettings = async (params) => {
    const keys = Object.keys(params);
    const values = Object.values(params);
    const setQuery = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
    const query = `UPDATE global_settings SET ${setQuery} WHERE id = $${values.length} RETURNING *`;
    return await db.query(query, values);
};

module.exports = {
    getGlobalSettings,
    createGlobalSettings,
    updateGlobalSettings,
};
