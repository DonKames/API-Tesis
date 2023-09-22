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

const createBranch = async (branchName, region, address) => {
    return await branchRepository.createBranch(branchName, region, address);
};

const updateBranch = async (branchName, region, address, id) => {
    return await branchRepository.updateBranch(branchName, region, address, id);
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
