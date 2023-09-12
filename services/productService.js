const productRepository = require('../repositories/productRepository');

const getProducts = async (limit, offset, showInactive) => {
    const response = await productRepository.getProducts(
        limit,
        offset,
        showInactive,
    );

    return response.rows;
};

const getProductsQty = async (showInactive) => {
    const response = await productRepository.getProductsQty(showInactive);
    return parseInt(await response.rows[0].count);
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

const changeActiveStateProduct = async (id, isActive) => {
    const response = await productRepository.changeActiveStateProduct(
        id,
        isActive,
    );
    return response.rows[0];
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
    changeActiveStateProduct,
};
