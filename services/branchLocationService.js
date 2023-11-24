const branchLocationsRepository = require('../repositories/branchLocationsRepository');

const getBranchLocations = async (limit, offset, showInactive, searchTerm) => {
    const response = await branchLocationsRepository.getBranchLocations(
        limit,
        offset,
        showInactive,
        searchTerm,
    );
    return response;
};

const getBranchLocationsQty = async () => {
    const response = await branchLocationsRepository.getBranchLocationsQty();
    return parseInt(response.rows[0].count);
};

const getBranchLocationById = async (id) => {
    const response = await branchLocationsRepository.getBranchLocationById(id);
    return response.rows[0];
};

const createBranchLocation = async ({ name, description, branchId }) => {
    const response = await branchLocationsRepository.createBranchLocation({
        name,
        description,
        branchId,
    });
    return response.rows[0];
};

const updateBranchLocation = async (id, { name, description, branchId }) => {
    const response = await branchLocationsRepository.updateBranchLocation(id, {
        name,
        description,
        branchId,
    });
    return response.rows[0];
};

const changeActiveStateBranchLocation = async (id, activeState) => {
    const response =
        await branchLocationsRepository.changeActiveStateBranchLocation(
            id,
            activeState,
        );
    return response.rows[0];
};

module.exports = {
    getBranchLocations,
    getBranchLocationsQty,
    getBranchLocationById,
    createBranchLocation,
    updateBranchLocation,
    changeActiveStateBranchLocation,
};
