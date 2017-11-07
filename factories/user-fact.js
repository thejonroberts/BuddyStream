'use strict';

let currentUser = null;

module.exports.setUser = userId => {
	currentUser = userId;
};

module.exports.getUser = () => {
	return currentUser;
};
