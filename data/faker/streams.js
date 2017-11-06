'use strict';

// generate a bunch of customers with Faker
const faker = require('faker');
const { amounts: { numStreams } } = require('./amounts.json');
let fs = require('fs');
let streams = [];

for (let i = 0; i < numStreams; i++) {
	let title = 'Joe vs the Volcano';
	let SourceId = 1;
	let sourceIdentifier = 'foRGC_Xtv6Q';
	let url = 'https://www.youtube.com/watch?v=foRGC_Xtv6Q';
	let embedHTML =
		'<iframe width="560" height="315" src="https://www.youtube.com/embed/foRGC_Xtv6Q" frameborder="0" allowfullscreen></iframe>';
	let runningMinutes = 102;
	let createdAt = faker.date.past().toISOString();
	let updatedAt = new Date().toISOString();

	streams.push({
		title,
		SourceId,
		sourceIdentifier,
		url,
		embedHTML,
		runningMinutes,
		createdAt,
		updatedAt
	});
}

let streamsJSONString = JSON.stringify(streams);

fs.writeFile('./data/streams.json', streamsJSONString, err => {
	if (err) console.log('error!', err);
});
