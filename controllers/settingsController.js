const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getGlobalSettings = async (req, res) => {
    const response = await db.query('SELECT * FROM global_settings');
    res.status(200).json(response.rows);
};

const createGlobalSettings = async (req, res) => {
    const { name, value } = req.body;
    const response = await db.query(
        'INSERT INTO global_settings (main_warehouse) VALUES ($1) RETURNING *',
        [name, value],
    );
    res.status(201).json(response.rows[0]);
};

const updateGlobalSettings = async (req, res) => {
    const { mainWarehouse, id } = req.body;
    const response = await db.query(
        'UPDATE global_settings SET main_warehouse = $1, WHERE id = $2 RETURNING *',
        [mainWarehouse, id],
    );
    res.status(200).json(response.rows[0]);
};

module.exports = {
    getGlobalSettings: handleErrors(getGlobalSettings),
    createGlobalSettings: handleErrors(createGlobalSettings),
    updateGlobalSettings: handleErrors(updateGlobalSettings),
};
