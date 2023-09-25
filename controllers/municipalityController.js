const municipalityService = require('../services/municipalityService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getMunicipalities = handleErrors(async (req, res) => {
    try {
        const response = await municipalityService.getMunicipalities();

        const formattedResponse = response.map((row) => ({
            id: row.municipality_id,
            name: row.name,
            regionId: row.fk_region_id,
        }));

        sendSuccess(res, 'Municipios Recuperados', formattedResponse);
    } catch (error) {
        console.log(error);
        sendError(res, 'Error al recuperar los municipios', error);
    }
});

module.exports = {
    getMunicipalities,
};
