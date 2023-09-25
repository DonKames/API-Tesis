const regionService = require('../services/regionService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess } = require('../middlewares/responseHandler');

const getRegions = handleErrors(async (req, res) => {
    const response = await regionService.getRegions();

    const formattedResponse = response.map((row) => ({
        id: row.region_id,
        name: row.name,
        countryId: row.fk_country_id,
    }));

    sendSuccess(res, 'Regiones Recuperadas', formattedResponse);
});

// const getRegionById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const response = await db.query(
//             'SELECT * FROM regions WHERE region_id = $1',
//             [id],
//         );
//         res.status(200).json(response.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// const createRegion = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const response = await db.query(
//             'INSERT INTO regions (name) VALUES ($1) RETURNING *',
//             [name],
//         );
//         res.status(201).json(response.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// const updateRegion = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name } = req.body;
//         const response = await db.query(
//             'UPDATE regions SET name = $1 WHERE region_id = $2 RETURNING *',
//             [name, id],
//         );
//         res.status(200).json(response.rows[0]);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// const deleteRegion = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.query('DELETE FROM regions WHERE region_id = $1', [id]);
//         res.status(204).send();
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

module.exports = {
    getRegions,
    // getRegionById,
    // createRegion,
    // updateRegion,
    // deleteRegion,
};
