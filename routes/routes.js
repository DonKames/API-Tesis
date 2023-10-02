const express = require('express');
const router = express.Router();

const branchController = require('../controllers/branchController');
const branchLocationsController = require('../controllers/branchLocationsController');
const countriesController = require('../controllers/countriesController');
const municipalityController = require('../controllers/municipalityController');
const productsController = require('../controllers/productController');
const regionsController = require('../controllers/regionsController');
const skusController = require('../controllers/skuController');
const usersController = require('../controllers/usersController');
const rolesController = require('../controllers/rolesController');
const warehousesController = require('../controllers/warehouseController');

// DEV
// const addingCountries = require('../utilities/countryAdder');
const settingsController = require('../controllers/globalSettingController');

// Branches
router.get('/branches', branchController.getBranches);
router.get('/branches/qty', branchController.getBranchesQty);
router.get('/branches/names', branchController.getBranchesNames);
router.get('/branches/:id', branchController.getBranchById);
router.post('/branches', branchController.createBranch);
router.put('/branches/:id', branchController.updateBranch);
router.patch('/branches/:id', branchController.changeActiveStateBranch);

// Branch Locations
router.get('/branchLocations', branchLocationsController.getBranchLocations);
router.get(
    '/branchLocations/qty',
    branchLocationsController.getBranchLocationsQty,
);
router.get(
    '/branchLocations/:id',
    branchLocationsController.getBranchLocationById,
);
router.post('/branchLocations', branchLocationsController.createBranchLocation);
router.put(
    '/branchLocations/:id',
    branchLocationsController.updateBranchLocation,
);

// Countries
router.get('/countries', countriesController.getCountries);
router.get('/countries/:id', countriesController.getCountryById);
router.post('/countries', countriesController.createCountry);
router.put('/countries/:id', countriesController.updateCountry);
router.delete('/countries/:id', countriesController.deleteCountry);

// Municipalities
router.get('/municipalities', municipalityController.getMunicipalities);

// Products
router.get('/products', productsController.getProducts);
router.get('/products/qty', productsController.getProductsQty);
router.get(
    '/products/countByWarehouse',
    productsController.getProductCountByWarehouse,
);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
// router.delete('/products/:id', productsController.deleteProduct);
router.patch('/products/:id', productsController.changeActiveStateProduct);

// Regions
router.get('/regions', regionsController.getRegions);
// router.get('/regions/:id', regionsController.getRegionById);
// router.post('/regions', regionsController.createRegion);
// router.put('/regions/:id', regionsController.updateRegion);
// router.delete('/regions/:id', regionsController.deleteRegion);

// Roles
router.get('/roles', rolesController.getRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.post('/roles', rolesController.createRole);
router.put('/roles/:id', rolesController.updateRole);
router.delete('/roles/:id', rolesController.deleteRole);

// Skus
router.get('/skus/qty', skusController.getSkusQty);
router.get('/skus', skusController.getSkus);
router.get('/skus/names', skusController.getSkusNames);
router.get('/skus/:id', skusController.getSkuById);
router.get('/skus/sku/:sku', skusController.getSkuBySku);
router.post('/skus', skusController.createSku);
router.put('/skus/:id', skusController.updateSku);
router.patch('/skus/:id', skusController.changeActiveStateSku);

// Settings
router.get('/global_settings', settingsController.getGlobalSettings);
router.post('/global_settings', settingsController.createGlobalSettings);
router.put('/global_settings', settingsController.updateGlobalSettings);

// Users
router.get('/users', usersController.getUsers);
router.get('/users/qty', usersController.getUsersQty);
router.get('/users/id/:id', usersController.getUserById);
router.get('/users/uid/:uid', usersController.getUserByUid);
router.get('/users/email/:email', usersController.getUserByEmail);
router.post('/users', usersController.createUser);
router.put('/users/id/:id', usersController.updateUser);
router.put('/users/email/:email', usersController.updateUserUid);
router.delete('/users/:id', usersController.deleteUser);

// Warehouses
router.get('/warehouses', warehousesController.getWarehouses);
router.get('/warehouses/qty', warehousesController.getWarehousesQty);
router.get('/warehouses/names', warehousesController.getWarehousesNames);
router.get('/warehouses/:id', warehousesController.getWarehouseById);
router.post('/warehouses', warehousesController.createWarehouse);
router.put('/warehouses/:id', warehousesController.updateWarehouse);
router.patch(
    '/warehouses/:id',
    warehousesController.changeActiveStateWarehouse,
);

// DEV Functions
// router.get('/adding', addingCountries.insertRegions);

module.exports = router;
