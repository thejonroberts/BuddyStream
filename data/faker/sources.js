'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numSources } } = require('./amounts.json');
let fs = require('fs');
let sources = [];

for (let i = 0; i < numSources; i++) {
	let name = 'YouTube';
	let homepageUrl = 'www.youtube.com';
	let embedTemplate =
		'<iframe width="560" height="315" src="https://www.youtube.com/embed/IDENTIFIER" frameborder="0" allowfullscreen></iframe>';
	let createdAt = faker.date.past().toISOString();
	let updatedAt = new Date().toISOString();

	sources.push({
		name,
		homepageUrl,
		embedTemplate,
		createdAt,
		updatedAt
	});
}

let sourcesJSONString = JSON.stringify(sources);

fs.writeFile('./data/sources.json', sourcesJSONString, err => {
	if (err) console.log('error!', err);
});
