'use strict';

const passport = require('passport');

module.exports.showLogin = (req, res, next) => {
	res.render('login');
};

module.exports.login = (req, res, next) => {
	// Note we're using different strategy, this time for logging in
	passport.authenticate('local-signin', (err, user, msgObj) => {
		// If login fails, the error is sent back by the passport strategy as { message: "some msg"}
		if (err) {
			next(err);
		} // TODO return next(err) once handler set up in server.js
		if (!user) {
			return res.render('login', msgObj);
		}
		req.logIn(user, err => {
			if (err) {
				return next(err);
			}
			res.redirect('/home');
		});
	})(req, res, next);
};

/**
 * Controller to handle new user registration
 */
module.exports.register = (req, res, next) => {
	console.log('registering?', req.body);
	if (req.body.password === req.body.confirmation) {
		// first argument is name of the passport strategy we created in passport-strat.js
		passport.authenticate('local-signup', (err, user, msgObj) => {
			if (err) {
				next(err);
			} //or return next(err)
			if (!user) {
				return res.render('login', msgObj);
			}
			// Go ahead and login the new user once they are signed up
			req.logIn(user, err => {
				if (err) {
					return next(err);
				}
				// console.log('authenticated. Rerouting to welcome page!');
				// Save a msg in a cookie whose value will be added to req
				// using https://www.npmjs.com/package/express-flash-2 docs, but installed express-flash
				// req.flash('registerMsg', `Thanks for signing up, ${user.firstName}!`);
				res.redirect('/home');
			});
		})(req, res, next);
	} else {
		res.render('login', {
			message: 'Password & password confirmation do not match'
		});
	}
};

module.exports.welcome = (req, res, next) => {
	let activeUserId = req.session.passport.user.id;
	// req.flash('welcomeBackMsg', `Welcome back, `);
	res.redirect(`/home/${activeUserId}`);
};

/**
 * Controller method to handle the logout click, destroy the session, and redirect users to the home page
 */
module.exports.logout = (req, res, next) => {
	req.session.destroy(function(err) {
		if (err) {
			next(err);
		}
		res.redirect('/');
	});
};
