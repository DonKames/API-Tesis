const db = require('../config/db');
const handleErrors = require('../middlewares/errorHandler');

// const handleErrors = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getProductsQty = async (req, res) => {
    const response = await db.query('SELECT COUNT(*) FROM products');
    const productsQty = parseInt(response.rows[0].count);
    res.status(200).json({ productsQty });
};

const getPaginatedProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    console.log(req.query);

    const productsResponse = await db.query(
        'SELECT * FROM products ORDER BY product_id ASC LIMIT $1 OFFSET $2',
        [limit, offset],
    );

    res.status(200).json({
        products: productsResponse.rows,
    });
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const response = await db.query(
        'SELECT * FROM "public".products WHERE product_id = $1',
        [id],
    );
    res.status(200).json(response.rows[0]);
};

const getProductBySku = async (req, res) => {
    const { sku } = req.params;
    const response = await db.query(
        'SELECT * FROM "public".products WHERE sku = $1',
        [sku],
    );
    res.status(200).json(response.rows[0]);
};

const createProduct = async (req, res) => {
    const { fkSku, branchId, epc } = req.body;
    const warehouseIdResponse = await db.query(
        'SELECT warehouse_id FROM "public".warehouses WHERE fk_branch_id = $1 AND name = $2',
        [branchId, 'RECEPCIÓN'],
    );
    const warehouseId = warehouseIdResponse.rows[0].warehouse_id;
    const skuResponse = await db.query(
        'SELECT sku_id FROM "public".skus WHERE sku = $1',
        [fkSku],
    );
    const skuId = skuResponse.rows[0].sku_id;
    const response = await db.query(
        'INSERT INTO "public".products (epc, fk_warehouse_id, fk_sku_id) VALUES ($1, $2, $3) RETURNING *',
        [epc, warehouseId, skuId],
    );
    res.status(201).json(response.rows[0]);
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const response = await db.query(
        'UPDATE "public".products SET name = $1, price = $2, description = $3 WHERE product_id = $4 RETURNING *',
        [name, price, description, id],
    );
    res.status(200).json(response.rows[0]);
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM "public".products WHERE product_id = $1', [id]);
    res.status(204).send();
};

module.exports = {
    getPaginatedProducts: handleErrors(getPaginatedProducts),
    getProductsQty: handleErrors(getProductsQty),
    getProductById: handleErrors(getProductById),
    getProductBySku: handleErrors(getProductBySku),
    createProduct: handleErrors(createProduct),
    updateProduct: handleErrors(updateProduct),
    deleteProduct: handleErrors(deleteProduct),
};
