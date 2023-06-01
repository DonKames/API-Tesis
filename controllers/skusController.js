const db = require('../config/db');

const getSkus = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM Skus');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSkuById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".skus WHERE sku_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createSku = async (req, res) => {
    try {
        const { name, price, description, sku, lote, order } = req.body;

        const response = await db.query(
            'INSERT INTO "public".skus (name, price, description, sku, lote, product_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, price, description, sku, lote, order],
        );

        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateSku = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const response = await db.query(
            'UPDATE "public".skus SET name = $1, price = $2, description = $3 WHERE product_id = $4 RETURNING *',
            [name, price, description, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteSku = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM "public".skus WHERE product_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getSkus,
    getSkuById,
    createSku,
    updateSku,
    deleteSku,
};
