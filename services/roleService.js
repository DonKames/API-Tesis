const roleRepository = require('../repositories/roleRepository');

const getRolesSelect = async () => {
    const response = await roleRepository.getRolesSelect();
    return response.rows;
};

module.exports = {
    getRolesSelect,
};
