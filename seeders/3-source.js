'use strict';

const sources = require('../data/sources');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Sources', sources, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Sources', null, {});
	}
};
