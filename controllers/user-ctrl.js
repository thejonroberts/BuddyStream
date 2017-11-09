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
			res.json(users);
			// res.render('buddy-search-results'  , { users });
		})
		.catch(err => next(err));
};
