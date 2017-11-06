'use strict';
module.exports = (sequelize, DataTypes) => {
	var Source = sequelize.define('Source', {
		name: DataTypes.STRING,
		homepageUrl: DataTypes.STRING,
		embedTemplate: DataTypes.STRING
	});

	Source.associate = function(models) {
		Source.hasMany(models.Stream, {
			foreignKey: 'sourceId'
		});
	};

	return Source;
};
