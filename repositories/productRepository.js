const db = require('../config/db');

const getProducts = async (limit, offset) => {
    const response = await db.query(
        'SELECT * FROM products ORDER BY product_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );
    return response.rows;
};

const getProductsQty = async () => {
    const response = await db.query('SELECT COUNT(*) FROM products');
    return response;
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
        'SELECT * FROM "public".products WHERE product_id = $1',
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

const getProductsByWarehouse = async (warehouseId) => {
    const response = await db.query(
        'SELECT * FROM "public".products WHERE fk_warehouse_id = $1',
        [warehouseId],
    );
    return response.rows;
};

const createProduct = async (fkSku, branchId, epc) => {
    const response = await db.query(
        'INSERT INTO "public".products (epc, fk_warehouse_id, fk_sku_id) VALUES ($1, $2, $3) RETURNING *',
        [epc, branchId, fkSku],
    );
    return response.rows[0];
};

const updateProduct = async (id, name, price, description) => {
    const response = await db.query(
        'UPDATE "public".products SET name = $1, price = $2, description = $3 WHERE product_id = $4 RETURNING *',
        [name, price, description, id],
    );
    return response.rows[0];
};

const deleteProduct = async (id) => {
    await db.query('DELETE FROM "public".products WHERE product_id = $1', [id]);
};

module.exports = {
    getProducts,
    getProductsQty,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    getProductsByWarehouse,
    createProduct,
    updateProduct,
    deleteProduct,
};
