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
	// let createdAt = new Date();
	// console.log('created at', createdAt);
	// let updatedAt = new Date();
	// console.log('updatedAt', updatedAt);
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
	}
	// UserBuddies.
	// return sequelize
	// 	.query(
	// 		`INSERT INTO "UserBuddies"
	//     ("UserOneId", "UserTwoId", "statusCode")
	//     VALUES (${UserOneId}, ${UserTwoId}, ${statusCode})`,
	// 		{
	// 			type: sequelize.QueryTypes.SELECT
	// 		}
	// 	)
	// 	.then(buddies => {
	// 		// res.json(buddies);
	res.redirect(`/home/${req.session.passport.user.id}`);
	// 	})
	// 	.catch(err => {
	// 		next(err);
	// });
};
