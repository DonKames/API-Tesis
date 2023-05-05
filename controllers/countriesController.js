// const db = require('../config/db');

const db = require('../config/db');

const getCountries = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM countries');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCountryById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".countries WHERE country_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createCountry = async (req, res) => {
    try {
        const { name, iso_code } = req.body;
        const response = await db.query(
            'INSERT INTO "public".countries (name, iso_code) VALUES ($1, $2) RETURNING *',
            [name, iso_code],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, iso_code } = req.body;
        const response = await db.query(
            'UPDATE "public".countries SET name = $1, iso_code = $2 WHERE country_id = $3 RETURNING *',
            [name, iso_code, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM "public".countries WHERE country_id = $1', [
            id,
        ]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
};
