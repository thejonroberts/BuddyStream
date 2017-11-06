'use strict';
module.exports = (sequelize, DataTypes) => {
	var Session = sequelize.define('Session', {
		percentViewed: DataTypes.INTEGER,
		BuddyId: DataTypes.INTEGER,
		StreamId: DataTypes.INTEGER
	});

	Session.associate = function(models) {
		Session.belongsTo(models.User, {
			through: 'Buddies',
			foreignKey: 'UserOneId'
		});
		Session.hasOne(models.Stream, {
			foreignKey: 'id'
		});
	};

	return Session;
};
