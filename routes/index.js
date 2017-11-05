'use strict';

const { Router } = require('express');
const router = Router();

// latest products shown at root
// const { getLatestProducts } = require('../controllers/productCtrl');

// router.get('/', getLatestProducts);

// pipe all other requests through the route modules
// router.use(require('./authRoute'));
// router.use(require('./product-add'));

module.exports = router;
