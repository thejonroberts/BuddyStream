'use strict';

const { Router } = require('express');
const router = Router();

// pipe all requests through the route modules
router.use(require('./auth'));
router.use(require('./home'));
router.use(require('./session'));

module.exports = router;
