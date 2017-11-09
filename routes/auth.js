'use strict';

const { Router } = require('express');
const router = Router();

const {
	showLogin,
	login,
	welcome,
	register,
	logout
} = require('../controllers/auth-ctrl');

router.get('/', showLogin);
router.post('/login', login);

router.post('/register', register);
router.post('/logout', logout);

router.get('/home', isLoggedIn, welcome);

// 'isAuthenticated' is added to the request obj. If there is a user, then all is well and we call `next()`.
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = router;
