const movementService = require('../services/movementService');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');
const handleErrors = require('../middlewares/errorHandler');

const getMovements = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;
    const searchTerm = req.query.searchTerm;

    console.log(searchTerm);

    const offset = (page - 1) * limit;

    const response = await movementService.getMovements(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    console.log('movements:', response);

    const { movements, movementsQty } = response;

    if (movements) {
        const formattedMovements = movements.map((row) => ({
            id: row.movement_id,
            antenna: row.fk_antenna_id,
            productId: row.fk_product_id,
            userId: row.fk_user_id,
            timestamp: row.movement_timestamp,
            warehouseId: row.fk_warehouse_id,
            taskId: row.fk_task_id,
            movementTypeId: row.fk_movement_type_id,
            userFirstName: row.user_first_name,
            userLastName: row.user_last_name,
            movementTypeName: row.movement_type_name,
            productEPC: row.product_epc,
            productName: row.product_name,
            warehouseName: row.warehouse_name,
            branchName: row.branch_name,
            skuName: row.sku_name,
        }));

        sendSuccess(res, 'Movements retrieved successfully', {
            data: formattedMovements,
            qty: movementsQty,
        });
    } else {
        sendError(res, 'Internal server error', 500);
    }
});

const getMovementsQty = async (req, res) => {
    const movementId = req.query.movementId;

    let qty;

    if (movementId) {
        qty = await movementService.getMovementsQtyByMovementId(movementId);
    } else {
        qty = await movementService.getMovementsQty();
    }

    qty
        ? sendSuccess(res, `Cantidad de movimientos: ${qty}`, qty)
        : sendError(res, 'No se encontró la cantidad', 404);
};

const getMovementById = async (req, res) => {
    try {
        const { id } = req.params;
        const movement = await movementService.getMovementById(id);
        if (movement) {
            sendSuccess(res, 'Movement retrieved successfully', movement);
        } else {
            sendError(res, 'Movement not found', 404);
        }
    } catch (err) {
        sendError(res, 'Internal server error', 500);
    }
};

const getLastAddedProducts = async (req, res) => {
    // console.log('lastAddedProducts');

    try {
        const limit = req.query.limit;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        console.log(limit, startDate, endDate);

        const lastAddedProducts = await movementService.getLastAddedProducts(
            limit,
            startDate,
            endDate,
        );

        // console.log('lastAddedProducts', lastAddedProducts[0]);

        const formattedResponse = lastAddedProducts.map((m) => ({
            // ...m,
            active: m.active,
            antenna: m.fk_antenna_id,
            description: m.description,
            epc: m.epc,
            id: m.movement_id,
            minimumStock: m.minimum_stock,
            movementId: m.movement_id,
            // movementTimestamp: m.movement_timestamp,
            movementTypeId: m.fk_movement_type_id,
            name: m.name,
            productId: m.fk_product_id,
            productName: m.product_name,
            sku: m.sku,
            skuId: m.fk_sku_id,
            taskId: m?.fk_task_id,
            timestamp: m.movement_timestamp,
            userFirstName: m.user_first_name,
            userId: m.fk_user_id,
            userLastName: m.user_last_name,
            warehouseId: m?.fk_warehouse_id,
            warehouseName: m.warehouse_name,
        }));

        sendSuccess(
            res,
            'Últimos productos agregados recuperados con éxito',
            formattedResponse,
        );
    } catch (err) {
        console.log('controllerError');
        sendError(res, 'Error del servidor interno', 500);
    }
};

const createMovement = async (req, res) => {
    try {
        const newMovement = await movementService.createMovement(req.body);
        sendSuccess(res, 'Movimiento creado con éxito', newMovement, 201);
    } catch (err) {
        sendError(res, 'Internal server error', 500);
    }
};

const updateMovement = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMovement = await movementService.updateMovement(
            id,
            req.body,
        );
        if (updatedMovement) {
            sendSuccess(res, 'Movement updated successfully', updatedMovement);
        } else {
            sendError(res, 'Movement not found', 404);
        }
    } catch (err) {
        sendError(res, 'Internal server error', 500);
    }
};

const deleteMovement = async (req, res) => {
    try {
        const { id } = req.params;
        await movementService.deleteMovement(id);
        sendSuccess(res, 'Movement deleted successfully', {}, 204);
    } catch (err) {
        sendError(res, 'Internal server error', 500);
    }
};

module.exports = {
    getMovements,
    getMovementsQty,
    getMovementById,
    getLastAddedProducts,
    createMovement,
    updateMovement,
    deleteMovement,
};
