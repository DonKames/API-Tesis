const db = require('../config/db');

const getWarehouses = async (limit, offset, showInactive) => {
    let query = `
        SELECT w.warehouse_id, w.name AS warehouse_name, w.capacity, w.fk_branch_id, w.active, b.name AS branch_name
        FROM "public".warehouses AS w
        JOIN "public".branches AS b ON w.fk_branch_id = b.branch_id`;

    if (!showInactive) {
        query += ' WHERE w.active = true';
    }

    query += `
        ORDER BY w.active ASC, w.warehouse_id ASC
        LIMIT $1 OFFSET $2
        `;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getWarehousesQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM warehouses';

    if (!showInactive) {
        query += ' WHERE active = true';
    }

    return await db.query(query);
};

const getWarehousesQtyByBranchId = async (branchId) => {
    return await db.query(
        'SELECT COUNT(*) FROM warehouses WHERE fk_branch_id = $1',
        [branchId],
    );
};

const getWarehousesNames = async () => {
    return await db.query(
        'SELECT warehouse_id, name, fk_branch_id FROM warehouses',
    );
};

const getWarehouseById = async (id) => {
    return await db.query(
        'SELECT * FROM "public".warehouses WHERE warehouse_id = $1',
        [id],
    );
};

const createWarehouse = async ({ warehouseName, capacity, branchId }) => {
    return await db.query(
        'INSERT INTO "public".warehouses (name, capacity, fk_branch_id, active) VALUES ($1, $2, $3, TRUE) RETURNING *',
        [warehouseName, capacity, branchId],
    );
};

const updateWarehouse = async (
    id,
    { warehouseName, capacity, branchId, active },
) => {
    return await db.query(
        `UPDATE "public".warehouses 
        SET name = $1, capacity = $2, fk_branch_id = $3, active = $4 
        WHERE warehouse_id = $5 
        RETURNING *,
        (SELECT name FROM "public".branches WHERE branch_id = $3) AS branch_name;
`,
        [warehouseName, capacity, branchId, active, id],
    );
};

const changeActiveStateWarehouse = async (id, activeState) => {
    return await db.query(
        'UPDATE "public".warehouses SET active = $1 WHERE warehouse_id = $2 RETURNING *',
        [activeState, id],
    );
};

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesQtyByBranchId,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    changeActiveStateWarehouse,
};
