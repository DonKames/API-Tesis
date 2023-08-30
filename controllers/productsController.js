const handleErrors = require('../middlewares/errorHandler');
const productService = require('../services/productService');

const getProducts = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const products = await productService.getProducts(page, limit);
    res.status(200).json(products);
});

const getProductsQty = handleErrors(async (req, res) => {
    const productsQty = await productService.getProductsQty();
    res.status(200).json({ productsQty });
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
    const { name, price, description } = req.body;
    const updatedProduct = await productService.updateProduct(
        id,
        name,
        price,
        description,
    );
    res.status(200).json(updatedProduct);
});

const deleteProduct = handleErrors(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
});

module.exports = {
    getProducts,
    getProductsQty,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
};
