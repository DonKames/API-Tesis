const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getBranches = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    console.log(req.query);

    const response = await db.query(
        'SELECT * FROM branches ORDER BY branch_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );
    res.status(200).json(response.rows);
};

const getBranchesQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM branches');
    const branchesQty = parseInt(response.rows[0].count);
    res.status(200).json(branchesQty);
};

const getBranchesNames = handleErrors(async (req, res) => {
    const response = await db.query('SELECT branch_id, name FROM branches');
    const formattedResponse = response.rows.map((row) => ({
        id: row.branch_id,
        name: row.name,
    }));
    res.status(200).json(formattedResponse);
});

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
    getBranches: handleErrors(getBranches),
    getBranchesQty: handleErrors(getBranchesQty),
    getBranchesNames: handleErrors(getBranchesNames),
    getBranchById: handleErrors(getBranchById),
    createBranch: handleErrors(createBranch),
    updateBranch: handleErrors(updateBranch),
    deleteBranch: handleErrors(deleteBranch),
};
