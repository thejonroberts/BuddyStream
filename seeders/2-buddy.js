'use strict';

const buddies = require('../data/buddies');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('UserBuddies', buddies, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('UserBuddies', null, {});
	}
};
