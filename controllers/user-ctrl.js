'use strict';

module.exports.buddySearch = (req, res, next) => {
	console.log('req.body', req.body);
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
			// res.json(users);
			res.render('buddy-search-results', { users });
		})
		.catch(err => next(err));
};

('use strict');

module.exports.buddyAdd = (req, res, next) => {
	const { User, UserBuddies, sequelize } = req.app.get('models');
	let UserOneId = null;
	let UserTwoId = null;
	let statusCode = null;
	if (req.params.id > req.session.passport.user.id) {
		UserOneId = req.params.id;
		UserTwoId = req.session.passport.user.id;
		statusCode = 0;
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
				// res.json(buddies);
				// res.redirect(`/home/${req.session.passport.user.id}`);
			})
			.catch(err => {
				next(err);
			});
	}
};
