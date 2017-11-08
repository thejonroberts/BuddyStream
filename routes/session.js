'use strict';

const { Router } = require('express');
const router = Router();

const {
	saveAndLoadNewSession,
	launchSession
} = require('../controllers/session-ctrl');

router.post('/session', saveAndLoadNewSession);
router.get('/session/:id', launchSession);

module.exports = router;
