'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Streams', {
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
		return queryInterface.dropTable('Streams');
	}
};
