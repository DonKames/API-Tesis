const db = require('../config/db');

const getWarehouses = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM warehouses');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getWarehouseById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM warehouses WHERE warehouse_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createWarehouse = async (req, res) => {
    try {
        const { warehouse_name, location_id } = req.body;
        const response = await db.query(
            'INSERT INTO warehouses (warehouse_name, location_id) VALUES ($1, $2) RETURNING *',
            [warehouse_name, location_id],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        const { warehouse_name, location_id } = req.body;

        const response = await db.query(
            'UPDATE warehouses SET warehouse_name = $1, location_id = $2 WHERE warehouse_id = $3 RETURNING *',
            [warehouse_name, location_id, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteWarehouse = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM warehouses WHERE warehouse_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getWarehouses,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
