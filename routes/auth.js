'use strict';

const { Router } = require('express');
const router = Router();

const { showLogin } = require('../controllers/auth-ctrl');

router.get('/', showLogin);

module.exports = router;
