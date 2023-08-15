const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getWarehouses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await db.query(
        'SELECT * FROM warehouses ORDER BY warehouse_id LIMIT $1 OFFSET $2',
        [limit, offset],
    );
    res.status(200).json(response.rows);
};

const getWarehousesQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM warehouses');
    res.status(200).json(parseInt(response.rows[0].count));
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
        console.log(req.body);
        const { warehouseName, capacity, fk_branch_id } = req.body;
        const response = await db.query(
            'INSERT INTO warehouses (name, capacity, fk_branch_id) VALUES ($1, $2, $3) RETURNING *',
            [warehouseName, capacity, fk_branch_id],
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
    getWarehouses: handleErrors(getWarehouses),
    getWarehousesQty: handleErrors(getWarehousesQty),
    getWarehouseById: handleErrors(getWarehouseById),
    createWarehouse: handleErrors(createWarehouse),
    updateWarehouse: handleErrors(updateWarehouse),
    deleteWarehouse: handleErrors(deleteWarehouse),
};
