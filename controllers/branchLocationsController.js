const db = require('../config/db');

const getBranchLocations = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM branch_locations');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBranchLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".branch_locations WHERE branch_location_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createBranchLocation = async (req, res) => {
    try {
        const { name, description, fk_branch_id } = req.body;
        const response = await db.query(
            'INSERT INTO "public".branch_locations (name, description, fk_branch_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, fk_branch_id],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateBranchLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, fk_branch_id } = req.body;
        const response = await db.query(
            'UPDATE "public".branch_locations SET name = $1, description = $2, fk_branch_id = $3 WHERE branch_location_id = $4 RETURNING *',
            [name, description, fk_branch_id, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteBranchLocation = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query(
            'DELETE FROM "public".branch_locations WHERE branch_location_id = $1',
            [id],
        );
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBranchLocations,
    getBranchLocationById,
    createBranchLocation,
    updateBranchLocation,
    deleteBranchLocation,
};
