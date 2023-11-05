const movementRepository = require('../repositories/movementRepository');

const getMovements = async () => {
    return await movementRepository.getMovements();
};

const getMovementById = async (id) => {
    return await movementRepository.getMovementById(id);
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
    createMovement,
    updateMovement,
    deleteMovement,
};
