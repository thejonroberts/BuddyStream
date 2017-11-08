'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numSessions, numBuddies } } = require('./amounts.json');
let fs = require('fs');
let sessions = [];

for (let i = 0; i < numSessions; i++) {
	let percentViewed = Math.floor(Math.random() * 100) + 1;
	let UserBuddyId = Math.floor(Math.random() * numBuddies) + 1;
	let MovieId = 1;
	let createdAt = faker.date.past().toISOString();
	let updatedAt = new Date().toISOString();

	sessions.push({ percentViewed, UserBuddyId, MovieId, createdAt, updatedAt });
}

let sessionsJSONString = JSON.stringify(sessions);

fs.writeFile('./data/sessions.json', sessionsJSONString, err => {
	if (err) console.log('error!', err);
});
