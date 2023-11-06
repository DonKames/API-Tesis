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
    console.log('query:', req.query.limit);
    try {
        const limit = req.query.limit || 10; // Por ejemplo, por defecto 10
        const lastAddedProducts =
            await movementService.getLastAddedProducts(limit);

        console.log('lastAddedProducts', lastAddedProducts);

        sendSuccess(
            res,
            'Últimos productos agregados recuperados con éxito',
            lastAddedProducts,
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
