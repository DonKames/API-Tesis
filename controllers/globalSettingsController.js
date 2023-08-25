const globalSettingsService = require('../services/globalSettingsService');
const handleErrors = require('../middlewares/errorHandler');

const getGlobalSettings = handleErrors(async (req, res) => {
    const response = await globalSettingsService.getGlobalSettings();
    res.status(200).json(response.rows[0]);
});

const createGlobalSettings = handleErrors(async (req, res) => {
    const idWarehouse = req.body.warehouse_id;
    const response = await globalSettingsService.createGlobalSettings(
        idWarehouse,
    );
    res.status(201).json(response.rows[0]);
});

const updateGlobalSettings = handleErrors(async (req, res) => {
    const { mainWarehouseId, mainBranchId, globalSettingsId } = req.body;
    console.log(req.body);
    const response = await globalSettingsService.updateGlobalSettings(
        mainBranchId,
        mainWarehouseId,
        globalSettingsId,
    );
    res.status(200).json(response.rows[0]);
});

module.exports = {
    getGlobalSettings,
    createGlobalSettings,
    updateGlobalSettings,
};
