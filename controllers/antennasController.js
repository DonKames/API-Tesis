const db = require('../config/db');

const getAntennas = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM antennas');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAntennaById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM "public".antennas WHERE antenna_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createAntenna = async (req, res) => {
    try {
        const { name, location } = req.body;
        const response = await db.query(
            'INSERT INTO "public".antennas (name, location) VALUES ($1, $2) RETURNING *',
            [name, location],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateAntenna = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location } = req.body;
        const response = await db.query(
            'UPDATE "public".antennas SET name = $1, location = $2 WHERE antenna_id = $3 RETURNING *',
            [name, location, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteAntenna = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM "public".antennas WHERE antenna_id = $1', [
            id,
        ]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAntennas,
    getAntennaById,
    createAntenna,
    updateAntenna,
    deleteAntenna,
};
