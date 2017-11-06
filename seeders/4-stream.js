'use strict';

const streams = require('../data/streams');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Streams', streams, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Streams', null, {});
	}
};
