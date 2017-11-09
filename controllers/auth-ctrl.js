'use strict';

const passport = require('passport');

module.exports.showLogin = (req, res, next) => {
	res.render('login');
};

module.exports.login = (req, res, next) => {
	// Note we're using different strategy, this time for logging in
	passport.authenticate('local-signin', (err, user, msgObj) => {
		// If login fails, the error is sent back by the passport strategy as { message: "some msg"}
		console.log('error msg?', msgObj);

		if (err) {
			next(err);
		} //or return next(err) once handler set up in app.js
		if (!user) {
			return res.render('login', msgObj);
		}

		req.logIn(user, err => {
			if (err) {
				return next(err);
			}
			// console.log('authenticated. Rerouting to welcome!', user);
			res.redirect('/home');
		});
	})(req, res, next);
};

module.exports.welcome = (req, res, next) => {
	let activeUserId = req.session.passport.user.id;
	// req.flash('welcomeBackMsg', `Welcome back, `);
	res.redirect(`/home/${activeUserId}`);
};
