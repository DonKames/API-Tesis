const db = require('../config/db');

const getMovements = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM movements');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getMovementById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".movements WHERE movement_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createMovement = async (req, res) => {
    try {
        const { type, amount, fk_account_id } = req.body;
        const response = await db.query(
            'INSERT INTO "public".movements (type, amount, fk_account_id) VALUES ($1, $2, $3) RETURNING *',
            [type, amount, fk_account_id],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, amount, fk_account_id } = req.body;
        const response = await db.query(
            'UPDATE "public".movements SET type = $1, amount = $2, fk_account_id = $3 WHERE movement_id = $4 RETURNING *',
            [type, amount, fk_account_id, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMovement = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM "public".movements WHERE movement_id = $1',
            [id],
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getMovements,
    getMovementById,
    createMovement,
    updateMovement,
    deleteMovement,
};
