const db = require('../config/db');

const getSkus = async (limit, offset, showInactive) => {
    let query = `
        SELECT Skus.*, COUNT(products.product_id) AS product_count
        FROM Skus
        LEFT JOIN products ON Skus.sku_id = products.fk_sku_id
    `;

    if (!showInactive) {
        query += ' WHERE Skus.active = true';
    }

    query += `
        GROUP BY Skus.sku_id
        ORDER BY Skus.active ASC, Skus.sku_id ASC
        LIMIT $1 OFFSET $2
        `;
    // query += `
    //     GROUP BY Skus.sku_id
    //     ORDER BY Skus.sku_id ASC
    //     LIMIT $1 OFFSET $2
    //     `;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getSkusQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM Skus';

    if (!showInactive) {
        query += ' WHERE active = true';
    }

    return await db.query(query);
};

const getSkuById = async (id) => {
    const query = `
        SELECT s.*, COUNT(p.product_id) as product_count
        FROM "public".skus s
        LEFT JOIN "public".products p ON s.sku_id = p.fk_sku_id
        WHERE s.sku_id = $1
        GROUP BY s.sku_id
    `;
    return await db.query(query, [id]);

    // return await db.query('SELECT * FROM "public".skus WHERE sku_id = $1', [
    //     id,
    // ]);
};

const getSkusQtyByWarehouseId = async (warehouseId) => {
    return await db.query(
        'SELECT COUNT(*) FROM "public".skus WHERE fk_warehouse_id = $1',
        [warehouseId],
    );
};

const getSkuBySku = async (sku) => {
    return await db.query(
        'SELECT * FROM "public".skus WHERE LOWER(sku) = LOWER($1)',
        [sku],
    );
};

const getSkusNames = async () => {
    return await db.query('SELECT sku_id, sku FROM "public".skus');
};

const createSku = async ({
    name,
    description,
    minimumStock,
    sku,
    lote,
    order,
}) => {
    return await db.query(
        'INSERT INTO "public".skus (name, minimum_stock, description, sku, lote, product_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, minimumStock, description, sku, lote, order],
    );
};

const updateSku = async (id, name, description, minimumStock) => {
    return await db.query(
        'UPDATE "public".skus SET name = $1, description = $2, minimum_stock = $3 WHERE sku_id = $4 RETURNING *',
        [name, description, minimumStock, id],
    );
};

const changeActiveStateSku = async (id, isActive) => {
    return await db.query(
        'UPDATE "public".skus SET active = $1 WHERE sku_id = $2 RETURNING *',
        [isActive, id],
    );
};

// *** NOTA: No se eliminaran cosas, se manejaran con cambios de estado en la columna "active". ***
// const deleteSku = async (id) => {
//     return await db.query('DELETE FROM "public".skus WHERE sku_id = $1', [id]);
// };

module.exports = {
    getSkusQty,
    getSkusQtyByWarehouseId,
    getSkus,
    getSkuById,
    getSkuBySku,
    getSkusNames,
    createSku,
    updateSku,
    changeActiveStateSku,
};
