const branchLocationService = require('../services/branchLocationService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getBranchLocations = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;
    const searchTerm = req.query.searchTerm;

    const offset = (page - 1) * limit;

    const response = await branchLocationService.getBranchLocations(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    const { data, qty } = response;

    const formattedResponse = data.map((row) => ({
        id: row.branch_location_id,
        name: row.name,
        description: row.description,
        branchId: row.fk_branch_id,
        active: row.active,
        branchName: row.branch_name,
    }));

    sendSuccess(res, 'Branch locations retrieved successfully', {
        data: formattedResponse,
        qty,
    });
});

const getBranchLocationsQty = handleErrors(async (req, res) => {
    const branchId = req.query.branchLocationId || null;

    const showInactive = req.query.showInactive === 'true' || false;

    let qty;

    try {
        if (branchId) {
            qty =
                await branchLocationService.getBranchLocationsQtyByWarehouseId(
                    branchId,
                );
        } else {
            qty =
                await branchLocationService.getBranchLocationsQty(showInactive);
        }

        /* eslint-disable indent */

        qty
            ? sendSuccess(
                  res,
                  'Cantidad de Sucursales recuperadas correctamente',
                  qty,
              )
            : sendError(res, 'No se pudo recuperar la cantidad', 404);

        /* eslint-enable indent */
    } catch (error) {
        sendError(res, 'Error al obtener la cantidad', 500);
    }
});

const getBranchLocationById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await branchLocationService.getBranchLocationById(id);

    if (response) {
        const formattedResponse = {
            id: response.branch_location_id,
            name: response.name,
            description: response.description,
            branchId: response.fk_branch_id,
            active: response.active,
            branchName: response.branch_name,
        };
        sendSuccess(
            res,
            'Branch location retrieved successfully',
            formattedResponse,
        );
    } else {
        sendError(res, 'Branch location not found', 404);
    }
});

const createBranchLocation = handleErrors(async (req, res) => {
    const { name, description, branchId } = req.body;
    const response = await branchLocationService.createBranchLocation({
        name,
        description,
        branchId,
    });

    if (response) {
        sendSuccess(res, 'Lugar de Sucursal creado con éxito', response);
    } else {
        sendError(res, 'Error al crear Lugar de Sucursal', 404);
    }
});

const updateBranchLocation = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { name, description, branchId } = req.body;

    const response = await branchLocationService.updateBranchLocation(id, {
        name,
        description,
        branchId,
    });

    if (response) {
        console.log(response);

        const formattedResponse = {
            id: response.branch_location_id,
            name: response.name,
            description: response.description,
            branchId: response.fk_branch_id,
            active: response.active,
            branchName: response.branch_name,
        };

        sendSuccess(res, 'Lugar actualizado correctamente', formattedResponse);
    } else {
        sendError(res, 'Branch location not found', 404);
    }
});

const changeActiveStateBranchLocation = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { state } = req.body;

    const response =
        await branchLocationService.changeActiveStateBranchLocation(id, state);

    if (response) {
        sendSuccess(res, 'Branch location updated successfully', response);
    } else {
        sendError(res, 'Branch location not found', 404);
    }
});

module.exports = {
    getBranchLocations,
    getBranchLocationsQty,
    getBranchLocationById,
    createBranchLocation,
    updateBranchLocation,
    changeActiveStateBranchLocation,
};
