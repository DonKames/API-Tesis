const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const {
    getCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
} = require('../controllers/countriesController');

router.get('/products', productsController.getProducts);
router.post('/products', productsController.createProduct);
router.put('/products/:id', productsController.updateProduct);
router.delete('/products/:id', productsController.deleteProduct);

router.get('/countries', getCountries);
router.get('/countries/:id', getCountryById);
router.post('/countries', createCountry);
router.put('/countries/:id', updateCountry);
router.delete('/countries/:id', deleteCountry);

module.exports = router;
