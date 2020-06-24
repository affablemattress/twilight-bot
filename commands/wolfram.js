const fs = require('fs');
const request = require('request');

const storage = JSON.parse(fs.readFileSync(__dirname + '/../src/storage.json'));
const secrets = JSON.parse(fs.readFileSync(__dirname + '/../src/secrets.json'));

//WRAPPER FUNCTION
const main = async function (msgArray, msg, prefix) {
	if (msgArray.length < 2) {
		msg.channel.send(`Invalid wolfram command. For help, type '${prefix}help' or '${prefix}help [command]'.`);
	} else {
		wolfram(msgArray, msg);
	}
}

module.exports.main = main;

const wolfram = function sendDataAcquiredFromWolframAlphaShortAnswerAPI(msgArray, msg) {
	let queryText = '';
	for (var i = 1; i < msgArray.length; i++) queryText += ' ' + msgArray[i];
	let search = queryText.trim();
	while (queryText.includes('+')) queryText = queryText.replace('+', '%2B');
	const APIEndpoint = `${storage.api.wolframAlpha.URL}result?i=${queryText}&units=metric&appid=${secrets.api.wolframAlpha}`;
	request.get(APIEndpoint, (error, response, data) => {
		if (response) {	
			if (response.statusCode == 200 || response.statusCode == 501) {
				search = 'Answer to Query: ' + search[0].toUpperCase() + search.slice(1);
				data = data.toString()[0].toUpperCase() + data.toString().slice(1);
				msg.channel.send({
					embed: {
						color: 0x00cbb0,
						author: {
							name: 'Twilight Bot',
							icon_url: storage.botIconURL,
						},
						title: search,
						description: data.toString(),
						footer: {
							text: 'Data acquired from Wolfram|Alpha',
							icon_url: storage.api.wolframAlpha.iconURL
						}
					}
				});
			} else {
				console.log(`Wolfram ${response.statusCode}`);
				msg.channel.send('WolframAlpha is down for a while. Try again later.');
			}
		} else{
			console.log('Wolfram API did not respond.');
			msg.channel.send(`WolframAlpha is down for a while. Try again later.`);
		}
	});
}