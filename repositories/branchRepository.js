const db = require('../config/db');

const getBranches = async (limit, offset, showInactive) => {
    let query = `
        SELECT 
            branches.branch_id, branches.name, branches.address, branches.active, 
            municipalities.municipality_id AS fk_municipality_id, municipalities.name AS municipality_name,
            regions.region_id, regions.name AS region_name, 
            countries.country_id, countries.name AS country_name
        FROM branches
        LEFT JOIN municipalities ON branches.fk_municipality_id = municipalities.municipality_id
        LEFT JOIN regions ON municipalities.fk_region_id = regions.region_id
        LEFT JOIN countries ON regions.fk_country_id = countries.country_id
    `;

    if (!showInactive) {
        query += ' WHERE branches.active = true';
    }

    query += `
        ORDER BY branches.active ASC, branches.branch_id ASC
        LIMIT $1 OFFSET $2
        `;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getBranchesQty = async (showInactive) => {
    console.log(showInactive);
    let query = 'SELECT COUNT(*) FROM branches';

    if (!showInactive) {
        query += ' WHERE active = true';
    }
    return await db.query(query);
};

const getBranchesNames = async () => {
    return await db.query('SELECT branch_id, name FROM branches');
};

const getBranchById = async (id) => {
    return await db.query(
        `
        SELECT branches.*, municipalities.fk_region_id AS region_id, regions.fk_country_id AS country_id
        FROM "public".branches
        LEFT JOIN "public".municipalities ON branches.fk_municipality_id = municipalities.municipality_id
        LEFT JOIN "public".regions ON municipalities.fk_region_id = regions.region_id
        LEFT JOIN "public".countries ON regions.fk_country_id = countries.country_id
        WHERE branches.branch_id = $1
    `,
        [id],
    );
};

const createBranch = async (branchName, municipality, address) => {
    return await db.query(
        'INSERT INTO "public".branches (name, fk_municipality_id, address, active) VALUES ($1, $2, $3, $4) RETURNING *',
        [branchName, municipality, address, true],
    );
};

const updateBranch = async (id, { branchName, address, municipality }) => {
    const query = `
        UPDATE "public".branches
        SET name = $1, address = $2, fk_municipality_id = $3
        WHERE branch_id = $4
        RETURNING *,
            (SELECT municipalities.name FROM municipalities WHERE municipalities.municipality_id = $3) AS municipality_name,
            (SELECT regions.name FROM regions WHERE regions.region_id = (SELECT municipalities.fk_region_id FROM municipalities WHERE municipalities.municipality_id = $3)) AS region_name,
            (SELECT countries.name FROM countries WHERE countries.country_id = (SELECT regions.fk_country_id FROM regions WHERE regions.region_id = (SELECT municipalities.fk_region_id FROM municipalities WHERE municipalities.municipality_id = $3))) AS country_name
    `;

    const params = [branchName, address, municipality, id];

    return await db.query(query, params);
};

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
    changeActiveStateBranch,
};
