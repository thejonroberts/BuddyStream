'use strict';
module.exports = (sequelize, DataTypes) => {
	var Movie = sequelize.define('Movie', {
		title: DataTypes.STRING,
		SourceId: DataTypes.INTEGER,
		sourceIdentifier: DataTypes.STRING,
		url: DataTypes.STRING,
		embedHTML: DataTypes.STRING,
		runningMinutes: DataTypes.INTEGER
	});

	Movie.associate = function(models) {
		Movie.hasOne(models.Source, {
			foreignKey: 'id'
		});
		Movie.hasMany(models.Session, {
			foreignKey: 'MovieId'
		});
	};

	return Movie;
};
