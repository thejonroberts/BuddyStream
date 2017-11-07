'use strict';

module.exports.showLaunchSelection = (req, res, next) => {
	const { User, Stream, sequelize } = req.app.get('models');
	// get user with list of lil and big buddies (ids lower or higher, respectively)
	return User.findById(req.params.id, {
		include: { all: true }
	})
		.then(user => {
			return Stream.findAll({}).then(streams => {
				// raw query to get UserBuddies with either matching user.
				return sequelize
					.query(
						`SELECT * FROM "UserBuddies"
						WHERE "UserBuddies"."UserOneId" = ${req.params.id}
						OR "UserBuddies"."UserTwoId" = ${req.params.id}`,
						{
							type: sequelize.QueryTypes.SELECT
						}
					)
					.then(buddies => {
						buddies.forEach(buddy => {
							if (buddy.UserTwoId != req.params.id) {
								user.BigBuddies.forEach(BigBuddy => {
									if (BigBuddy.id === buddy.UserTwoId) {
										buddy.first = BigBuddy.first;
										buddy.last = BigBuddy.last;
										buddy.username = BigBuddy.username;
										buddy.email = BigBuddy.email;
										buddy.buddyId = BigBuddy.id;
									}
								});
							} else if (buddy.UserOneId != req.params.id) {
								user.LilBuddies.forEach(LilBuddy => {
									if (LilBuddy.id === buddy.UserOneId) {
										buddy.first = LilBuddy.first;
										buddy.last = LilBuddy.last;
										buddy.username = LilBuddy.username;
										buddy.email = LilBuddy.email;
										buddy.buddyId = LilBuddy.id;
									}
								});
							}
						});
						// res.json({ user, streams, buddies });
						res.render('launch', { user, streams, buddies });
					});
			});
		})
		.catch(err => {
			next(err);
		});
};
