const skuRepository = require('../repositories/skuRepository');

const getSkus = async (limit, offset, showInactive) => {
    const response = await skuRepository.getSkus(limit, offset, showInactive);
    return response.rows;
};

const getSkusQty = async (showInactive) => {
    const response = await skuRepository.getSkusQty(showInactive);
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
    const response = await skuRepository.getSkusNames();
    return response.rows[0];
};

const createSku = async (name, price, description, sku, lote, order) => {
    const response = await skuRepository.createSku(
        name,
        price,
        description,
        sku,
        lote,
        order,
    );
    return response.rows[0];
};

const updateSku = async (id, name, price, description, minimumStock) => {
    const response = await skuRepository.updateSku(
        id,
        name,
        price,
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
    getSkus,
    getSkuById,
    getSkuBySku,
    getSkusNames,
    createSku,
    updateSku,
    changeActiveStateSku,
};
