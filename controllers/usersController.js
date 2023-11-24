const userService = require('../services/userService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getUsers = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;
    const searchTerm = req.query.searchTerm;

    const offset = (page - 1) * limit;

    const response = await userService.getUsers(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    const { data, qty } = response;

    // console.log(response);

    const formattedResponse = data.map((row) => ({
        id: row.user_id,
        name: row.first_name,
        lastName: row.last_name,
        roleId: row.fk_role_id,
        email: row.email,
        active: row.active,
        roleName: row.role_name,
    }));

    sendSuccess(res, 'Users retrieved successfully', {
        data: formattedResponse,
        qty,
    });
});

const getUsersQty = handleErrors(async (req, res) => {
    const userId = req.query.warehouseId || null;

    const showInactive = req.query.showInactive === 'true' || false;

    let qty;

    try {
        if (userId) {
            qty = await userService.getUsersQtyByUserId(userId);
        } else {
            qty = await userService.getUsersQty(showInactive);
        }

        qty
            ? sendSuccess(res, `Cantidad de usuarios: ${qty}`, qty)
            : sendError(res, 'No se encontró la cantidad', 404);
    } catch (error) {
        sendError(
            res,
            'Error al obtener la cantidad de Usuarios' || error.message,
            500,
        );
    }
});

const getUserById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await userService.getUserById(id);

    // console.log(response);

    const formattedResponse = {
        id: response.user_id,
        name: response.first_name,
        lastName: response.last_name,
        roleId: response.fk_role_id,
        email: response.email,
        active: response.active,
        roleName: response.role_name,
    };

    formattedResponse
        ? sendSuccess(res, 'User retrieved successfully', formattedResponse)
        : sendError(res, 'User not found', 404);
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

const getUsersNames = handleErrors(async (req, res) => {
    const response = await userService.getUsersNames();

    if (response) {
        const formattedResponse = response.rows.map((row) => ({
            id: row.user_id,
            name: row.first_name,
            lastName: row.last_name,
        }));

        sendSuccess(
            res,
            'Users names retrieved successfully',
            formattedResponse,
        );
    } else {
        sendError(res, 'UsersNames not found', 404);
    }
});

const createUser = handleErrors(async (req, res) => {
    const { name, lastName, roleId, email } = req.body;
    console.log(req.body);
    const response = await userService.createUser({
        name,
        lastName,
        roleId,
        email,
    });

    res.status(200).json(response);
});

const updateUserUid = handleErrors(async (req, res) => {
    const { email } = req.params;
    const { uid } = req.body;
    const response = await userService.updateUserUid(email, uid);

    res.status(200).json(response);
});

const updateUser = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, roleId } = req.body;

    const response = await userService.updateUser(id, {
        name,
        lastName,
        email,
        roleId,
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
    getUsersNames,
    createUser,
    updateUser,
    updateUserUid,
    deleteUser,
    changeActiveStateUser,
};
