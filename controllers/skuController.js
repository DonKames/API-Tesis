const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');
const skuService = require('../services/skuService');

const getSkus = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await skuService.getSkus(limit, offset, showInactive);

    const formattedResponse = response.map((row) => ({
        id: row.sku_id,
        name: row.name,
        description: row.description,
        minimumStock: row.minimum_stock,
        sku: row.sku,
        lote: row.lote,
        order: row.product_order,
        active: row.active,
        stock: row.product_count,
    }));

    res.status(200).json(formattedResponse);
});

const getSkusQty = handleErrors(async (req, res) => {
    const showInactive = req.query.showInactive === 'true' || false;

    const skusQty = await skuService.getSkusQty(showInactive);

    res.status(200).json(skusQty);
});

const getSkuById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const sku = await skuService.getSkuById(id);
    res.status(200).json(sku);
});

const getSkuBySku = handleErrors(async (req, res) => {
    const { sku } = req.params;
    const skuData = await skuService.getSkuBySku(sku);
    res.status(200).json(skuData);
});

const getSkusNames = handleErrors(async (req, res) => {
    const response = await skuService.getSkusNames();

    const formattedResponse = response.rows.map((row) => ({
        id: row.sku_id,
        name: row.sku_name,
    }));

    res.status(200).json(formattedResponse);
});

const createSku = handleErrors(async (req, res) => {
    const { name, price, description, sku, lote, order } = req.body;
    const newSku = await skuService.createSku(
        name,
        price,
        description,
        sku,
        lote,
        order,
    );
    res.status(201).json(newSku);
});

const updateSku = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { name, price, description, minimumStock } = req.body;
    const response = await skuService.updateSku(
        id,
        name,
        price,
        description,
        minimumStock,
    );

    const formattedResponse = {
        active: response.active,
        description: response.description,
        id: response.sku_id,
        lote: response.lote,
        minimumStock: response.minimum_stock,
        name: response.name,
        order: response.product_order,
        sku: response.sku,
    };

    res.status(200).json(formattedResponse);
});

const changeActiveStateSku = handleErrors(async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        console.log(id, active);

        const response = await skuService.changeActiveStateSku(id, active);

        if (response) {
            const formattedResponse = {
                active: response.active,
                description: response.description,
                id: response.sku_id,
                lote: response.lote,
                minimumStock: response.minimum_stock,
                name: response.name,
                order: response.product_order,
                sku: response.sku,
            };
            sendSuccess(
                res,
                'SKU status updated successfully',
                formattedResponse,
            );
        } else {
            sendError(res, 'SKU not found', 404);
        }
    } catch (error) {
        sendError(res, 'An error occurred while updating SKU status', 500);
    }
});

// *** NOTA: No se eliminaran cosas, se manejaran con cambios de estado. ***
// const deleteSku = handleErrors(async (req, res) => {
//     const { id } = req.params;
//     await skuService.deleteSku(id);
//     res.status(204).send();
// });

module.exports = {
    getSkusQty,
    getSkus,
    getSkuById,
    getSkuBySku,
    getSkusNames,
    createSku,
    updateSku,
    changeActiveStateSku,
};
