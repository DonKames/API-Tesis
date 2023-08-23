const db = require('../config/db');

const getBranches = async (limit, offset) => {
    return await db.query(
        'SELECT * FROM branches ORDER BY branch_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );
};

const getBranchesQty = async () => {
    return await db.query('SELECT COUNT(*) FROM branches');
};

// TODO: Terminar de exportar los métodos necesarios
const getBranchesNames = async () => {
    return await db.query('SELECT branch_id, name FROM branches');
};

const getBranchById = async (id) => {
    return await db.query(
        'SELECT * FROM "public".branches WHERE branch_id = $1',
        [id],
    );
};

const createBranch = async (branchName, region, address) => {
    return await db.query(
        'INSERT INTO "public".branches (name, fk_region_id, address) VALUES ($1, $2, $3) RETURNING *',
        [branchName, region, address],
    );
};

const updateBranch = async (branchName, region, address, id) => {
    return await db.query(
        'UPDATE "public".branches SET name = $1, fk_region_id = $2, address = $3 WHERE branch_id = $4 RETURNING *',
        [branchName, region, address, id],
    );
};

const deleteBranch = async (id) => {
    return await db.query(
        'DELETE FROM "public".branches WHERE branch_id = $1',
        [id],
    );
};

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};
