const db = require('../config/db');

const getWarehouseLocations = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM warehouse_locations');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getWarehouseLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM warehouse_locations WHERE location_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createWarehouseLocation = async (req, res) => {
    try {
        const { location_name } = req.body;
        const response = await db.query(
            'INSERT INTO warehouse_locations (location_name) VALUES ($1) RETURNING *',
            [location_name],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateWarehouseLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { location_name } = req.body;

        const response = await db.query(
            'UPDATE warehouse_locations SET location_name = $1 WHERE location_id = $2 RETURNING *',
            [location_name, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteWarehouseLocation = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM warehouse_locations WHERE location_id = $1',
            [id],
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getWarehouseLocations,
    getWarehouseLocationById,
    createWarehouseLocation,
    updateWarehouseLocation,
    deleteWarehouseLocation,
};
