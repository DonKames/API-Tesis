const countryRepository = require('../repositories/countryRepository');

const getCountries = async () => {
    const response = await countryRepository.getCountries();
    return response.rows;
};

const getCountryById = async (id) => {
    const response = await countryRepository.getCountryById(id);
    return response.rows[0];
};

const createCountry = async (name, isoCode) => {
    const response = await countryRepository.createCountry(name, isoCode);
    return response.rows[0];
};

const updateCountry = async (name, isoCode, id) => {
    const response = await countryRepository.updateCountry(name, isoCode, id);
    return response.rows[0];
};

const deleteCountry = async (id) => {
    await countryRepository.deleteCountry(id);
};

module.exports = {
    getCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
};
