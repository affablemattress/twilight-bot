const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const dump = JSON.parse(fs.readFileSync('./src/dump.json'));
const textDump = JSON.parse(fs.readFileSync('./src/textDump.json'));
const secrets = JSON.parse(fs.readFileSync('./src/secrets.json'));

const helpText = `For help, type '${dump.commandChar}help' or '${dump.commandChar}help [command]'.`;

let details = {
	success: false,
	title: '',
	artist: '',
	thumbnailURL: '',
	address: '',
	search: '',
	album: '',
	lyrics: []
};

<<<<<<< HEAD
//WRAPPER FUNCTION
const main = async function (msgArray, msg) {
=======
module.exports = main;

//WRAPPER FUNCTION
const main = function(msgArray, msg) {
>>>>>>> 3d28a6a9f119b2a618c595576e41d9da57056465
	if (msgArray.length < 2) {
		msg.channel.send(`Invalid lyrics command. ${helpText}`);
	} else {
		genius(msgArray, msg);
	}
}

<<<<<<< HEAD
module.exports.main = main;

const getDetails = function getTrackDetailsFromGeniusAPI(queryText, msg) {
	return new Promise((resolve, reject) => {
		const APIEndpoint = `${secrets.api.genius.URL}search?q=${queryText}&access_token=${secrets.api.genius.key}`;
=======
const getDetails = function getTrackDetailsFromGeniusAPI(queryText, msg) {
	return new Promise((resolve, reject) => {
		let APIEndpoint = `${secrets.api.genius.URL}search?q=${queryText}&access_token=${secrets.api.genius.key}`;
>>>>>>> 3d28a6a9f119b2a618c595576e41d9da57056465
		request.get(APIEndpoint, (error, response, data) => {
			if (response){
				if (response.statusCode == 200) {
					let GETData = JSON.parse(data);
					if (GETData.response.hits.length != 0) {
						let songData = GETData.response.hits[0].result;
						details.success = true;
						details.title = songData.title;
						details.artist = songData.primary_artist.name;
						details.address = songData.url;
						details.thumbnailURL = songData.song_art_image_thumbnail_url;
						resolve();
					} else {
						msg.channel.send({
							embed: {
								color: 0x00cbb0,
								author: {
									name: 'Twilight Bot',
									icon_url: dump.botIconURL,
								},
								title: `Couldn't find the lyrics for: '${details.search}'`,
								description: '-sad bot noises-',
								footer: {
									text: helpText
								}
							}
						});
						reject();
					}
				} else {
					console.log(`Genius API ${response.statusCode}`);
					msg.channel.send(`Genius ${textDump.down}`);
					reject();
				}
			} else {
				console.log('Genius API did not respond.');
				msg.channel.send(`Genius ${textDump.down}`);
				reject();
			}
		});
	});
}

const getLyrics = function getTracksLyricsFromGeniusWebsite(msg) {
	return new Promise((resolve, reject) => {
		request.get(details.address, (error, response, data) => {
			if (response) {
				if (response.statusCode == 200) {
					let $ = cheerio.load(data);
					if ($('body > routable-page .lyrics p').length != 0) {
						details.lyrics = $('body > routable-page .lyrics p').text().split('\n').filter((value) => {
							return value != '';
						});
						resolve();
					} else {
						msg.channel.send(`Couldn't retrieve lyrics from Genius.`);
						details.success = false;
						reject();
					}
				} else {
					console.log(`Genius scraper ${response.statusCode}`);
					msg.channel.send(`Genius ${textDump.down}`);
					details.success = false
					reject();
				}
			} else{
				console.log('Genius Website did not respond.');
				msg.channel.send(`Genius ${textDump.down}`);
				details.success = false;
				reject();
			}
		});
	});
}

const genius = async function sendDataAcquiredFromGeniusWebsite(msgArray, msg) {
	let queryText = '';
	for (var i = 1; i < msgArray.length; i++) queryText += ' ' + msgArray[i];
	queryText = queryText.trim();
	details.search = queryText[0].toUpperCase() + queryText.slice(1);
	while (queryText.includes('+')) queryText = queryText.replace('+', '%2B');
	await getDetails(queryText, msg);
	if (details.success) {
		await getLyrics(msg);
		if (details.success) {
			let lyrics = details.lyrics;
			let rawFields = [];
			let fieldLineCount = 0;
			let field = ['', ''];
			lyrics.forEach((line) => {
				if (/^(\[(([a-zA-Z0-9])|\W)+\])$/.test(line)) {
					if (field[0] == '' && field[1] == '') {
						field[0] = line;
					} else if (field[0] != '' && field[1] == '') {
						field[1] = '\u200b';
						rawFields.push({
							name: field[0],
							value: field[1]
						});
						field = [line, ''];
						fieldLineCount = 0;
					} else if (field[0] == '' && field[1] != '') {
						field[0] = '\u200b';
						rawFields.push({
							name: field[0],
							value: field[1]
						});
						field = [line, ''];
						fieldLineCount = 0;
					} else {
						rawFields.push({
							name: field[0],
							value: field[1]
						})
						field = [line, ''];
						fieldLineCount = 0;
					}
				} else {
					if (field[1].length < 900) {
						field[1] += line + '\n';
						fieldLineCount++;
					} else {
						if (field[0] == '') {
							field[0] = '\u200b';
							rawFields.push({
								name: field[0],
								value: field[1]
							});
							field = ['', line];
							fieldLineCount = 0;
						} else {
							rawFields.push({
								name: field[0],
								value: field[1]
							});
							field = ['', line];
							fieldLineCount = 0;
						}
					}
				}
			})

			if (field[0] == '' && field[1] != '') {
				field[0] = '\u200b';
				rawFields.push({
					name: field[0],
					value: field[1]
				});
			} else if (field[0] != '' && field[1] == '') {
				field[1] = '\u200b';
				rawFields.push({
					name: field[0],
					value: field[1]
				});
			} else if (field[0] != '' && field[1] != '') {
				rawFields.push({
					name: field[0],
					value: field[1]
				});
			}

			let rawEmbeds = [];
			let rawEmbedFields= [];
			rawFields.forEach((rawField) => {
				if (rawEmbedFields.length < 5) {
					rawEmbedFields.push(rawField);
				} else {
					rawEmbeds.push(rawEmbedFields);
					rawEmbedFields = [];
				}
			});

			if(rawEmbedFields.length){
				rawEmbeds.push(rawEmbedFields);
			}

			rawEmbeds.forEach((rawEmbed, index) => {
				embed = {
					color: 0x00cbb0,
					fields: rawEmbed,
				};
				if (index == 0) {
					embed = {
						...embed,
						...{
							author: {
								name: 'Twilight Bot',
								icon_url: dump.botIconURL,
							},
							title: `Lyrics for '${details.title}'`,
							description: `By ${details.artist}`,
							thumbnail: {
								url: details.thumbnailURL,
							},
						}
					};
				} else if (index == rawEmbeds.length - 1) {
					embed = {
						...embed,
						...{
							footer: {
								text: 'Lyrics acquired from Genius',
								icon_url: secrets.api.genius.iconURL
							}
						}
					};
				}

				msg.channel.send({
					embed: embed
				});
			});
		}
	}
}