const db = require('../config/db');

const handleErrors = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSkusQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM skus');
    const skusQty = parseInt(response.rows[0].count);
    res.status(200).json({ skusQty });
};

const getSkus = async (req, res) => {
    const response = await db.query('SELECT * FROM Skus');
    res.status(200).json(response.rows);
};

const getSkuById = async (req, res) => {
    const { id } = req.params;
    const response = await db.query(
        'SELECT * FROM "public".skus WHERE sku_id = $1',
        [id],
    );
    res.status(200).json(response.rows[0]);
};

const getSkuBySku = async (req, res) => {
    const { sku } = req.params;
    const response = await db.query(
        'SELECT * FROM "public".skus WHERE sku = $1',
        [sku],
    );
    res.status(200).json(response.rows[0]);
};

const createSku = async (req, res) => {
    const { name, price, description, sku, lote, order } = req.body;
    const response = await db.query(
        'INSERT INTO "public".skus (name, price, description, sku, lote, product_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name, price, description, sku, lote, order],
    );
    res.status(201).json(response.rows[0]);
};

const updateSku = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const response = await db.query(
        'UPDATE "public".skus SET name = $1, price = $2, description = $3 WHERE sku_id = $4 RETURNING *',
        [name, price, description, id],
    );
    res.status(200).json(response.rows[0]);
};

const deleteSku = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM "public".skus WHERE sku_id = $1', [id]);
    res.status(204).send();
};

module.exports = {
    getSkusQty: handleErrors(getSkusQty),
    getSkus: handleErrors(getSkus),
    getSkuById: handleErrors(getSkuById),
    getSkuBySku: handleErrors(getSkuBySku),
    createSku: handleErrors(createSku),
    updateSku: handleErrors(updateSku),
    deleteSku: handleErrors(deleteSku),
};
