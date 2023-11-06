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

// * Original
// const createMovement = async (client, movementData) => {
//     const { productId, userId, warehouseId, taskId, movementTypeId } =
//         movementData;

//     const response = await client.query(
//         'INSERT INTO "public".movements (fk_product_id, fk_user_id, fk_warehouse_id, fk_task_id, fk_movement_type_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
//         [productId, userId, warehouseId, taskId, movementTypeId],
//     );
//     return response.rows[0];
// };

const getLastAddedProducts = async (limit = 5) => {
    try {
        // Asegúrate de que 'limit' sea un número y establece un valor por defecto si es necesario
        const queryLimit = Number.isInteger(limit) ? limit : 5;
        const response = await db.query(
            `SELECT mov.*, prod.product_id, sku.name AS product_name,
             usr.first_name AS user_first_name, usr.last_name AS user_last_name
             FROM "public".movements mov
             JOIN "public".products prod ON mov.fk_product_id = prod.product_id
             JOIN "public".skus sku ON prod.fk_sku_id = sku.sku_id
             LEFT JOIN "public".users usr ON mov.fk_user_id = usr.user_id
             ORDER BY mov.movement_timestamp DESC LIMIT $1`,
            [queryLimit],
        );

        // console.log('repository', response);

        return response.rows;
    } catch (error) {
        console.error(
            'Error al obtener los últimos productos agregados:',
            error,
        );
        throw error; // Es importante propagar el error para que el controlador pueda manejarlo
    }
};

const createMovement = async (client, movementData) => {
    // Inicializa las partes de la consulta y los valores
    let queryFields = [];
    let queryValues = [];
    let valuePlaceholders = [];
    let counter = 1;

    try {
        // Recorre las claves del objeto movementData
        for (const [key, value] of Object.entries(movementData)) {
            if (value !== undefined) {
                // Asegúrate de que el valor no sea undefined
                queryFields.push(`fk_${key}_id`); // Asume que todos los campos en la base de datos comienzan con 'fk_' y terminan con '_id'
                queryValues.push(value);
                valuePlaceholders.push(`$${counter}`);
                counter++;
            }
        }

        // Construye la consulta SQL
        const queryText = `INSERT INTO "public".movements (${queryFields.join(
            ', ',
        )}) VALUES (${valuePlaceholders.join(', ')}) RETURNING *`;

        // console.log(queryText);
        // Ejecuta la consulta con los valores
        const response = await client.query(queryText, queryValues);

        // console.log(response);
        return response.rows[0];
    } catch (error) {
        console.log(error);
    }
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
    getLastAddedProducts,
    createMovement,
    updateMovement,
    deleteMovement,
};
