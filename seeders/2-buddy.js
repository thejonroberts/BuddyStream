'use strict';

const buddies = require('../data/buddies');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Buddies', buddies, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Buddies', null, {});
	}
};
