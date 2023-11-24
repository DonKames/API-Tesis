const warehouseRepository = require('../repositories/warehouseRepository');

const getWarehouses = async (limit, offset, showInactive, searchTerm) => {
    const response = await warehouseRepository.getWarehouses(
        limit,
        offset,
        showInactive,
        searchTerm,
    );
    return response;
};

const getWarehousesQty = async (showInactive) => {
    const response = await warehouseRepository.getWarehousesQty(showInactive);
    return parseInt(response.rows[0].count);
};

const getWarehousesQtyByBranchId = async (branchId) => {
    const response =
        await warehouseRepository.getWarehousesQtyByBranchId(branchId);
    return parseInt(response.rows[0].count);
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

const updateWarehouse = async (
    id,
    { warehouseName, capacity, branchId, active },
) => {
    const response = await warehouseRepository.updateWarehouse(id, {
        warehouseName,
        capacity,
        branchId,
        active,
    });

    return response.rows[0];
};

const changeActiveStateWarehouse = async (id, activeState) => {
    const response = await warehouseRepository.changeActiveStateWarehouse(
        id,
        activeState,
    );

    return response.rows[0];
};

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesQtyByBranchId,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    changeActiveStateWarehouse,
};
