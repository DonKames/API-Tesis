const userService = require('../services/userService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getUsers = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await userService.getUsers(limit, offset, showInactive);

    console.log(response);

    const formattedResponse = response.map((row) => ({
        id: row.user_id,
        name: row.first_name,
        lastName: row.last_name,
        role: row.fk_role_id,
        email: row.email,
        active: row.active,
        roleName: row.role_name,
    }));

    sendSuccess(res, 'Users retrieved successfully', formattedResponse);
});

const getUsersQty = handleErrors(async (req, res) => {
    const usersQty = await userService.getUsersQty();
    if (!usersQty) {
        sendError(res, 'Users quantity not found', 404);
    } else {
        sendSuccess(res, 'Users quantity retrieved successfully', usersQty);
    }
});

const getUserById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await userService.getUserById(id);
    res.status(200).json(response);
});

const getUserByUid = handleErrors(async (req, res) => {
    const { uid } = req.params;
    const response = await userService.getUserByUid(uid);
    res.status(200).json(response);
});

const getUserByEmail = handleErrors(async (req, res) => {
    const { email } = req.params;
    const response = await userService.getUserByEmail(email);
    res.status(200).json(response);
});

const createUser = handleErrors(async (req, res) => {
    const { name, lastName, role, email } = req.body;
    const response = await userService.createUser({
        name,
        lastName,
        role,
        email,
    });
    res.status(201).json(response);
});

const updateUserUid = handleErrors(async (req, res) => {
    const { email } = req.params;
    const { uid } = req.body;
    const response = await userService.updateUserUid(email, uid);

    res.status(200).json(response);
});

const updateUser = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, role } = req.body;

    const response = await userService.updateUser(id, {
        name,
        lastName,
        email,
        role,
    });

    if (response) {
        // console.log(response);
        sendSuccess(res, 'User updated successfully', response);
    } else {
        sendError(res, 'User not found', 404);
    }
});

const deleteUser = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await userService.deleteUser(id);

    if (response) {
        sendSuccess(res, 'User deleted successfully', response);
    } else {
        sendError(res, 'User not found', 404);
    }
});

const changeActiveStateUser = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;

    const response = await userService.changeActiveStateUser(id, state);

    if (response) {
        sendSuccess(res, 'User updated successfully', response);
    } else {
        sendError(res, 'User not found', 404);
    }
});

module.exports = {
    getUsers,
    getUsersQty,
    getUserById,
    getUserByUid,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserUid,
    deleteUser,
    changeActiveStateUser,
};
