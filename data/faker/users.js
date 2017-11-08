'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numUsers } } = require('./amounts.json');
let fs = require('fs');
let bCrypt = require('bcrypt-nodejs');
let users = [];

let hasher = password => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8));
};

for (let i = 0; i < numUsers; i++) {
	let first = faker.name.firstName();
	let last = faker.name.lastName();
	let email = faker.internet.email();
	let username = faker.internet.userName();
	let password = hasher('1234');
	let pictureUrl = 'public/images/Sarah_Goodridge_Self_Portrait.jpg';
	let city = faker.address.city();
	let state = faker.address.state();
	let country = 'US';

	let createdAt = faker.date.past().toISOString();
	let recent_date = faker.date.recent().toISOString();
	let lastLoginDate = faker.date.between(createdAt, recent_date).toISOString();
	let updatedAt = new Date().toISOString();

	users.push({
		first,
		last,
		createdAt,
		lastLoginDate,
		email,
		username,
		password,
		updatedAt,
		pictureUrl,
		city,
		state,
		country
	});
}

let usersJSONString = JSON.stringify(users);

fs.writeFile('./data/users.json', usersJSONString, err => {
	if (err) console.log('error!', err);
});
