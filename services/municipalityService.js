const municipalityRepository = require('../repositories/municipalityRepository');

const getMunicipalities = async () => {
    const response = await municipalityRepository.getMunicipalities();
    return response.rows;
};

module.exports = {
    getMunicipalities,
};
