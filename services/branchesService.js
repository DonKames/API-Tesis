const branchRepository = require('../repositories/branchesRepository');

const getBranches = async (page, limit) => {
    const offset = (page - 1) * limit;
    return await branchRepository.getBranches(limit, offset);
};

const getBranchesQty = async () => {
    const response = await branchRepository.getBranchesQty();
    console.log('getBranchesQty: ', response.rows[0].count);
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

const deleteBranch = async (id) => {
    return await branchRepository.deleteBranch(id);
};

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};
