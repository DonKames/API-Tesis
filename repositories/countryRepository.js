const db = require('../config/db');

const getCountries = async () => {
    return await db.query('SELECT * FROM countries');
};

const getCountryById = async (id) => {
    return await db.query(
        'SELECT * FROM "public".countries WHERE country_id = $1',
        [id],
    );
};

const createCountry = async (name, isoCode) => {
    return await db.query(
        'INSERT INTO "public".countries (name, iso_code) VALUES ($1, $2) RETURNING *',
        [name, isoCode],
    );
};

const updateCountry = async (name, isoCode, id) => {
    return await db.query(
        'UPDATE "public".countries SET name = $1, iso_code = $2 WHERE country_id = $3 RETURNING *',
        [name, isoCode, id],
    );
};

const deleteCountry = async (id) => {
    return await db.query(
        'DELETE FROM "public".countries WHERE country_id = $1',
        [id],
    );
};

module.exports = {
    getCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
};
