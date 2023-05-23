const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const countriesController = require('../controllers/countriesController');
const regionsController = require('../controllers/regionsController');
const branchesController = require('../controllers/branchesController');
const warehousesController = require('../controllers/warehousesController');

// DEV
const addingCountries = require('../utilities/countryAdder');

// Branches
router.get('/branches', branchesController.getBranches);
router.get('/branches/:id', branchesController.getBranchById);
router.post('/branches', branchesController.createBranch);
router.put('/branches/:id', branchesController.updateBranch);
router.delete('/branches/:id', branchesController.deleteBranch);

// Countries
router.get('/countries', countriesController.getCountries);
router.get('/countries/:id', countriesController.getCountryById);
router.post('/countries', countriesController.createCountry);
router.put('/countries/:id', countriesController.updateCountry);
router.delete('/countries/:id', countriesController.deleteCountry);

// Products
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

// Warehouses
router.get('/warehouses', warehousesController.getWarehouses);
router.get('/warehouses/:id', warehousesController.getWarehouseById);
router.post('/warehouses', warehousesController.createWarehouse);
router.put('/warehouses/:id', warehousesController.updateWarehouse);
router.delete('/warehouses/:id', warehousesController.deleteWarehouse);

// DEV Functions
router.get('/adding', addingCountries.insertRegions);

module.exports = router;
