const productRepository = require('../repositories/productRepository');
const movementRepository = require('../repositories/movementRepository');
const db = require('../config/db');

const getProducts = async (limit, offset, showInactive, searchTerm) => {
    const response = await productRepository.getProducts(
        limit,
        offset,
        showInactive,
        searchTerm,
    );

    return response;
};

const getProductsQty = async (showInactive) => {
    const response = await productRepository.getProductsQty(showInactive);
    return parseInt(await response.rows[0].count);
};

const getProductsQtyByWarehouseId = async (warehouseId) => {
    const response =
        await productRepository.getProductsQtyByWarehouseId(warehouseId);
    return parseInt(response.rows[0].count);
};

const searchProducts = async (query, limit) => {
    return await productRepository.searchProducts(query, limit);
};
const getProductCountByWarehouse = async () => {
    return await productRepository.getProductCountByWarehouse();
};

const getProductById = async (id) => {
    return await productRepository.getProductById(id);
};

const getProductBySku = async (sku) => {
    return await productRepository.getProductBySku(sku);
};

const getProductByEPC = async (epc) => {
    return await productRepository.getProductByEPC(epc);
};

const createProduct = async ({ skuId, warehouseId, epc }, userId) => {
    // console.log('service creando producto');

    return db.transaction(async (client) => {
        console.log('creando producto');
        // Creando el producto
        const product = await productRepository.createProduct(
            client,
            {
                skuId,
                warehouseId,
                epc,
            },
            userId,
        );

        const initialMovement = {
            movement_type: 1,
            warehouse: warehouseId,
        };

        if (userId !== undefined) {
            initialMovement.user = userId;
        }

        if (product && product.product_id !== undefined) {
            initialMovement.product = product.product_id;
        }

        // const initialMovement = {
        //     user: userId,
        //     product: product.product_id,
        //     movement_type: 1,
        // };

        await movementRepository.createMovement(client, initialMovement);

        return product;
    });

    //     return await productRepository.createProduct({
    //         skuId,
    //         warehouseId,
    //         epc,
    //         userId,
    //     });
};

const updateProduct = async (
    id,
    { active, warehouseId, epc, skuId },
    userId,
) => {
    return db.transaction(async (client) => {
        const product = await getProductById(id);

        const updatedProduct = await productRepository.updateProduct(
            client,
            id,
            {
                active,
                warehouseId,
                epc,
                skuId,
            },
        );

        console.log('productService updateProduct: ', product, warehouseId);
        if (product.fk_warehouse_id !== warehouseId) {
            const movement = {
                movement_type: 3,
                warehouse: warehouseId,
            };

            if (product.product_id !== undefined) {
                movement.product = product.product_id;
            }

            movement.user = userId;

            await movementRepository.createMovement(client, movement);
        }

        return updatedProduct;
    });

    // console.log('updateProduct: ', product);

    // if (product.fk_warehouse_id !== warehouseId) {
    // }

    // return await productRepository.updateProduct(id, {
    //     active,
    //     warehouseId,
    //     epc,
    //     skuId,
    // });
};

// const deleteProduct = async (id) => {
//     return await productRepository.deleteProduct(id);
// };

const changeActiveStateProduct = async (id, isActive) => {
    const response = await productRepository.changeActiveStateProduct(
        id,
        isActive,
    );
    return response.rows[0];
};

const updateProductWarehouse = async (epc, warehouseId, antenna) => {
    console.log('iniciando la creación de movimientos al actualizar');

    return db.transaction(async (client) => {
        const updatedData = await productRepository.updateProductWarehouse(
            client,
            {
                epc,
                warehouseId,
            },
        );

        console.log('updatedData: ', updatedData);

        const movement = {
            movement_type: 2,
            warehouse: warehouseId,
        };

        if (antenna !== undefined) {
            movement.antenna = antenna;
        }

        if (updatedData && updatedData.product_id !== undefined) {
            movement.product = updatedData.product_id;
        }

        await movementRepository.createMovement(client, movement);

        return updatedData;
    });

    // return response.rows[0];
};

module.exports = {
    getProducts,
    getProductsQty,
    getProductsQtyByWarehouseId,
    searchProducts,
    getProductCountByWarehouse,
    getProductById,
    getProductBySku,
    getProductByEPC,
    createProduct,
    updateProduct,
    // deleteProduct,
    changeActiveStateProduct,
    updateProductWarehouse,
};
