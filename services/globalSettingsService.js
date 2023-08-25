const globalSettingsRepository = require('../repositories/globalSettingsRepository');

const getGlobalSettings = async () => {
    return await globalSettingsRepository.getGlobalSettings();
};

const createGlobalSettings = async (idWarehouse) => {
    return await globalSettingsRepository.createGlobalSettings(idWarehouse);
};

const updateGlobalSettings = async (
    idMainBranch,
    idMainWarehouse,
    idGlobalSettings,
) => {
    return await globalSettingsRepository.updateGlobalSettings(
        idMainBranch,
        idMainWarehouse,
        idGlobalSettings,
    );
};

module.exports = {
    getGlobalSettings,
    createGlobalSettings,
    updateGlobalSettings,
};
