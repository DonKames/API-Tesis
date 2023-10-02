const warehouseService = require('../services/warehouseService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getWarehouses = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await warehouseService.getWarehouses(
        limit,
        offset,
        showInactive,
    );

    // console.log(response);

    const formattedResponse = response.map((row) => ({
        id: row.warehouse_id,
        name: row.warehouse_name,
        capacity: row.capacity,
        branchId: row.fk_branch_id,
        active: row.active,
        branchName: row.branch_name,
    }));

    sendSuccess(res, 'Warehouses recovered correctly ', formattedResponse);
    // res.status(200).json(formattedResponse);
});

const getWarehousesQty = handleErrors(async (req, res) => {
    const showInactive = req.query.showInactive === 'true' || false;
    const warehousesQty = await warehouseService.getWarehousesQty(showInactive);
    console.log(warehousesQty);
    if (!warehousesQty) {
        sendError(res, 'Warehouses qty not found', 404);
    } else {
        sendSuccess(res, 'Warehouses qty recovered correctly', warehousesQty);
    }
});

const getWarehousesNames = handleErrors(async (req, res) => {
    const response = await warehouseService.getWarehousesNames();
    const formattedResponse = response.rows.map((row) => ({
        id: row.warehouse_id,
        name: row.name,
        branchId: row.fk_branch_id,
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
    const { name, capacity, branchId, active } = req.body;

    console.log(req.body, req.params);
    const response = await warehouseService.updateWarehouse(id, {
        name,
        capacity,
        branchId,
        active,
    });

    if (response) {
        const formattedResponse = {
            id: response.warehouse_id,
            name: response.name,
            capacity: response.capacity,
            branchId: response.fk_branch_id,
            active: response.active,
        };

        sendSuccess(res, 'Warehouse updated correctly', formattedResponse);
    } else {
        sendError(res, 'Warehouse not found', 404);
    }
    // res.status(200).json(response);
});

const changeActiveStateWarehouse = handleErrors(async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        const response = await warehouseService.changeActiveStateWarehouse(
            id,
            active,
        );

        if (response) {
            const formattedResponse = {
                id: response.warehouse_id,
                name: response.warehouse_name,
                capacity: response.capacity,
                branchId: response.fk_branch_id,
                active: response.active,
            };

            sendSuccess(
                res,
                `Warehouse ${active ? 'activated' : 'deactivated'} correctly`,
                formattedResponse,
            );
        } else {
            sendError(res, 'Warehouse not found', 404);
        }
    } catch (error) {
        console.log(error);
        sendError(
            res,
            'Error al actualizar el estado activo de la Bodega',
            500,
        );
    }
});

module.exports = {
    getWarehouses,
    getWarehousesQty,
    getWarehousesNames,
    getWarehouseById,
    createWarehouse,
    updateWarehouse,
    changeActiveStateWarehouse,
};
