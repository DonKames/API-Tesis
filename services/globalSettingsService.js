const globalSettingsRepository = require('../repositories/globalSettingsRepository');

const getGlobalSettings = async () => {
    return await globalSettingsRepository.getGlobalSettings();
};

const createGlobalSettings = async (idWarehouse) => {
    return await globalSettingsRepository.createGlobalSettings(idWarehouse);
};

const updateGlobalSettings = async (params) => {
    return await globalSettingsRepository.updateGlobalSettings(params);
};

module.exports = {
    getGlobalSettings,
    createGlobalSettings,
    updateGlobalSettings,
};
