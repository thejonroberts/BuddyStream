'use strict';

module.exports.buddySearch = (req, res, next) => {
	const { User } = req.app.get('models');
	User.findAll({
		where: {
			$or: {
				first: {
					$iLike: `%${req.body.first}%`
				},
				last: {
					$iLike: `%${req.body.last}%`
				}
			}
		}
	})
		.then(users => {
			let currentUser = req.session.passport.user.id;
			res.render('buddy-search-results', { users, currentUser });
		})
		.catch(err => next(err));
};

('use strict');

module.exports.buddyAdd = (req, res, next) => {
	const { User } = req.app.get('models');
	let UserOneId = null;
	let UserTwoId = null;
	let statusCode = null; // TODO - make sure this updates
	//make sure userOne is the lowest ID
	if (req.params.id > req.session.passport.user.id) {
		UserOneId = req.params.id;
		UserTwoId = req.session.passport.user.id;
		statusCode = 0;
		User.find({
			where: { id: UserOneId }
		})
			.then(userOne => {
				User.find({
					where: { id: UserTwoId }
				}).then(userTwo => {
					userOne.addBigBuddies(userTwo).then(results => {
						res.json(results);
					});
				});
				res.redirect(`/home`);
			})
			.catch(err => {
				next(err);
			});
	} else {
		UserTwoId = req.params.id;
		UserOneId = req.session.passport.user.id;
		statusCode = 1;
		User.find({
			where: { id: UserOneId }
		})
			.then(userOne => {
				User.find({
					where: { id: UserTwoId }
				}).then(userTwo => {
					userOne.addLilBuddies(userTwo).then(results => {
						res.json(results);
					});
				});
				res.redirect(`/home`);
			})
			.catch(err => {
				next(err);
			});
	}
};
