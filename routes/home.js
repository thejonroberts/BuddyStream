'use strict';

const { Router } = require('express');
const router = Router();

const { showLaunchSelection } = require('../controllers/home-ctrl');

router.get('/home/:id', showLaunchSelection);

module.exports = router;
