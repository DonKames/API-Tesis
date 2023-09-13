const warehouseService = require('../services/warehouseService');
const handleErrors = require('../middlewares/errorHandler');

const getWarehouses = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const response = await warehouseService.getWarehouses(page, limit);
    res.status(200).json(response);
});

const getWarehousesQty = handleErrors(async (req, res) => {
    const warehousesQty = await warehouseService.getWarehousesQty();
    res.status(200).json(warehousesQty);
});

const getWarehousesNames = handleErrors(async (req, res) => {
    const response = await warehouseService.getWarehousesNames();
    const formattedResponse = response.rows.map((row) => ({
        id: row.warehouse_id,
        name: row.name,
    }));
    res.status(200).json(formattedResponse);
});

const getWarehouseById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await warehouseService.getWarehouseById(id);
    res.status(200).json(response);
});

const createWarehouse = handleErrors(async (req, res) => {
    const { warehouseName, capacity, branchId } = req.body;
    const response = await warehouseService.createWarehouse({
        warehouseName,
        capacity,
        branchId,
    });
    res.status(201).json(response);
});

const updateWarehouse = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { warehouseName, locationId } = req.body;
    const response = await warehouseService.updateWarehouse(id, {
        warehouseName,
        locationId,
    });
    res.status(200).json(response);
});

const deleteWarehouse = handleErrors(async (req, res) => {
    const { id } = req.params;
    await warehouseService.deleteWarehouse(id);
    res.status(204).send();
});

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
