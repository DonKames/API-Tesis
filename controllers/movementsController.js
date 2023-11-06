const movementService = require('../services/movementService');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getMovements = async (req, res) => {
    try {
        const movements = await movementService.getMovements();
        sendSuccess(res, 'Movements retrieved successfully', movements);
    } catch (err) {
        sendError(res, 'Internal server error', 500);
    }
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
        const limit = req.query.limit || 10;
        const lastAddedProducts =
            await movementService.getLastAddedProducts(limit);

        console.log('lastAddedProducts', lastAddedProducts[0]);

        const formattedResponse = lastAddedProducts.map((m) => ({
            ...m,
            id: m.movement_id,
            productId: m.fk_product_id,
            productName: m.product_name,
            userId: m.fk_user_id,
            userFirstName: m.user_first_name,
            userLastName: m.user_last_name,
            timestamp: m.movement_timestamp,
            warehouseId: m?.fk_warehouse_id,
            taskId: m?.fk_task_id,
            movementTypeId: m.fk_movement_type_id,
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
    getMovementById,
    getLastAddedProducts,
    createMovement,
    updateMovement,
    deleteMovement,
};
