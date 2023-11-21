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

const getLastAddedProducts = async (limit, startDate, endDate) => {
    // let queryLimit;
    // if (limit) {
    //     const numberLimit = parseInt(limit, 10);
    //     queryLimit = Number.isInteger(numberLimit)
    //         ? numberLimit
    //         : undefined;
    // }
    // console.log('queryLimit', queryLimit);

    // Construye el query base
    let query = `
        SELECT mov.*, prod.*, sku.*, 
        usr.first_name AS user_first_name, usr.last_name AS user_last_name, w.name AS warehouse_name
        FROM "public".movements mov
        JOIN "public".products prod ON mov.fk_product_id = prod.product_id
        JOIN "public".skus sku ON prod.fk_sku_id = sku.sku_id
        LEFT JOIN "public".users usr ON mov.fk_user_id = usr.user_id
        JOIN "public".warehouses w ON prod.fk_warehouse_id = w.warehouse_id
        WHERE mov.fk_movement_type_id = 1
    `;

    const queryParams = [];

    if (startDate && endDate) {
        query += ` AND mov.movement_timestamp BETWEEN $1 AND $2::date + interval '1 day' - interval '1 second'`;
        queryParams.push(startDate, endDate);
    }

    query += ` ORDER BY mov.movement_timestamp DESC`;

    if (limit) {
        const numberLimit = parseInt(limit, 10);
        if (Number.isInteger(numberLimit)) {
            query += ` LIMIT $${queryParams.length + 1}`;
            queryParams.push(numberLimit);
        }
    }

    try {
        // Agrega la cláusula LIMIT si queryLimit está definido
        // if (queryLimit) {
        //     query += ` LIMIT $1`;
        // }

        // Ejecuta el query
        const response = await db.query(query, queryParams);

        // console.log(response.rows);

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
    console.log('createMovement', movementData);
    // Inicializa las partes de la consulta y los valores
    const queryFields = [];
    const queryValues = [];
    const valuePlaceholders = [];
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
