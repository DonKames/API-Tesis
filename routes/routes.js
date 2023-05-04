const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const countriesController = require('../controllers/countriesController');

router.get('/products', productsController.getProducts);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

router.get('/countries', countriesController.getCountries);
router.get('/countries/:id', countriesController.getCountryById);
router.post('/countries', countriesController.createCountry);
router.put('/countries/:id', countriesController.updateCountry);
router.delete('/countries/:id', countriesController.deleteCountry);

module.exports = router;
