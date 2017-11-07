'use strict';

const { Router } = require('express');
const router = Router();

const { showBuddySelection } = require('../controllers/home-ctrl');

router.get('/home/:id', showBuddySelection);

module.exports = router;
