const express = require('express');
const router = express.Router();

const branchesController = require('../controllers/branchesController');
const branchLocationsController = require('../controllers/branchLocationsController');
const countriesController = require('../controllers/countriesController');
const productsController = require('../controllers/productsController');
const regionsController = require('../controllers/regionsController');
const skusController = require('../controllers/skusController');
const usersController = require('../controllers/usersController');
const rolesController = require('../controllers/rolesController');
const warehousesController = require('../controllers/warehousesController');

// DEV
const addingCountries = require('../utilities/countryAdder');

// Branches
router.get('/branches', branchesController.getBranches);
router.get('/branches/qty', branchesController.getBranchesQty);
router.get('/branches/:id', branchesController.getBranchById);
router.post('/branches', branchesController.createBranch);
router.put('/branches/:id', branchesController.updateBranch);
router.delete('/branches/:id', branchesController.deleteBranch);

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
router.delete(
    '/branchLocations/:id',
    branchLocationsController.deleteBranchLocation,
);

// Countries
router.get('/countries', countriesController.getCountries);
router.get('/countries/:id', countriesController.getCountryById);
router.post('/countries', countriesController.createCountry);
router.put('/countries/:id', countriesController.updateCountry);
router.delete('/countries/:id', countriesController.deleteCountry);

// Products
// router.get('/products', productsController.getProducts);
router.get('/products/qty', productsController.getProductsQty);
router.get('/products', productsController.getProducts);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

// Regions
router.get('/regions', regionsController.getRegions);
router.get('/regions/:id', regionsController.getRegionById);
router.post('/regions', regionsController.createRegion);
router.put('/regions/:id', regionsController.updateRegion);
router.delete('/regions/:id', regionsController.deleteRegion);

// Roles
router.get('/roles', rolesController.getRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.post('/roles', rolesController.createRole);
router.put('/roles/:id', rolesController.updateRole);
router.delete('/roles/:id', rolesController.deleteRole);

// Skus
router.get('/skus/qty', skusController.getSkusQty);
router.get('/skus', skusController.getSkus);
router.get('/skus/:id', skusController.getSkuById);
router.get('/skus/sku/:sku', skusController.getSkuBySku);
router.post('/skus', skusController.createSku);
router.put('/skus/:id', skusController.updateSku);
router.delete('/skus/:id', skusController.deleteSku);

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
router.get('/warehouses/:id', warehousesController.getWarehouseById);
router.post('/warehouses', warehousesController.createWarehouse);
router.put('/warehouses/:id', warehousesController.updateWarehouse);
router.delete('/warehouses/:id', warehousesController.deleteWarehouse);

// DEV Functions
router.get('/adding', addingCountries.insertRegions);

module.exports = router;
