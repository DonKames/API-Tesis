const db = require('../config/db');

const getBranchLocations = async (limit, offset, showInactive, searchTerm) => {
    let baseQuery = `
        FROM branch_locations AS bl
        JOIN branches AS b ON bl.fk_branch_id = b.branch_id
    `;

    const whereConditions = [];
    const params = [];

    if (!showInactive) {
        whereConditions.push('bl.active = true');
    }

    if (searchTerm) {
        const searchTermCondition = `
            (bl.name ILIKE $${params.length + 1} OR 
            b.name ILIKE $${params.length + 1})
        `;
        whereConditions.push(searchTermCondition);
        params.push(`%${searchTerm}%`);
    }

    if (whereConditions.length) {
        baseQuery += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Query para obtener los datos
    const dataQuery =
        `
        SELECT bl.*, b.name AS branch_name
    ` +
        baseQuery +
        `
        ORDER BY bl.active ASC, bl.branch_location_id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    // Query para contar el total de registros
    const countQuery = `SELECT COUNT(*) ` + baseQuery;

    params.push(limit, offset);

    const data = await db.query(dataQuery, params);
    const totalResult = await db.query(countQuery, params.slice(0, -2)); // Excluye limit y offset para el conteo
    const qty = parseInt(totalResult.rows[0].count, 10);

    return { data: data.rows, qty };
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

const createBranchLocation = async ({ name, description, branchId }) => {
    const query = `
        INSERT INTO "public".branch_locations (name, description, fk_branch_id, active)
        VALUES ($1, $2, $3, TRUE) RETURNING *
    `;
    return await db.query(query, [name, description, branchId]);
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
