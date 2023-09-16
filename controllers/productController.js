const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');
const productService = require('../services/productService');

const getProducts = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await productService.getProducts(
        limit,
        offset,
        showInactive,
    );

    const formattedResponse = response.map((row) => ({
        id: row.product_id,
        epc: row.epc,
        warehouseName: row.warehouse_name,
        warehouseId: row.warehouse_id,
        branchName: row.branch_name,
        branchId: row.branch_id,
        active: row.active,
        sku: row.sku,
        skuId: row.sku_id,
    }));

    res.status(200).json(formattedResponse);
});

const getProductsQty = handleErrors(async (req, res) => {
    console.log(req.query.showInactive);
    const showInactive = req.query.showInactive === 'true' || false;

    const productsQty = await productService.getProductsQty(showInactive);

    res.status(200).json(productsQty);
});

const getProductCountByWarehouse = handleErrors(async (req, res) => {
    const counts = await productService.getProductCountByWarehouse();
    res.status(200).json(counts);
});

const getProductById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json(product);
});

const getProductBySku = handleErrors(async (req, res) => {
    const { sku } = req.params;
    const product = await productService.getProductBySku(sku);
    res.status(200).json(product);
});

const createProduct = handleErrors(async (req, res) => {
    const { fkSku, branchId, epc } = req.body;
    const newProduct = await productService.createProduct(fkSku, branchId, epc);
    res.status(201).json(newProduct);
});

const updateProduct = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { active, warehouseId, epc, skuId } = req.body;
    console.log(req.params);
    console.log('body: ', req.body);

    const updatedProduct = await productService.updateProduct(id, {
        active,
        warehouseId,
        epc,
        skuId,
    });
    res.status(200).json(updatedProduct);
});

const deleteProduct = handleErrors(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
});

const changeActiveStateProduct = handleErrors(async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const response = await productService.changeActiveStateProduct(
            id,
            active,
        );

        if (response) {
            const formattedResponse = {
                id: response.product_id,
                epc: response.epc,
                warehouseName: response.warehouse_name,
                branchName: response.branch_name,
                active: response.active,
                sku: response.sku,
            };

            sendSuccess(
                res,
                'Estado activo del Producto actualizado exitosamente.',
                formattedResponse,
            );
        } else {
            sendError(res, 'Producto no encontrado.', 404);
        }
        // res.status(204).send();
    } catch (error) {
        console.log(error);
        sendError(res, 'Error al cambiar el estado activo del Producto.', 500);
    }
});

module.exports = {
    changeActiveStateProduct,
    getProducts,
    getProductsQty,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
};
