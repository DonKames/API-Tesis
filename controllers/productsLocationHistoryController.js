const db = require('../config/db');

const getProductsLocationHistory = async (req, res) => {
    try {
        const response = await db.query(
            'SELECT * FROM products_location_history',
        );
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductLocationHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".products_location_history WHERE history_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createProductLocationHistory = async (req, res) => {
    try {
        const { product_id, branch_id, date } = req.body;
        const response = await db.query(
            'INSERT INTO "public".products_location_history (product_id, branch_id, date) VALUES ($1, $2, $3) RETURNING *',
            [product_id, branch_id, date],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateProductLocationHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, branch_id, date } = req.body;
        const response = await db.query(
            'UPDATE "public".products_location_history SET product_id = $1, branch_id = $2, date = $3 WHERE history_id = $4 RETURNING *',
            [product_id, branch_id, date, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProductLocationHistory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM "public".products_location_history WHERE history_id = $1',
            [id],
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getProductsLocationHistory,
    getProductLocationHistoryById,
    createProductLocationHistory,
    updateProductLocationHistory,
    deleteProductLocationHistory,
};
