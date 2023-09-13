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

const updateGlobalSettings = async (
    idMainBranch,
    idMainWarehouse,
    idGlobalSettings,
) => {
    console.log(
        'GlobalSettingsRepo: ',
        idMainBranch,
        idMainWarehouse,
        idGlobalSettings,
    );
    return await db.query(
        'UPDATE global_settings SET main_branch = $1, main_warehouse = $2 WHERE global_settings_id = $3 RETURNING *',
        [idMainBranch, idMainWarehouse, idGlobalSettings],
    );
};

module.exports = {
    getGlobalSettings,
    createGlobalSettings,
    updateGlobalSettings,
};
