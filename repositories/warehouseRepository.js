const db = require('../config/db');

const getWarehouses = async (limit, offset, showInactive, searchTerm) => {
    let baseQuery = `
        FROM "public".warehouses AS w
        JOIN "public".branches AS b ON w.fk_branch_id = b.branch_id
    `;

    const whereConditions = [];
    const params = [];

    if (!showInactive) {
        whereConditions.push('w.active = true');
    }

    if (searchTerm) {
        const searchTermCondition = `
            (w.name ILIKE $${params.length + 1} OR 
            b.name ILIKE $${params.length + 1})
        `;
        whereConditions.push(searchTermCondition);
        params.push(`%${searchTerm}%`);
    }

    if (whereConditions.length) {
        baseQuery += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Query para obtener los datos
    const dataQuery =
        `
        SELECT w.warehouse_id, w.name AS warehouse_name, w.capacity, w.fk_branch_id, w.active, b.name AS branch_name
    ` +
        baseQuery +
        `
        ORDER BY w.active ASC, w.warehouse_id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    // Query para contar el total de registros
    const countQuery = `SELECT COUNT(*) ` + baseQuery;

    params.push(limit, offset);

    const data = await db.query(dataQuery, params);
    const totalResult = await db.query(countQuery, params.slice(0, -2)); // Excluye limit y offset para el conteo
    const qty = parseInt(totalResult.rows[0].count, 10);

    return { data: data.rows, qty };
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
