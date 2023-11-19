const movementRepository = require('../repositories/movementRepository');

const getMovements = async () => {
    return await movementRepository.getMovements();
};

const getMovementById = async (id) => {
    return await movementRepository.getMovementById(id);
};

const getLastAddedProducts = async (limit, startDate, endDate) => {
    return await movementRepository.getLastAddedProducts(
        limit,
        startDate,
        endDate,
    );
};

const createMovement = async (movementData) => {
    return await movementRepository.createMovement(movementData);
};

const updateMovement = async (id, movementData) => {
    return await movementRepository.updateMovement(id, movementData);
};

const deleteMovement = async (id) => {
    return await movementRepository.deleteMovement(id);
};

module.exports = {
    getMovements,
    getMovementById,
    getLastAddedProducts,
    createMovement,
    updateMovement,
    deleteMovement,
};
