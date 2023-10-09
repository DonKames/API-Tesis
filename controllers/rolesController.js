const db = require('../config/db');

const roleService = require('../services/roleService');

const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getRoles = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM roles');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getRolesSelect = handleErrors(async (req, res) => {
    const response = await roleService.getRolesSelect();

    if (!response) {
        sendError(res, 'Roles not found', 404);
    } else {
        const formattedResponse = response.map((row) => ({
            id: row.role_id,
            name: row.name,
        }));

        sendSuccess(res, 'Roles retrieved successfully', formattedResponse);
    }
});

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await db.query(
            'SELECT * FROM roles WHERE role_id = $1',
            [id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createRole = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await db.query(
            'INSERT INTO roles (name) VALUES ($1) RETURNING *',
            [name],
        );
        res.status(201).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const response = await db.query(
            'UPDATE roles SET name = $1 WHERE role_id = $2 RETURNING *',
            [name, id],
        );
        res.status(200).json(response.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM roles WHERE role_id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getRoles,
    getRolesSelect,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
};
