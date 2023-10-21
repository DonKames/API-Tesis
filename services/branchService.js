const branchRepository = require('../repositories/branchRepository');

const getBranches = async (limit, offset, showInactive) => {
    const response = await branchRepository.getBranches(
        limit,
        offset,
        showInactive,
    );
    return response.rows;
};

const getBranchesQty = async (showInactive) => {
    const response = await branchRepository.getBranchesQty(showInactive);
    return parseInt(response.rows[0].count);
};

const getBranchesNames = async () => {
    return await branchRepository.getBranchesNames();
};

const getBranchById = async (id) => {
    return await branchRepository.getBranchById(id);
};

const createBranch = async (branchName, municipality, address) => {
    const response = await branchRepository.createBranch(
        branchName,
        municipality,
        address,
    );

    return response.rows[0];
};

const updateBranch = async (id, { branchName, address, municipality }) => {
    console.log('branchService :', id, branchName, address, municipality);

    const response = await branchRepository.updateBranch(id, {
        branchName,
        address,
        municipality,
    });

    return response.rows[0];
};

// const deleteBranch = async (id) => {
//     return await branchRepository.deleteBranch(id);
// };

const changeActiveStateBranch = async (id, isActive) => {
    const response = await branchRepository.changeActiveStateBranch(
        id,
        isActive,
    );
    return response.rows[0];
};

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    // deleteBranch,
    changeActiveStateBranch,
};
