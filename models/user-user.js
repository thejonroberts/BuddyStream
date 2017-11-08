'use strict';
module.exports = (sequelize, DataTypes) => {
	var UserBuddy = sequelize.define('UserBuddy', {
		statusCode: DataTypes.INTEGER
	});

	UserBuddy.associate = function(models) {
		UserBuddy.belongsTo(models.User, {
			foreignKey: 'id',
			otherKey: 'UserTwoId'
		});
		UserBuddy.belongsTo(models.User, {
			foreignKey: 'id',
			otherKey: 'UserOneId'
		});
		UserBuddy.hasMany(models.Session, {
			foreignKey: 'UserBuddyId'
		});
	};

	return UserBuddy;
};
