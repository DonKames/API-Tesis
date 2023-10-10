const usersRepository = require('../repositories/userRepository');

const getUsers = async (limit, offset, showInactive) => {
    const response = await usersRepository.getUsers(
        limit,
        offset,
        showInactive,
    );
    return response.rows;
};

const getUsersQty = async () => {
    const response = await usersRepository.getUsersQty();
    return parseInt(response.rows[0].count);
};

const getUserById = async (id) => {
    const response = await usersRepository.getUserById(id);
    return response.rows[0];
};

const getUserByUid = async (uid) => {
    const response = await usersRepository.getUserByUid(uid);
    return response.rows[0];
};

const getUserByEmail = async (email) => {
    const response = await usersRepository.getUserByEmail(email);
    return response.rows[0];
};

const createUser = async ({ name, lastName, roleId, email }) => {
    const response = await usersRepository.createUser({
        name,
        lastName,
        roleId,
        email,
    });
    return response.rows[0];
};

const updateUserUid = async (email, uid) => {
    const response = await usersRepository.updateUserUid(email, uid);
    return response.rows[0];
};

const updateUser = async (id, { name, lastName, email, roleId }) => {
    const response = await usersRepository.updateUser(id, {
        name,
        lastName,
        email,
        roleId,
    });
    return response.rows[0];
};

const changeActiveStateUser = async (id, isActive) => {
    const response = await usersRepository.changeActiveStateUser(id, isActive);
    return response.rows[0];
};

module.exports = {
    getUsers,
    getUsersQty,
    getUserById,
    getUserByUid,
    getUserByEmail,
    createUser,
    updateUser,
    updateUserUid,
    changeActiveStateUser,
};
