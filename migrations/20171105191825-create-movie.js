'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Movies', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			SourceId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					//TODO - add migration for this (circular) association
					model: 'Sources',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			title: {
				type: Sequelize.STRING
			},
			sourceIdentifier: {
				type: Sequelize.STRING
			},
			url: {
				type: Sequelize.STRING
			},
			embedHTML: {
				type: Sequelize.STRING
			},
			runningMinutes: {
				type: Sequelize.INTEGER
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Movies');
	}
};
