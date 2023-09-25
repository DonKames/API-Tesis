const db = require('../config/db');

const getRegions = async () => {
    return await db.query('SELECT * FROM regions');
};

module.exports = {
    getRegions,
};
