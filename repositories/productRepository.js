const db = require('../config/db');

const getProducts = async (limit, offset, showInactive) => {
    console.log(limit, offset, showInactive);
    let query = `
        SELECT p.product_id, p.epc, p.fk_warehouse_id, p.fk_sku_id, p.active,
        w.name AS warehouse_name, w.fk_branch_id AS branch_id, s.sku AS sku, 
        b.name AS branch_name, p.fk_warehouse_id AS warehouse_id, p.fk_sku_id AS sku_id
        FROM products p 
        JOIN warehouses w ON p.fk_warehouse_id = w.warehouse_id
        JOIN skus s ON p.fk_sku_id = s.sku_id
        JOIN branches b ON w.fk_branch_id = b.branch_id
    `;

    if (!showInactive) {
        query += ' WHERE p.active = true';
    }

    query += `
        ORDER BY p.product_id ASC
        LIMIT $1 OFFSET $2
        `;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getProductsQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM products';

    if (!showInactive) {
        query += ' WHERE active = true';
    }

    return await db.query(query);
};

const getProductsQtyByWarehouseId = async (warehouseId) => {
    return await db.query(
        'SELECT COUNT (*) FROM products WHERE fk_warehouse_id = $1',
        [warehouseId],
    );
};

const searchProducts = async (query, limit) => {
    const searchTerm = `%${query}%`;
    const queryStr = `
        SELECT p.product_id, s.sku AS name
        FROM products p
        JOIN skus s ON p.fk_sku_id = s.sku_id
        WHERE s.sku LIKE $1
        LIMIT $2
    `;

    const params = [searchTerm, limit];

    const response = await db.query(queryStr, params);
    return response.rows;
};

const getProductCountByWarehouse = async () => {
    const response = await db.query(
        'SELECT w.warehouse_id, w.name AS warehouse_name, COUNT(p.product_id) AS product_count ' +
            'FROM "public".warehouses w ' +
            'LEFT JOIN "public".products p ON w.warehouse_id = p.fk_warehouse_id ' +
            'GROUP BY w.warehouse_id, w.name ' +
            'ORDER BY w.warehouse_id;',
    );
    return response.rows;
};

const getProductById = async (id) => {
    const response = await db.query(
        `
        SELECT p.product_id, p.epc, p.fk_warehouse_id, p.fk_sku_id, p.active,
        w.name AS warehouse_name, w.fk_branch_id AS branch_id, s.sku AS sku, 
        b.name AS branch_name, p.fk_warehouse_id AS warehouse_id, p.fk_sku_id AS sku_id
        FROM products p 
        JOIN warehouses w ON p.fk_warehouse_id = w.warehouse_id
        JOIN skus s ON p.fk_sku_id = s.sku_id
        JOIN branches b ON w.fk_branch_id = b.branch_id
        WHERE p.product_id = $1
    `,
        [id],
    );
    return response.rows[0];
};

const getProductBySku = async (sku) => {
    const response = await db.query(
        'SELECT * FROM "public".products WHERE sku = $1',
        [sku],
    );
    return response.rows[0];
};

const getProductByEPC = async (epc) => {
    console.log('repo: ', epc);
    const response = await db.query(
        'SELECT * FROM "public".products WHERE LOWER(epc) = LOWER($1)',
        [epc],
    );
    console.log(response.rows[0]);
    return response.rows[0];
};

const getProductsByWarehouse = async (warehouseId) => {
    const response = await db.query(
        'SELECT * FROM "public".products WHERE fk_warehouse_id = $1',
        [warehouseId],
    );
    return response.rows;
};

const createProduct = async ({ skuId, warehouseId, epc }) => {
    console.log(skuId, warehouseId, epc);
    const response = await db.query(
        'INSERT INTO "public".products (epc, fk_warehouse_id, fk_sku_id, active) VALUES ($1, $2, $3, TRUE) RETURNING *',
        [epc, warehouseId, skuId],
    );
    console.log('response ', response);
    return response.rows[0];
};

const updateProduct = async (id, { active, warehouseId, epc, skuId }) => {
    const response = await db.query(
        'UPDATE "public".products SET epc = $1, fk_warehouse_id = $2, fk_sku_id = $3, active = $4 WHERE product_id = $5 RETURNING *',
        [epc, warehouseId, skuId, active, id],
    );
    return response.rows[0];
};

// const deleteProduct = async (id) => {
//     await db.query('DELETE FROM "public".products WHERE product_id = $1', [id]);
// };

const changeActiveStateProduct = async (id, isActive) => {
    return await db.query(
        'UPDATE "public".products SET active = $1 WHERE product_id = $2 RETURNING *',
        [isActive, id],
    );
};

module.exports = {
    getProducts,
    getProductsQty,
    getProductsQtyByWarehouseId,
    searchProducts,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    getProductByEPC,
    getProductsByWarehouse,
    createProduct,
    updateProduct,
    // deleteProduct,
    changeActiveStateProduct,
};
