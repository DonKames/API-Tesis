const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const countriesController = require('../controllers/countriesController');
const regionsController = require('../controllers/regionsController');
const branchesController = require('../controllers/branchesController');

// DEV
const addingCountries = require('../utilities/countryAdder');

// Products
router.get('/products', productsController.getProducts);
router.get('/products/:id', productsController.getProductById);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

// Countries
router.get('/countries', countriesController.getCountries);
router.get('/countries/:id', countriesController.getCountryById);
router.post('/countries', countriesController.createCountry);
router.put('/countries/:id', countriesController.updateCountry);
router.delete('/countries/:id', countriesController.deleteCountry);

// Regions
router.get('/regions', regionsController.getRegions);
router.get('/regions/:id', regionsController.getRegionById);
router.post('/regions', regionsController.createRegion);
router.put('/regions/:id', regionsController.updateRegion);
router.delete('/regions/:id', regionsController.deleteRegion);

// Branches
router.get('/branches', branchesController.getBranches);
router.get('/branches/:id', branchesController.getBranchById);
router.post('/branches', branchesController.createBranch);
router.put('/branches/:id', branchesController.updateBranch);
router.delete('/branches/:id', branchesController.deleteBranch);

// DEV Functions
router.get('/adding', addingCountries.insertRegions);

module.exports = router;
