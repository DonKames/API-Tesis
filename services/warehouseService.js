const warehouseRepository = require('../repositories/warehouseRepository');

const getWarehouses = async (limit, offset, showInactive) => {
    const response = await warehouseRepository.getWarehouses(
        limit,
        offset,
        showInactive,
    );
    return response.rows;
};

const getWarehousesQty = async () => {
    const response = await warehouseRepository.getWarehousesQty();
    return parseInt(response);
};

const getWarehousesNames = async () => {
    return await warehouseRepository.getWarehousesNames();
};

const getWarehouseById = async (id) => {
    return await warehouseRepository.getWarehouseById(id);
};

const createWarehouse = async ({ warehouseName, capacity, branchId }) => {
    return await warehouseRepository.createWarehouse({
        warehouseName,
        capacity,
        branchId,
    });
};

const updateWarehouse = async (id, { warehouseName, locationId }) => {
    return await warehouseRepository.updateWarehouse(id, {
        warehouseName,
        locationId,
    });
};

const deleteWarehouse = async (id) => {
    return await warehouseRepository.deleteWarehouse(id);
};

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
