'use strict';
module.exports = (sequelize, DataTypes) => {
	var Session = sequelize.define('Session', {
		percentViewed: DataTypes.INTEGER,
		UserBuddyId: DataTypes.INTEGER,
		MovieId: DataTypes.INTEGER
	});

	Session.associate = function(models) {
		Session.hasOne(models.UserBuddy, {
			foreignKey: 'id'
		});
		Session.hasOne(models.Movie, {
			foreignKey: 'id'
		});
	};

	return Session;
};
