const branchService = require('../services/branchService');
const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');

const getBranches = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;
    const searchTerm = req.query.searchTerm;

    const offset = (page - 1) * limit;

    const response = await branchService.getBranches(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    const { data, qty } = response;

    // console.log(response);

    if (data) {
        const formattedData = data.map((row) => ({
            active: row.active,
            id: row.branch_id,
            name: row.name,
            regionId: row.region_id,
            address: row.address,
            regionName: row.region_name,
            countryName: row.country_name,
            countryId: row.country_id,
            municipalityName: row.municipality_name,
            municipalityId: row.fk_municipality_id,
        }));

        sendSuccess(res, 'Sucursales recuperadas con éxito', {
            data: formattedData,
            qty,
        });
    } else {
        sendError(res, 'Sucursales no encontradas', 404);
    }
});

const getBranchesQty = handleErrors(async (req, res) => {
    const warehouseId = req.query.warehouseId || null;

    const showInactive = req.query.showInactive === 'true' || false;

    let qty;

    try {
        if (warehouseId) {
            qty = await branchService.getBranchesQtyByWarehouseId(warehouseId);
        } else {
            qty = await branchService.getBranchesQty(showInactive);
        }

        /* eslint-disable indent */
        qty
            ? sendSuccess(
                  res,
                  'Cantidad de sucursales recuperadas correctamente',
                  qty,
              )
            : sendError(res, 'Sucursales qty no encontradas', 404);
        /* eslint-enable indent */
    } catch (error) {
        sendError(res, 'Error al obtener la cantidad de sucursales', 500);
    }

    // console.log(req.query.showInactive);
    // console.log(req.body);
    // const showInactive = req.query.showInactive === 'true' || false;

    // console.log(showInactive);
    // const branchesQty = await branchService.getBranchesQty(showInactive);
    // res.status(200).json(branchesQty);
});

const getBranchesNames = handleErrors(async (req, res) => {
    const response = await branchService.getBranchesNames();

    const formattedResponse = response.rows.map((row) => ({
        id: row.branch_id,
        name: row.name,
    }));
    res.status(200).json(formattedResponse);
});

const getBranchById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const response = await branchService.getBranchById(id);
    // console.log(response.rows[0]);

    if (response) {
        const formattedResponse = {
            address: response.rows[0].address,
            id: response.rows[0].branch_id,
            municipalityId: response.rows[0].fk_municipality_id,
            municipalityName: response.rows[0].municipality_name,
            name: response.rows[0].name,
            regionId: response.rows[0].region_id,
            countryId: response.rows[0].country_id,
        };

        // console.log(formattedResponse);
        sendSuccess(res, 'Sucursal encontrada exitosamente', {
            data: formattedResponse,
        });
    } else {
        sendError(res, 'Sucursal no encontrada', 404);
    }
});

const createBranch = handleErrors(async (req, res) => {
    const { branchName, municipality, address } = req.body;
    const response = await branchService.createBranch(
        branchName,
        municipality,
        address,
    );

    if (response) {
        sendSuccess(res, 'Sucursal creada con éxito.', response);
    } else {
        sendError(res, 'Error al crear Sucursal', 404);
    }
});

const updateBranch = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { branchName, address, municipality } = req.body;

    // console.log('branchController', req.body, req.params);

    // console.log('branchController', branchName, address, municipality);
    const response = await branchService.updateBranch(id, {
        branchName,
        address,
        municipality,
    });
    // console.log('branchController response: ', response);

    if (response) {
        const formattedResponse = {
            id: response.branch_id,
            name: response.name,
            municipalityId: response.fk_municipality_id,
            municipalityName: response.municipality_name,
            regionName: response.region_name,
            countryName: response.country_name,
            address: response.address,
        };

        sendSuccess(
            res,
            'Sucursal actualizada exitosamente',
            formattedResponse,
        );
    } else {
        sendError(res, 'No se pudo actualizar la sucursal', 404);
    }
});

const changeActiveStateBranch = handleErrors(async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const response = await branchService.changeActiveStateBranch(
            id,
            active,
        );

        if (response) {
            const formattedResponse = {
                id: response.branch_id,
                name: response.name,
                regionId: response.fk_region_id,
                address: response.address,
                active: response.active,
            };

            sendSuccess(
                res,
                'Estado activo de la Sucursal actualizado exitosamente',
                formattedResponse,
            );
        } else {
            sendError(res, 'Sucursal no encontrada', 404);
        }
    } catch (error) {
        console.log(error);
        sendError(
            res,
            'Error al actualizar el estado activo de la Sucursal',
            500,
        );
    }
});

module.exports = {
    getBranches,
    getBranchesQty,
    getBranchesNames,
    getBranchById,
    createBranch,
    updateBranch,
    changeActiveStateBranch,
};
