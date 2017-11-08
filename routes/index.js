'use strict';

const { Router } = require('express');
const router = Router();

// latest products shown at root
// const { getLatestProducts } = require('../controllers/');
// router.get('/home', getLatestProducts);

// pipe all other requests through the route modules
// router.use(require('./authRoute'));
router.use(require('./home'));
router.use(require('./session'));

module.exports = router;
