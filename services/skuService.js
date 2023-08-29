const skuRepository = require('../repositories/skuRepository');

const getSkusQty = async () => {
    const response = await skuRepository.getSkusQty();
    return parseInt(response.rows[0].count);
};

const getSkus = async (limit, offset) => {
    const response = await skuRepository.getSkus(limit, offset);
    return response.rows;
};

const getSkuById = async (id) => {
    const response = await skuRepository.getSkuById(id);
    return response.rows[0];
};

const getSkuBySku = async (sku) => {
    const response = await skuRepository.getSkuBySku(sku);
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

const updateSku = async (id, name, price, description) => {
    const response = await skuRepository.updateSku(
        id,
        name,
        price,
        description,
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
    createSku,
    updateSku,
    changeActiveStateSku,
};
