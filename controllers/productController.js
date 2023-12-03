const handleErrors = require('../middlewares/errorHandler');
const { sendSuccess, sendError } = require('../middlewares/responseHandler');
const productService = require('../services/productService');

const getProducts = handleErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const showInactive = req.query.showInactive === 'true' || false;
    const searchTerm = req.query.searchTerm;

    const offset = (page - 1) * limit;

    try {
        const response = await productService.getProducts(
            limit,
            offset,
            showInactive,
            searchTerm,
        );

        const { data, qty } = response;

        if (data) {
            const formattedResponse = data.map((row) => ({
                id: row.product_id,
                epc: row.epc,
                warehouseName: row.warehouse_name,
                warehouseId: row.warehouse_id,
                branchName: row.branch_name,
                branchId: row.branch_id,
                active: row.active,
                sku: row.sku,
                skuId: row.sku_id,
            }));

            sendSuccess(res, 'Productos recuperados correctamente', {
                data: formattedResponse,
                qty,
            });
        } else {
            sendError(res, 'Productos no encontrados');
        }
    } catch (error) {
        sendError(res, 'Error al comunicarse con la API', 500);
    }
});

const getProductByEPC = handleErrors(async (req, res) => {
    const epc = req.params.epc;
    console.log('epc', epc);
    try {
        const response = await productService.getProductByEPC(epc);
        console.log('epc resp: ', response);

        if (response) {
            console.log('res', response);
            const formattedResponse = {
                id: response.product_id,
                epc: response.epc,
                warehouseId: response.fk_warehouse_id,
                skuId: response.fk_sku_id,
                active: response.active,
            };

            console.log('for', formattedResponse);
            sendSuccess(
                res,
                'Producto recuperado correctamente',
                formattedResponse,
            );
        } else {
            sendError(res, 'Producto no encontrado', 404);
        }
    } catch (error) {
        sendError(res, 'Error al comunicarse con la API', 500);
    }
});

const getProductsQty = handleErrors(async (req, res) => {
    const warehouseId = req.query.warehouseId || null;

    const showInactive = req.query.showInactive === 'true' || false;

    console.log('getProductsQty', warehouseId, showInactive);
    let qty;

    try {
        if (warehouseId) {
            qty = await productService.getProductsQtyByWarehouseId(warehouseId);
        } else {
            qty = await productService.getProductsQty(showInactive);
        }

        console.log('product qty', qty);

        /* eslint-disable indent */
        if (qty !== null && qty !== undefined) {
            sendSuccess(
                res,
                'Cantidad de productos recuperadas correctamente',
                qty,
            );
        } else {
            sendError(res, 'Cantidad de Productos no encontrada');
        }
        /* eslint-enable indent */
    } catch (error) {
        sendError(res, 'Error al obtener la cantidad de productos', 500);
    }
});

const searchProducts = handleErrors(async (req, res) => {
    const query = req.query.query || '';
    const limit = parseInt(req.query.limit) || 20; // Limitar el número de resultados

    const response = await productService.searchProducts(query, limit);

    if (response) {
        // Formatear la respuesta
        const formattedResponse = response.map((row) => ({
            id: row.product_id,
            name: row.sku,
        }));

        sendSuccess(res, 'Búsqueda Exitosa', formattedResponse);
    } else {
        sendError(res, 'No se encontraron resultados.', 404);
    }
});

const getProductCountByWarehouse = handleErrors(async (req, res) => {
    const counts = await productService.getProductCountByWarehouse();

    // console.log('product_count: ', counts);

    const formattedResponse = counts.map((count) => {
        return {
            warehouseId: count.warehouse_id,
            warehouseName: count.warehouse_name,
            qty: count.product_count,
        };
    });

    // console.log('product_formatted: ', formattedResponse);

    res.status(200).json(formattedResponse);
});

const getProductById = handleErrors(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (product) {
        const formattedResponse = {
            id: product.product_id,
            epc: product.epc,
            warehouseName: product.warehouse_name,
            warehouseId: product.warehouse_id,
            branchName: product.branch_name,
            branchId: product.branch_id,
            active: product.active,
            sku: product.sku,
            skuId: product.sku_id,
        };

        sendSuccess(res, 'Producto encontrado', formattedResponse);
    } else {
        sendError(res, 'Producto no encontrado.', 404);
    }
});

const getProductBySku = handleErrors(async (req, res) => {
    const { sku } = req.params;
    const product = await productService.getProductBySku(sku);
    res.status(200).json(product);
});

const createProduct = handleErrors(async (req, res) => {
    const { skuId, warehouseId, epc, userId } = req.body;

    try {
        const response = await productService.createProduct(
            {
                skuId,
                warehouseId,
                epc,
            },
            userId,
        );

        console.log('controller', response);

        if (response) {
            // console.log(response);
            sendSuccess(res, 'Producto creado exitosamente', response);
        }
    } catch (error) {
        console.log('productError', error);
        sendError(res, 'No se pudo crear el producto', 500);
    }
});

const updateProduct = handleErrors(async (req, res) => {
    const { id } = req.params;
    const { active, warehouseId, epc, skuId } = req.body;
    console.log(req.params);
    console.log('body: ', req.body);

    const updatedProduct = await productService.updateProduct(id, {
        active,
        warehouseId,
        epc,
        skuId,
    });
    res.status(200).json(updatedProduct);
});

// const deleteProduct = handleErrors(async (req, res) => {
//     const { id } = req.params;
//     await productService.deleteProduct(id);
//     res.status(204).send();
// });

const changeActiveStateProduct = handleErrors(async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const response = await productService.changeActiveStateProduct(
            id,
            active,
        );

        if (response) {
            const formattedResponse = {
                id: response.product_id,
                epc: response.epc,
                warehouseName: response.warehouse_name,
                branchName: response.branch_name,
                active: response.active,
                sku: response.sku,
            };

            sendSuccess(
                res,
                'Estado activo del Producto actualizado exitosamente.',
                formattedResponse,
            );
        } else {
            sendError(res, 'Producto no encontrado.', 404);
        }
        // res.status(204).send();
    } catch (error) {
        console.log(error);
        sendError(res, 'Error al cambiar el estado activo del Producto.', 500);
    }
});

const updateProductWarehouse = handleErrors(async (req, res) => {
    const { epc } = req.params;
    const { warehouseId } = req.body;

    console.log(epc, warehouseId);

    // Llama al servicio para actualizar la bodega del producto
    const response = await productService.updateProductWarehouse(
        epc,
        warehouseId,
    );

    console.log('updateProductWarehouse response: ', response);

    if (response) {
        const formattedResponse = {
            id: response.product_id,
            epc: response.epc,
            warehouseId: response.fk_warehouse_id,
            skuId: response.fk_sku_id,
            active: response.active,
        };

        sendSuccess(
            res,
            'Bodega del Producto actualizada exitosamente.',
            formattedResponse,
        );
    } else {
        sendError(res, 'Error al actualizar la bodega del Producto.', 500);
    }
});

module.exports = {
    changeActiveStateProduct,
    getProducts,
    getProductsQty,
    getProductByEPC,
    searchProducts,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    updateProductWarehouse,
};
