const handleErrors = require('../middlewares/errorHandler');
const skuService = require('../services/skuService');

const getSkusQty = handleErrors(async (req, res) => {
    const skusQty = await skuService.getSkusQty();
    res.status(200).json(skusQty);
});

const getSkus = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const skus = await skuService.getSkus(limit, offset);
    res.status(200).json(skus);
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
    const { name, price, description } = req.body;
    const updatedSku = await skuService.updateSku(id, name, price, description);
    res.status(200).json(updatedSku);
});

const deleteSku = handleErrors(async (req, res) => {
    const { id } = req.params;
    await skuService.deleteSku(id);
    res.status(204).send();
});

module.exports = {
    getSkusQty,
    getSkus,
    getSkuById,
    getSkuBySku,
    createSku,
    updateSku,
    deleteSku,
};
