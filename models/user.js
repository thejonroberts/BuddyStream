'use strict';
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define('User', {
		first: DataTypes.STRING,
		last: DataTypes.STRING,
		email: DataTypes.STRING,
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		pictureUrl: DataTypes.STRING,
		lastLoginDate: DataTypes.DATEONLY
	});

	User.associate = function(models) {
		User.belongToMany(models.user, {
			through: 'Buddies',
			as: 'UserOneId'
		});
		User.belongToMany(models.user, {
			through: 'Buddies',
			as: 'UserTwoId'
		});
	};
	return User;
};
