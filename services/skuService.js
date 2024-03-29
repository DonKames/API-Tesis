const skuRepository = require('../repositories/skuRepository');

const getSkus = async (limit, offset, showInactive, searchTerm) => {
    const response = await skuRepository.getSkus(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    return response;
};

const getSkusQty = async (showInactive) => {
    const response = await skuRepository.getSkusQty(showInactive);
    return parseInt(response.rows[0].count);
};

const getSkusQtyByWarehouseId = async (warehouseId) => {
    const response = await skuRepository.getSkusQtyByWarehouseId(warehouseId);
    return parseInt(response.rows[0].count);
};

const getSkuById = async (id) => {
    const response = await skuRepository.getSkuById(id);
    return response.rows[0];
};

const getSkuBySku = async (sku) => {
    const response = await skuRepository.getSkuBySku(sku);
    return response.rows[0];
};

const getSkusNames = async () => {
    return await skuRepository.getSkusNames();
};

const getSkusWithLowInventory = async () => {
    const response = await skuRepository.getSkusWithLowInventory();
    console.log('service lowInventory', response);
    return response.rows;
};

const getProductsCountInWarehouses = async (skuIds) => {
    const response = await skuRepository.getProductsCountInWarehouses(skuIds);
    return response.rows;
};

const createSku = async ({
    name,
    description,
    minimumStock,
    sku,
    lote,
    order,
}) => {
    const response = await skuRepository.createSku({
        name,
        description,
        minimumStock,
        sku,
        lote,
        order,
    });
    return response.rows[0];
};

const updateSku = async (id, name, description, minimumStock) => {
    const response = await skuRepository.updateSku(
        id,
        name,
        description,
        minimumStock,
    );
    return response.rows[0];
};

const changeActiveStateSku = async (id, isActive) => {
    const response = await skuRepository.changeActiveStateSku(id, isActive);
    return response.rows[0];
};

// *** NOTA: No se eliminaran cosas, se manejaran con cambios de estado. ***
// const deleteSku = async (id) => {
//     await skuRepository.deleteSku(id);
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
