const branchLocationsRepository = require('../repositories/branchLocationsRepository');

const getBranchLocations = async (limit, offset, showInactive) => {
    const response = await branchLocationsRepository.getBranchLocations(
        limit,
        offset,
        showInactive,
    );
    return response.rows;
};

const getBranchLocationsQty = async () => {
    const response = await branchLocationsRepository.getBranchLocationsQty();
    return parseInt(response.rows[0].count);
};

const getBranchLocationById = async (id) => {
    const response = await branchLocationsRepository.getBranchLocationById(id);
    return response.rows[0];
};

const createBranchLocation = async ({
    branchLocationName,
    description,
    branchId,
}) => {
    const response = await branchLocationsRepository.createBranchLocation({
        branchLocationName,
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
