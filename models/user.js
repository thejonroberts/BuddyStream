'use strict';
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('User', {
		first: DataTypes.STRING,
		last: DataTypes.STRING,
		email: DataTypes.STRING,
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		pictureUrl: DataTypes.STRING,
		lastLoginDate: DataTypes.DATEONLY,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		country: DataTypes.STRING
	});

	User.associate = function(models) {
		User.belongsToMany(models.User, {
			through: 'Buddies',
			as: 'UserOneId'
		});
		User.belongsToMany(models.User, {
			through: 'Buddies',
			as: 'UserTwoId'
		});
	};
	return User;
};
