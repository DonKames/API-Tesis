const db = require('../config/db');

const getSkusQty = async () => {
    return await db.query('SELECT COUNT(*) FROM skus');
};

const getSkus = async (limit, offset) => {
    return await db.query(
        'SELECT * FROM Skus ORDER BY sku_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );
};

const getSkuById = async (id) => {
    return await db.query('SELECT * FROM "public".skus WHERE sku_id = $1', [
        id,
    ]);
};

const getSkuBySku = async (sku) => {
    return await db.query('SELECT * FROM "public".skus WHERE sku = $1', [sku]);
};

const createSku = async (name, price, description, sku, lote, order) => {
    return await db.query(
        'INSERT INTO "public".skus (name, price, description, sku, lote, product_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, price, description, sku, lote, order],
    );
};

const updateSku = async (id, name, price, description) => {
    return await db.query(
        'UPDATE "public".skus SET name = $1, price = $2, description = $3 WHERE sku_id = $4 RETURNING *',
        [name, price, description, id],
    );
};

const deleteSku = async (id) => {
    return await db.query('DELETE FROM "public".skus WHERE sku_id = $1', [id]);
};

module.exports = {
    getSkusQty,
    getSkus,
    getSkuById,
    getSkuBySku,
    createSku,
    updateSku,
    deleteSku,
};
