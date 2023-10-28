const warehouseService = require('../services/warehouseService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

/**
 * Retrieves a list of warehouses with optional pagination and filtering.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves when the response has been sent.
 */
/* The `getWarehouses` function is an asynchronous function that retrieves a list of warehouses with
optional pagination and filtering. */
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

    if (response) {
        const formattedResponse = response.map((row) => ({
            id: row.warehouse_id,
            name: row.warehouse_name,
            capacity: row.capacity,
            branchId: row.fk_branch_id,
            active: row.active,
            branchName: row.branch_name,
        }));

        sendSuccess(res, 'Bodegas recuperadas exitosamente', formattedResponse);
    } else {
        sendError(res, 'Bodegas no encontradas', 404);
    }
});

const getWarehousesQty = handleErrors(async (req, res) => {
    const branchId = req.query.branchId || null;

    const showInactive = req.query.showInactive === 'true' || false;

    let qty;

    console.log('getWarehousesQty query', req.query);

    console.log('getWarehousesQty params', req.params);

    console.log('getWarehousesQty params', req.params);

    try {
        if (branchId) {
            qty = await warehouseService.getWarehousesQtyByBranchId(branchId);
            console.log(qty);
        } else {
            qty = await warehouseService.getWarehousesQty(showInactive);
        }

        console.log('qty: ', qty);

        qty
            ? sendSuccess(res, 'Warehouses qty recovered correctly', qty)
            : sendError(res, 'Warehouses qty not found', 404);
    } catch (error) {
        sendError(res, 'Error al obtener la cantidad de Bodegas', 500);
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

    console.log(response.rows[0]);

    const formattedResponse = {
        id: response.rows[0].warehouse_id,
        name: response.rows[0].name,
        capacity: response.rows[0].capacity,
        branchId: response.rows[0].fk_branch_id,
        active: response.rows[0].active,
        branchName: response.rows[0].branch_name,
    };

    sendSuccess(res, 'Warehouse recovered correctly', formattedResponse);
});

const createWarehouse = handleErrors(async (req, res) => {
    const { warehouseName, capacity, branchId } = req.body;
    const response = await warehouseService.createWarehouse({
        warehouseName,
        capacity,
        branchId,
    });
    if (response) {
        console.log(response);
        const formattedResponse = {
            id: response.warehouse_id,
            name: response.name,
            capacity: response.capacity,
            branchId: response.fk_branch_id,
            active: response.active,
        };

        sendSuccess(res, 'Bodega Creada Exitosamente', formattedResponse);
    } else {
        sendError(res, 'No se pudo crear la bodega', 404);
    }
});

const updateWarehouse = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { warehouseName, capacity, branchId, active } = req.body;

    console.log(req.body, req.params);
    const response = await warehouseService.updateWarehouse(id, {
        warehouseName,
        capacity,
        branchId,
        active,
    });

    console.log(response);

    if (response) {
        const formattedResponse = {
            id: response.warehouse_id,
            name: response.name,
            capacity: response.capacity,
            branchId: response.fk_branch_id,
            active: response.active,
            branchName: response.branch_name,
        };

        sendSuccess(res, 'Bodega actualizada correctamente', formattedResponse);
    } else {
        sendError(res, 'Bodega no encontrada para actualizar', 404);
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
            sendError(res, 'Bodega no encontrada para actualizar', 404);
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
