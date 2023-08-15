const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

const getBranchLocations = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const response = await db.query(
        'SELECT * FROM branch_locations ORDER BY branch_location_id LIMIT $1 OFFSET $2',
        [limit, offset],
    );
    res.status(200).json(response.rows);
};

const getBranchLocationsQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM branch_locations');
    res.status(200).json(parseInt(response.rows[0].count));
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
        console.log(req.body);
        const { branchLocationName, description, branchId } = req.body;
        const response = await db.query(
            'INSERT INTO "public".branch_locations (name, description, fk_branch_id) VALUES ($1, $2, $3) RETURNING *',
            [branchLocationName, description, branchId],
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
    getBranchLocations: handleErrors(getBranchLocations),
    getBranchLocationsQty: handleErrors(getBranchLocationsQty),
    getBranchLocationById: handleErrors(getBranchLocationById),
    createBranchLocation: handleErrors(createBranchLocation),
    updateBranchLocation: handleErrors(updateBranchLocation),
    deleteBranchLocation: handleErrors(deleteBranchLocation),
};
