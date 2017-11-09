'use strict';

const { Router } = require('express');
const router = Router();

const { showLogin, login, welcome } = require('../controllers/auth-ctrl');

router.get('/', showLogin);
router.post('/login', login);

router.get('/home', isLoggedIn, welcome);

// We add this to the welcome route as an additional step to take before calling
// the controller's 'welcome' method. 'isAuthenticated' is added to the request obj
// If there is a user, then all is well and we call `next()`.
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = router;
