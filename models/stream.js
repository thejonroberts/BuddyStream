'use strict';
module.exports = (sequelize, DataTypes) => {
	var Stream = sequelize.define('Stream', {
		title: DataTypes.STRING,
		SourceId: DataTypes.INTEGER,
		sourceIdentifier: DataTypes.STRING,
		url: DataTypes.STRING,
		embedHTML: DataTypes.STRING,
		runningMinutes: DataTypes.INTEGER
	});

	Stream.associate = function(models) {
		Stream.belongsTo(models.Source, {
			foreignKey: 'id'
		});
		Stream.hasMany(models.Session, {
			foreignKey: 'StreamId'
		});
	};

	return Stream;
};
