'use strict';
module.exports = (sequelize, DataTypes) => {
	var UserBuddies = sequelize.define('UserBuddies', {
		statusCode: DataTypes.INTEGER
	});

	UserBuddies.associate = function(models) {
		UserBuddies.belongsTo(models.User, {
			foreignKey: 'id',
			otherKey: 'UserTwoId'
		});
		UserBuddies.belongsTo(models.User, {
			foreignKey: 'id',
			otherKey: 'UserOneId'
		});
	};

	return UserBuddies;
};
