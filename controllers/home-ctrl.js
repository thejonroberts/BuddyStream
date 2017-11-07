'use strict';

module.exports.showBuddySelection = (req, res, next) => {
	const { User } = req.app.get('models');
	User.findById(req.params.id, {
		include: [{ model: 'UserBuddies' }]
	})
		.then(buddies => {
			res.json(buddies);
		})
		.catch(err => {
			next(err);
		});
};
