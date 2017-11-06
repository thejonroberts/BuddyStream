'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numSessions, numBuddies } } = require('./amounts.json');
let fs = require('fs');
let sessions = [];

for (let i = 0; i < numSessions; i++) {
	let percentViewed = Math.floor(Math.random() * 100) + 1;
	let BuddyId = Math.floor(Math.random() * numBuddies) + 1;
	let StreamId = 1;
	let createdAt = faker.date.past().toISOString();
	let updatedAt = new Date().toISOString();

	sessions.push({ percentViewed, BuddyId, StreamId, createdAt, updatedAt });
}

let sessionsJSONString = JSON.stringify(sessions);

fs.writeFile('./data/sessions.json', sessionsJSONString, err => {
	if (err) console.log('error!', err);
});
