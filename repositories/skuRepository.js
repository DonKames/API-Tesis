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
        ORDER BY Skus.sku_id ASC
        LIMIT $1 OFFSET $2
        `;

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
    return await db.query('SELECT * FROM "public".skus WHERE sku_id = $1', [
        id,
    ]);
};

const getSkuBySku = async (sku) => {
    return await db.query('SELECT * FROM "public".skus WHERE sku = $1', [sku]);
};

const getSkusNames = async () => {
    return await db.query('SELECT sku_id, sku FROM "public".skus');
};

const createSku = async (name, price, description, sku, lote, order) => {
    return await db.query(
        'INSERT INTO "public".skus (name, price, description, sku, lote, product_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, price, description, sku, lote, order],
    );
};

const updateSku = async (id, name, price, description, minimumStock) => {
    return await db.query(
        'UPDATE "public".skus SET name = $1, price = $2, description = $3, minimum_stock = $4 WHERE sku_id = $5 RETURNING *',
        [name, price, description, minimumStock, id],
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
    getSkus,
    getSkuById,
    getSkuBySku,
    getSkusNames,
    createSku,
    updateSku,
    changeActiveStateSku,
};
