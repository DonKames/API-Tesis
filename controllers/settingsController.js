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
    const params = req.body;
    const keys = Object.keys(params);
    const values = Object.values(params);

    // Asegúrate de que hay algo que actualizar
    if (keys.length === 0) {
        return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    // Construye la parte SET de la consulta
    const setQuery = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    // Agrega el ID si es necesario (asumiendo que tienes un parámetro de ID)
    if (params.id) {
        values.push(params.id);
    }

    // Construye la consulta completa
    const query = `UPDATE global_settings SET ${setQuery} WHERE id = $${values.length} RETURNING *`;

    try {
        const response = await db.query(query, values);
        res.status(200).json(response.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la configuración' });
    }
};

// const updateGlobalSettings = async (req, res) => {
//     const { mainWarehouseId, globalSettingsId } = req.body;
//     const response = await db.query(
//         'UPDATE global_settings SET main_warehouse = $1 WHERE global_settings_id = $2 RETURNING *',
//         [mainWarehouseId, globalSettingsId],
//     );
//     res.status(200).json(response.rows[0]);
// };

module.exports = {
    getGlobalSettings: handleErrors(getGlobalSettings),
    createGlobalSettings: handleErrors(createGlobalSettings),
    updateGlobalSettings: handleErrors(updateGlobalSettings),
};
