const countryService = require('../services/countryService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getCountries = handleErrors(async (req, res) => {
    const response = await countryService.getCountries();
    const formattedResponse = response.map((row) => ({
        id: row.country_id,
        name: row.name,
        isoCode: row.iso_code,
    }));

    sendSuccess(res, 'Países Recuperados', formattedResponse);
    // res.status(200).json(formattedResponse);
});

const getCountryById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await countryService.getCountryById(id);
    if (response) {
        const formattedResponse = {
            id: response.country_id,
            name: response.name,
            isoCode: response.iso_code,
        };

        sendSuccess(res, 'País Recuperado', formattedResponse);
    } else {
        sendError(res, 'Country not found', 404);
    }
});

const createCountry = handleErrors(async (req, res) => {
    const { name, isoCode } = req.body;
    const response = await countryService.createCountry(name, isoCode);
    res.status(201).json(response);
});

const updateCountry = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { name, isoCode } = req.body;
    const response = await countryService.updateCountry(name, isoCode, id);
    if (response) {
        res.status(200).json(response);
    } else {
        sendError(res, 'Country not found', 404);
    }
});

const deleteCountry = handleErrors(async (req, res) => {
    const { id } = req.params;
    await countryService.deleteCountry(id);
    res.status(204).send();
});

module.exports = {
    getCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
};
