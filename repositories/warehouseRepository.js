const db = require('../config/db');

const getWarehouses = async (limit, offset) => {
    return await db.query(
        'SELECT * FROM warehouses ORDER BY warehouse_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );
};

const getWarehousesQty = async () => {
    return await db.query('SELECT COUNT(*) FROM warehouses');
};

const getWarehousesNames = async () => {
    return await db.query('SELECT warehouse_id, name FROM warehouses');
};

const getWarehouseById = async (id) => {
    return await db.query(
        'SELECT * FROM "public".warehouses WHERE warehouse_id = $1',
        [id],
    );
};

const createWarehouse = async ({ warehouseName, capacity, branchId }) => {
    return await db.query(
        'INSERT INTO "public".warehouses (name, capacity, fk_branch_id) VALUES ($1, $2, $3) RETURNING *',
        [warehouseName, capacity, branchId],
    );
};

const updateWarehouse = async (id, { warehouseName, locationId }) => {
    return await db.query(
        'UPDATE "public".warehouses SET warehouse_name = $1, location_id = $2 WHERE warehouse_id = $3 RETURNING *',
        [warehouseName, locationId, id],
    );
};

const deleteWarehouse = async (id) => {
    return await db.query(
        'DELETE FROM "public".warehouses WHERE warehouse_id = $1',
        [id],
    );
};

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
