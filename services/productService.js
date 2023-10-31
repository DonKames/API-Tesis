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

const getProductsQtyByWarehouseId = async (warehouseId) => {
    const response =
        await productRepository.getProductsQtyByWarehouseId(warehouseId);
    return parseInt(response.rows[0].count);
};

const searchProducts = async (query, limit) => {
    return await productRepository.searchProducts(query, limit);
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

const createProduct = async ({ skuId, warehouseId, epc }) => {
    return await productRepository.createProduct({ skuId, warehouseId, epc });
};

const updateProduct = async (id, { active, warehouseId, epc, skuId }) => {
    return await productRepository.updateProduct(id, {
        active,
        warehouseId,
        epc,
        skuId,
    });
};

// const deleteProduct = async (id) => {
//     return await productRepository.deleteProduct(id);
// };

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
    getProductsQtyByWarehouseId,
    searchProducts,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    // deleteProduct,
    changeActiveStateProduct,
};
