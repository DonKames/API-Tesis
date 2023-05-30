const db = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM products');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".products WHERE product_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductBySku = async (req, res) => {
    try {
        const { sku } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".products WHERE sku = $1',
            [sku],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, sku, lote, order, branchId } =
            req.body;

        const warehouseIdResponse = await db.query(
            'SELECT warehouse_id FROM "public".warehouses WHERE fk_branch_id = $1 AND name = $2',
            [branchId, 'RECEPCIÓN'],
        );

        const warehouseId = warehouseIdResponse.rows[0].warehouse_id;

        const response = await db.query(
            'INSERT INTO "public".products (name, price, description, sku, lote, product_order, fk_warehouse_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, price, description, sku, lote, order, warehouseId],
        );

        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);

        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const response = await db.query(
            'UPDATE "public".products SET name = $1, price = $2, description = $3 WHERE product_id = $4 RETURNING *',
            [name, price, description, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM "public".products WHERE product_id = $1', [
            id,
        ]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
};
