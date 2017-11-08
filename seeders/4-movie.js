'use strict';

const streams = require('../data/streams');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Movies', streams, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Movies', null, {});
	}
};
