const db = require('../config/db');

const getSkus = async (limit, offset, showInactive, searchTerm) => {
    let baseQuery = `
        FROM Skus
        LEFT JOIN products ON Skus.sku_id = products.fk_sku_id
    `;

    const whereConditions = [];
    const params = [];

    if (!showInactive) {
        whereConditions.push('Skus.active = true');
    }

    if (searchTerm) {
        const searchTermCondition = `
            (Skus.name ILIKE $${params.length + 1} OR 
            Skus.description ILIKE $${params.length + 1})
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
        SELECT Skus.*, COUNT(products.product_id) AS product_count
    ` +
        baseQuery +
        `
        GROUP BY Skus.sku_id
        ORDER BY Skus.active ASC, Skus.sku_id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    // Query para contar el total de registros
    const countQuery = `SELECT COUNT(DISTINCT Skus.sku_id) ` + baseQuery;

    params.push(limit, offset);

    const data = await db.query(dataQuery, params);
    const totalResult = await db.query(countQuery, params.slice(0, -2)); // Excluye limit y offset para el conteo
    const qty = parseInt(totalResult.rows[0].count, 10);

    return { data: data.rows, qty };
};

const getSkusQty = async (showInactive) => {
    let query = 'SELECT COUNT(*) FROM Skus';

    if (!showInactive) {
        query += ' WHERE active = true';
    }

    // console.log(query);

    const resp = await db.query(query);

    // console.log(resp);

    return resp;
};

const getSkuById = async (id) => {
    const query = `
        SELECT s.*, COUNT(p.product_id) as product_count
        FROM "public".skus s
        LEFT JOIN "public".products p ON s.sku_id = p.fk_sku_id
        WHERE s.sku_id = $1
        GROUP BY s.sku_id
    `;
    return await db.query(query, [id]);

    // return await db.query('SELECT * FROM "public".skus WHERE sku_id = $1', [
    //     id,
    // ]);
};

const getSkusQtyByWarehouseId = async (warehouseId) => {
    return await db.query(
        'SELECT COUNT(*) FROM "public".skus WHERE fk_warehouse_id = $1',
        [warehouseId],
    );
};

const getSkuBySku = async (sku) => {
    return await db.query(
        'SELECT * FROM "public".skus WHERE LOWER(sku) = LOWER($1)',
        [sku],
    );
};

const getSkusNames = async () => {
    return await db.query('SELECT sku_id, sku FROM "public".skus');
};

const getSkusWithLowInventory = async () => {
    const query = `
        SELECT s.sku_id, s.sku, s.minimum_stock, s.name, s.description, COUNT(p.product_id) AS product_count
        FROM skus s
        LEFT JOIN products p ON s.sku_id = p.fk_sku_id
        GROUP BY s.sku_id
        HAVING COUNT(p.product_id) <= (s.minimum_stock * 1.20);
    `;

    try {
        return await db.query(query);
    } catch (error) {
        console.error('Error al obtener SKUs con inventario bajo:', error);
        throw error;
    }
};

const getProductsCountInWarehouses = async (skuIds) => {
    const query = `
        SELECT 
            w.warehouse_id,
            w.name AS warehouse_name,
            s.sku_id,
            COUNT(p.product_id) AS product_count
        FROM 
            warehouses w
        JOIN 
            products p ON w.warehouse_id = p.fk_warehouse_id
        JOIN 
            skus s ON p.fk_sku_id = s.sku_id
        WHERE 
            s.sku_id = ANY($1)
        GROUP BY 
            w.warehouse_id, s.sku_id;
    `;

    try {
        const res = await db.query(query, [skuIds]);
        return res;
    } catch (error) {
        console.error(
            'Error al obtener la cantidad de productos en bodegas:',
            error,
        );
        throw error;
    }
};

const createSku = async ({
    name,
    description,
    minimumStock,
    sku,
    lote,
    order,
}) => {
    return await db.query(
        'INSERT INTO "public".skus (name, minimum_stock, description, sku, lote, product_order, active) VALUES ($1, $2, $3, $4, $5, $6, TRUE) RETURNING *',
        [name, minimumStock, description, sku, lote, order],
    );
};

const updateSku = async (id, name, description, minimumStock) => {
    return await db.query(
        'UPDATE "public".skus SET name = $1, description = $2, minimum_stock = $3 WHERE sku_id = $4 RETURNING *',
        [name, description, minimumStock, id],
    );
};

const changeActiveStateSku = async (id, isActive) => {
    return await db.query(
        'UPDATE "public".skus SET active = $1 WHERE sku_id = $2 RETURNING *',
        [isActive, id],
    );
};

// *** NOTA: No se eliminaran cosas, se manejaran con cambios de estado en la columna "active". ***
// const deleteSku = async (id) => {
//     return await db.query('DELETE FROM "public".skus WHERE sku_id = $1', [id]);
// };

module.exports = {
    getSkusQty,
    getSkusQtyByWarehouseId,
    getSkus,
    getSkuById,
    getSkuBySku,
    getSkusNames,
    getSkusWithLowInventory,
    getProductsCountInWarehouses,
    createSku,
    updateSku,
    changeActiveStateSku,
};
