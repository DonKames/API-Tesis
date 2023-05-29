const db = require('../config/db');

const getBranches = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM branches');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getBranchById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".branches WHERE branch_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createBranch = async (req, res) => {
    try {
        const { branchName, region, address } = req.body;
        const response = await db.query(
            'INSERT INTO "public".branches (name, fk_region_id, address) VALUES ($1, $2, $3) RETURNING *',
            [branchName, region, address],
        );
        const branchId = response.rows[0].branch_id;

        // Ahora insertamos la bodega "RECEPCIÓN" para la sucursal recién creada
        await db.query(
            'INSERT INTO "public".warehouses (name, fk_branch_id) VALUES ($1, $2)',
            ['RECEPCIÓN', branchId],
        );

        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { branchName, fk_region_id, address } = req.body;
        const response = await db.query(
            'UPDATE "public".branches SET name = $1, fk_region_id = $2, address = $3 WHERE branch_id = $4 RETURNING *',
            [branchName, fk_region_id, address, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM "public".branches WHERE branch_id = $1', [
            id,
        ]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};
