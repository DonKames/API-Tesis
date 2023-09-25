const regionRepository = require('../repositories/regionRepository');

const getRegions = async () => {
    const response = await regionRepository.getRegions();
    return response.rows;
};

module.exports = {
    getRegions,
};
