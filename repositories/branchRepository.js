const db = require('../config/db');

const getBranches = async (limit, offset, showInactive) => {
    // let query = `
    //     SELECT
    //         branches.*
    //     FROM branches
    // `;

    let query = `
        SELECT 
            branches.branch_id, branches.name, branches.address, branches.active, 
            municipalities.municipalities_id AS fk_municipality_id, municipalities.name AS municipality_name,
            regions.region_id, regions.name AS region_name, 
            countries.country_id, countries.name AS country_name
        FROM branches
        LEFT JOIN municipalities ON branches.fk_municipality_id = municipalities.municipalities_id
        LEFT JOIN regions ON municipalities.fk_region_id = regions.region_id
        LEFT JOIN countries ON regions.fk_country_id = countries.country_id
    `;

    if (!showInactive) {
        query += ' WHERE branches.active = true';
    }

    query += `
        ORDER BY branches.branch_id ASC
        LIMIT $1 OFFSET $2
        `;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getBranchesQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM branches';

    if (!showInactive) {
        query += ' WHERE active = true';
    }
    return await db.query(query);
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

// const deleteBranch = async (id) => {
//     return await db.query(
//         'DELETE FROM "public".branches WHERE branch_id = $1',
//         [id],
//     );
// };

const changeActiveStateBranch = async (id, isActive) => {
    return await db.query(
        'UPDATE "public".branches SET active = $1 WHERE branch_id = $2 RETURNING *',
        [isActive, id],
    );
};

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    // deleteBranch,
    changeActiveStateBranch,
};
