const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");

const dump = JSON.parse(fs.readFileSync("./src/dump.json"));
const textDump = JSON.parse(fs.readFileSync("./src/textDump.json"));
const secrets = JSON.parse(fs.readFileSync("./src/secrets.json"));

var miniHelpText = "For help, type '" + dump.commandChar + "help' or '" + dump.commandChar + "help [command]'.";

var details = {
	success: false,
	title: "",
	artist: "",
	thumbnailURL: "",
	address: "",
	search: "",
	album: ""
}

module.exports = {
	main: (msgArray, msg) => {
		main(msgArray, msg);
	},
};

function main(msgArray, msg) {
	if (msgArray.length < 2) {
		msg.channel.send("Invalid lyrics command. " + miniHelpText);
	} else {
		genius(msgArray, msg);
	}
}

function getDetails(queryText, msg){
	return new Promise((resolve, reject) => {
		request.get(secrets.api.genius.URL + "search?q=" + queryText + "&access_token=" + secrets.api.genius.key, (error, response, data) => {
			if (response){
				if(response.statusCode == 200) {
					var GETData = JSON.parse(data);
					if (GETData.response.hits.length != 0) {
						details.success = true;
						details.title = GETData.response.hits[0].result.title;
						details.artist = GETData.response.hits[0].result.primary_artist.name;
						details.address = GETData.response.hits[0].result.url;
						details.thumbnailURL = GETData.response.hits[0].result.song_art_image_thumbnail_url;
						console.log(details)
						resolve();
					} else {
						msg.channel.send({
							embed: {
								color: 0x00cbb0,
								author: {
									name: "Twilight Bot",
									icon_url: dump.botIconURL,
								},
								title: "Couldn't find the lyrics for: " + details.search,
								description: "-sad bot noises-",
								footer: {
									text: miniHelpText
								}
							}
						});
						reject();
					}
				} else {
					console.log("Genius API " + response.statusCode);
					msg.channel.send("Genius " + textDump.down);
					reject();
				}
			} else {
				console.log("Genius API did not respond.");
				msg.channel.send("Genius " + textDump.down);
				reject();
			}
		});
	});
}

function getLyrics(msg){
	return new Promise ((resolve, reject) => {
		request.get(details.address, (error, response, data) => {
			if(response){
				if (response.statusCode == 200) {
					const $ = cheerio.load(data);
					if ($("body > routable-page .lyrics p").length != 0) {
						details.lyrics = $("body > routable-page .lyrics p").text().split("\n").filter((value) => {
							return value != ""
						});
						resolve()
					} else {
						msg.channel.send("Couldn't retrieve lyrics from Genius.");
						details.success = false
						reject();
					}
				} else {
					console.log("Genius scraper " + response.statusCode);
					msg.channel.send("Genius " + textDump.down);
					details.success = false
					reject()
				}
			} else{
				console.log("Genius Website did not respond.");
				msg.channel.send("Genius " + textDump.down);
				details.success = false
				reject()
			}
		})
	})
}

async function genius(msgArray, msg){
	let queryText = "";
	for (var i = 1; i < msgArray.length; i++) queryText += " " + msgArray[i];
	queryText = queryText.trim();
	details.search = queryText[0].toUpperCase() + queryText.slice(1);;
	while (queryText.includes("+")) queryText = queryText.replace("+", "%2B");
	await getDetails(queryText, msg);
	if(details.success){
		await getLyrics(msg);
		if(details.success){
			lyrics = details.lyrics
			var rawFields = []
			var fieldLineCount = 0
			var field = ["", ""]
			for (j = 0; j < lyrics.length; j++) {
				if (/^(\[(([a-zA-Z0-9])|\W)+\])$/.test(lyrics[j])) {
					if (field[0] == "" && field[1] == "") {
						field[0] = lyrics[j];
					} else if (field[0] != "" && field[1] == "") {
						field[1] = "\u200b";
						rawFields.push({
							name: field[0],
							value: field[1]
						})
						field = [lyrics[j], ""]
						fieldLineCount = 0
					} else if (field[0] == "" && field[1] != "") {
						field[0] = "\u200b";
						rawFields.push({
							name: field[0],
							value: field[1]
						})
						field = [lyrics[j], ""]
						fieldLineCount = 0
					} else{
						rawFields.push({
							name: field[0],
							value: field[1]
						})
						field = [lyrics[j], ""]
						fieldLineCount = 0
					}
				} else{
					if (field[1].length < 900) {
						field[1] += lyrics[j] + "\n"
						fieldLineCount++;
					} else{
						if (field[0] == ""){
							field[0] = "\u200b";
							rawFields.push({
								name: field[0],
								value: field[1]
							})
							field = ["", lyrics[j]]
							fieldLineCount = 0
						} else{
							rawFields.push({
								name: field[0],
								value: field[1]
							})
							field = ["", lyrics[j]]
							fieldLineCount = 0
						}
					}
				} 
			}
			if (field[0] == "" && field[1] != "") {
				field[0] = "\u200b";
				rawFields.push({
					name: field[0],
					value: field[1]
				})
			} else if (field[0] != "" && field[1] == "") {
				field[1] = "\u200b";
				rawFields.push({
					name: field[0],
					value: field[1]
				})
			} else if (field[0] != "" && field[1] != "") {
				rawFields.push({
					name: field[0],
					value: field[1]
				})
			}
			var rawEmbeds = []
			var rawEmbedFields= []
			for(n=0; n < rawFields.length; n++){
				if(rawEmbedFields.length <5){
					rawEmbedFields.push(rawFields[n]);
				} else {
					rawEmbeds.push(rawEmbedFields);
					rawEmbedFields = [];
				}
			}
			if(rawEmbedFields.length){
				rawEmbeds.push(rawEmbedFields)
			}
			for(k = 0; k < rawEmbeds.length; k++) {
				rawEmbed = {
					color: 0x00cbb0,
					fields: rawEmbeds[k],
				}
				if (k == 0) {
					embed = {
						...rawEmbed,
						...{
							author: {
								name: "Twilight Bot",
								icon_url: dump.botIconURL,
							},
							title: "Lyrics for '" + details.title + "'",
							description: "By "  + details.artist,
							thumbnail: {
								url: details.thumbnailURL,
							},
						}
					}
				} else if (k == rawEmbeds.length - 1) {
					embed = {
						...rawEmbed,
						...{
							footer: {
								text: 'Lyrics acquired from Genius',
								icon_url: secrets.api.genius.iconURL
							}
						}
					}
				} else {
					embed = rawEmbed
				}
				msg.channel.send({
					embed: embed
				})
			}
		}
	}
}