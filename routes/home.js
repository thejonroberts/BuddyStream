'use strict';

const { Router } = require('express');
const router = Router();

const { showLaunchSelection } = require('../controllers/home-ctrl');

router.get('/home/:id', isLoggedIn, showLaunchSelection);

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
