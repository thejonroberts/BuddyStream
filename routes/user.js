'use strict';

const { Router } = require('express');
const router = Router();

const { buddySearch } = require('../controllers/user-ctrl');

router.post('/buddy-search', isLoggedIn, buddySearch);

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
