const productRepository = require('../repositories/productRepository');

const getProducts = async (page, limit) => {
    const offset = (page - 1) * limit;
    return await productRepository.getProducts(limit, offset);
};

const getProductsQty = async () => {
    return await productRepository.getProductsQty();
};

const getProductCountByWarehouse = async () => {
    return await productRepository.getProductCountByWarehouse();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const getProductBySku = async (sku) => {
    return await productRepository.getProductBySku(sku);
};

const createProduct = async (fkSku, branchId, epc) => {
    return await productRepository.createProduct(fkSku, branchId, epc);
};

const updateProduct = async (id, name, price, description) => {
    return await productRepository.updateProduct(id, name, price, description);
};

const deleteProduct = async (id) => {
    return await productRepository.deleteProduct(id);
};

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
