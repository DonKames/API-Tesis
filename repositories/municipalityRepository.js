const db = require('../config/db');

const getMunicipalities = async () => {
    return await db.query('SELECT * FROM municipalities');
};

module.exports = {
    getMunicipalities,
};
