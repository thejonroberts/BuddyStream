'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numUsers, numBuddies } } = require('./amounts.json');
let fs = require('fs');
let buddies = [];

for (let i = 0; i < numBuddies; i++) {
	let UserOneId = null;
	let UserTwoId = null;
	let firstBud = Math.floor(Math.random() * numUsers) + 1;
	let secondBud = Math.floor(Math.random() * numUsers) + 1;
	// make sure UserOneId is the lowest integer
	if (firstBud < secondBud) {
		UserOneId = firstBud;
		UserTwoId = secondBud;
	} else if (firstBud > secondBud) {
		UserOneId = secondBud;
		UserTwoId = firstBud;
	} else if (firstBud === 1 && secondBud === 1) {
		UserOneId = firstBud;
		UserTwoId = firstBud + 1;
	} else {
		UserOneId = firstBud - 1;
		UserTwoId = firstBud;
	}
	let statusCode = 4;
	let createdAt = faker.date.past().toISOString();
	let updatedAt = new Date().toISOString();

	buddies.push({
		UserOneId,
		UserTwoId,
		statusCode,
		createdAt,
		updatedAt
	});
}

let usersJSONString = JSON.stringify(buddies);

fs.writeFile('./data/buddies.json', usersJSONString, err => {
	if (err) console.log('error!', err);
});
