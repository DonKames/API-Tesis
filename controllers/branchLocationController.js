const branchLocationService = require('../services/branchLocationService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getBranchLocations = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;

    const offset = (page - 1) * limit;

    const response = await branchLocationService.getBranchLocations(
        limit,
        offset,
        showInactive,
    );

    const formattedResponse = response.map((row) => ({
        id: row.branch_location_id,
        name: row.name,
        description: row.description,
        branchId: row.fk_branch_id,
        active: row.active,
        branchName: row.branch_name,
    }));

    sendSuccess(
        res,
        'Branch locations retrieved successfully',
        formattedResponse,
    );
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
    // const branchLocationsQty =
    //     await branchLocationService.getBranchLocationsQty();
    // if (!branchLocationsQty) {
    //     sendError(res, 'Branch locations quantity not found', 404);
    // } else {
    //     sendSuccess(
    //         res,
    //         'Branch locations quantity retrieved successfully',
    //         branchLocationsQty,
    //     );
    // }
});

const getBranchLocationById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await branchLocationService.getBranchLocationById(id);
    res.status(200).json(response);
});

const createBranchLocation = handleErrors(async (req, res) => {
    const { branchLocationName, description, branchId } = req.body;
    const response = await branchLocationService.createBranchLocation({
        branchLocationName,
        description,
        branchId,
    });
    res.status(201).json(response);
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
        sendSuccess(res, 'Branch location updated successfully', response);
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
