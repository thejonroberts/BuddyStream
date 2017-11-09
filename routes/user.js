'use strict';

const { Router } = require('express');
const router = Router();

const { buddySearch, buddyAdd } = require('../controllers/user-ctrl');

router.post('/buddy-search', isLoggedIn, buddySearch);
router.post('/buddy-add/:id', isLoggedIn, buddyAdd);

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
