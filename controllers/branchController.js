const branchService = require('../services/branchService');
const handleErrors = require('../middlewares/errorHandler');

const getBranches = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await branchService.getBranches(
        limit,
        offset,
        showInactive,
    );

    console.log(response);

    const formattedResponse = response.map((row) => ({
        id: row.branch_id,
        name: row.name,
        regionId: row.fk_region_id,
        address: row.address,
        regionName: row.region_name,
        countryName: row.country_name,
        countryId: row.country_id,
    }));

    res.status(200).json(formattedResponse);
});

const getBranchesQty = handleErrors(async (req, res) => {
    const branchesQty = await branchService.getBranchesQty();
    res.status(200).json(branchesQty);
});

const getBranchesNames = handleErrors(async (req, res) => {
    const response = await branchService.getBranchesNames();

    const formattedResponse = response.rows.map((row) => ({
        id: row.branch_id,
        name: row.name,
    }));
    res.status(200).json(formattedResponse);
});

const getBranchById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await branchService.getBranchById(id);
    const formattedResponse = {
        id: response.rows[0].branch_id,
        name: response.rows[0].name,
        regionId: response.rows[0].fk_region_id,
        address: response.rows[0].address,
    };
    res.status(200).json(formattedResponse);
});

const createBranch = handleErrors(async (req, res) => {
    const { branchName, region, address } = req.body;
    const response = await branchService.createBranch(
        branchName,
        region,
        address,
    );
    res.status(201).json(response.rows[0]);
});

const updateBranch = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { branchName, fk_region_id: fkRegionId, address } = req.body;
    const response = await branchService.updateBranch(
        branchName,
        fkRegionId,
        address,
        id,
    );
    res.status(200).json(response.rows[0]);
});

const deleteBranch = handleErrors(async (req, res) => {
    const { id } = req.params;
    await branchService.deleteBranch(id);
    res.status(204).send();
});

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
};
