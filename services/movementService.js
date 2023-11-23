const movementRepository = require('../repositories/movementRepository');

const getMovements = async (limit, offset, showInactive, searchTerm) => {
    const response = await movementRepository.getMovements(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    // console.log('mov Serv: ', response);

    return response;
};

const getMovementsQty = async () => {
    const response = await movementRepository.getMovementsQty();

    return parseInt(response.rows[0].count);
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
    getMovementsQty,
    getMovementById,
    getLastAddedProducts,
    createMovement,
    updateMovement,
    deleteMovement,
};
