const db = require('../config/db');

const getBranchLocations = async (limit, offset, showInactive) => {
    let query = `
        SELECT bl.*, b.name AS branch_name
        FROM branch_locations AS bl
        JOIN branches AS b ON bl.fk_branch_id = b.branch_id
    `;

    if (!showInactive) {
        query += ' WHERE bl.active = true';
    }

    query += ` ORDER BY bl.active ASC,
        branch_location_id ASC LIMIT $1 OFFSET $2`;

    const params = [limit, offset];

    return await db.query(query, params);
};

const getBranchLocationsQty = async () => {
    const query = 'SELECT COUNT(*) FROM branch_locations';
    return await db.query(query);
};

const getBranchLocationById = async (id) => {
    const query = `
        SELECT * FROM "public".branch_locations
        WHERE branch_location_id = $1
    `;
    return await db.query(query, [id]);
};

const createBranchLocation = async ({
    branchLocationName,
    description,
    branchId,
}) => {
    const query = `
        INSERT INTO "public".branch_locations (name, description, fk_branch_id)
        VALUES ($1, $2, $3) RETURNING *
    `;
    return await db.query(query, [branchLocationName, description, branchId]);
};

const updateBranchLocation = async (id, { name, description, branchId }) => {
    const query = `
        UPDATE "public".branch_locations
        SET name = $1, description = $2, fk_branch_id = $3
        WHERE branch_location_id = $4 RETURNING *, (SELECT name FROM "public".branches WHERE branch_id = $3) AS branch_name
    `;
    return await db.query(query, [name, description, branchId, id]);
};

const changeActiveStateBranchLocation = async (id, activeState) => {
    return await db.query(
        'UPDATE "public".branch_locations SET active = $1 WHERE branch_location_id = $2 RETURNING *',
        [activeState, id],
    );
};

module.exports = {
    getBranchLocations,
    getBranchLocationsQty,
    getBranchLocationById,
    createBranchLocation,
    updateBranchLocation,
    changeActiveStateBranchLocation,
};
