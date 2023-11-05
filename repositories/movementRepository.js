const db = require('../config/db');

const getMovements = async () => {
    const response = await db.query('SELECT * FROM "public".movements');
    return response.rows;
};

const getMovementById = async (id) => {
    const response = await db.query(
        'SELECT * FROM "public".movements WHERE movement_id = $1',
        [id],
    );
    return response.rows[0];
};

const createMovement = async (movementData) => {
    const {
        fk_product_id,
        fk_user_id,
        movement_timestamp,
        fk_origin_warehouse_id,
        fk_destination_warehouse_id,
        fk_task_id,
        fk_movement_type_id,
    } = movementData;

    const response = await db.query(
        'INSERT INTO "public".movements (fk_product_id, fk_user_id, movement_timestamp, fk_origin_warehouse_id, fk_destination_warehouse_id, fk_task_id, fk_movement_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
            fk_product_id,
            fk_user_id,
            movement_timestamp,
            fk_origin_warehouse_id,
            fk_destination_warehouse_id,
            fk_task_id,
            fk_movement_type_id,
        ],
    );
    return response.rows[0];
};

const updateMovement = async (id, movementData) => {
    const {
        fk_product_id,
        fk_user_id,
        movement_timestamp,
        fk_origin_warehouse_id,
        fk_destination_warehouse_id,
        fk_task_id,
        fk_movement_type_id,
    } = movementData;

    const response = await db.query(
        'UPDATE "public".movements SET fk_product_id = $1, fk_user_id = $2, movement_timestamp = $3, fk_origin_warehouse_id = $4, fk_destination_warehouse_id = $5, fk_task_id = $6, fk_movement_type_id = $7 WHERE movement_id = $8 RETURNING *',
        [
            fk_product_id,
            fk_user_id,
            movement_timestamp,
            fk_origin_warehouse_id,
            fk_destination_warehouse_id,
            fk_task_id,
            fk_movement_type_id,
            id,
        ],
    );
    return response.rows[0];
};

const deleteMovement = async (id) => {
    await db.query('DELETE FROM "public".movements WHERE movement_id = $1', [
        id,
    ]);
};

module.exports = {
    getMovements,
    getMovementById,
    createMovement,
    updateMovement,
    deleteMovement,
};
