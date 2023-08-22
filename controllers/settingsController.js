const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getGlobalSettings = async (req, res) => {
    const response = await db.query('SELECT * FROM global_settings');
    res.status(200).json(response.rows[0]);
};

const createGlobalSettings = async (req, res) => {
    console.log(req.body);
    const idWarehouse = req.body.warehouse_id;
    const response = await db.query(
        'INSERT INTO global_settings (main_warehouse) VALUES ($1) RETURNING *',
        [idWarehouse],
    );
    res.status(201).json(response.rows[0]);
};

const updateGlobalSettings = async (req, res) => {
    const { mainWarehouseId, globalSettingsId } = req.body;
    const response = await db.query(
        'UPDATE global_settings SET main_warehouse = $1 WHERE global_settings_id = $2 RETURNING *',
        [mainWarehouseId, globalSettingsId],
    );
    res.status(200).json(response.rows[0]);
};

module.exports = {
    getGlobalSettings: handleErrors(getGlobalSettings),
    createGlobalSettings: handleErrors(createGlobalSettings),
    updateGlobalSettings: handleErrors(updateGlobalSettings),
};
