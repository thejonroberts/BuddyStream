'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			first: {
				type: Sequelize.STRING
			},
			last: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			username: {
				type: Sequelize.STRING
			},
			password: {
				type: Sequelize.STRING
			},
			pictureUrl: {
				type: Sequelize.STRING
			},
			lastLoginDate: {
				type: Sequelize.DATEONLY
			},
			city: {
				type: Sequelize.STRING
			},
			state: {
				type: Sequelize.STRING
			},
			country: {
				type: Sequelize.STRING
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
		return queryInterface.dropTable('Users');
	}
};
