'use strict';
//req.body = {MovieId: [ID], BuddyId: [ID]} were BuddyId is the row of join, not a user id.
module.exports.saveAndLoadNewSession = (req, res, next) => {
	const { Session } = req.app.get('models');
	req.body.percentViewed = 0;
	let session = new Session(req.body);
	session
		.save(() => {})
		.then(response => {
			// res.json(response);
			res.redirect(`/session/${response.id}`);
		})
		.catch(err => {
			next(err);
		});
};

module.exports.launchSession = (req, res, next) => {
	const { Session, Source, Movie, UserBuddy } = req.app.get('models');
	Session.findById(req.params.id, {
		// include: [{ all: true }] // TODO - does not return properly associated UserBuddy, Movie ids, both are current session id.
	})
		.then(session => {
			// find Movie - session.MovieId
			Movie.findById(session.MovieId, {}).then(movie => {
				res.json({ session, movie });
				res.render('session', { session, movie });
			});
		})
		.catch(err => {
			next(err);
		});
};
