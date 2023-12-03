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
    console.log('service creando producto');
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

const updateProduct = async (id, { active, warehouseId, epc, skuId }) => {
    return await productRepository.updateProduct(id, {
        active,
        warehouseId,
        epc,
        skuId,
    });
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

const updateProductWarehouse = async (epc, warehouseId) => {
    const response = await productRepository.updateProductWarehouse(
        epc,
        warehouseId,
    );

    return response.rows[0];
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
