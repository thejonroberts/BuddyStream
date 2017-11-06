'use strict';

const sessions = require('../data/sessions');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Sessions', sessions, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Sessions', null, {});
	}
};
