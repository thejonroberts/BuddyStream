'use strict';

const { Router } = require('express');
const router = Router();

const {
	saveAndLoadNewSession,
	launchSession
} = require('../controllers/session-ctrl');

router.post('/session', isLoggedIn, saveAndLoadNewSession);
router.get('/session/:id', isLoggedIn, launchSession);

module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}
