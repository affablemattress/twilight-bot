const fs = require('fs');
const request = require('request');

const dump = JSON.parse(fs.readFileSync('./src/dump.json'));
const textDump = JSON.parse(fs.readFileSync('./src/textDump.json'));
const secrets = JSON.parse(fs.readFileSync('./src/secrets.json'));

const helpText = `For help, type '${dump.commandChar}help' or '${dump.commandChar}help [command]'.`;

<<<<<<< HEAD
//WRAPPER FUNCTION
const main = async function (msgArray, msg) {
=======
module.exports = main;

//WRAPPER FUNCTION
function main(msgArray, msg){
>>>>>>> 3d28a6a9f119b2a618c595576e41d9da57056465
	if (msgArray.length < 2) {
		msg.channel.send(`Invalid wolfram command. ${helpText}`);
	} else {
		wolfram(msgArray, msg);
	}
}

<<<<<<< HEAD
module.exports.main = main;

=======
>>>>>>> 3d28a6a9f119b2a618c595576e41d9da57056465
const wolfram = function sendDataAcquiredFromWolframAlphaShortAnswerAPI(msgArray, msg) {
	let queryText = '';
	for (var i = 1; i < msgArray.length; i++) queryText += ' ' + msgArray[i];
	let search = queryText.trim();
	while (queryText.includes('+')) queryText = queryText.replace('+', '%2B');
<<<<<<< HEAD
	const APIEndpoint = `${secrets.api.wolframAlpha.URL}result?i=${queryText}&units=metric&appid=${secrets.api.wolframAlpha.key}`;
=======
	let APIEndpoint = `${secrets.api.wolframAlpha.URL}result?i=${queryText}&units=metric&appid=${secrets.api.wolframAlpha.key}`;
>>>>>>> 3d28a6a9f119b2a618c595576e41d9da57056465
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
							icon_url: dump.botIconURL,
						},
						title: search,
						description: data.toString(),
						footer: {
							text: 'Data acquired from Wolfram|Alpha',
							icon_url: secrets.api.wolframAlpha.iconURL
						}
					}
				});
			} else {
				console.log(`Wolfram ${response.statusCode}`);
				msg.channel.send('WolframAlpha ' + textDump.down);
			}
		} else{
			console.log('Wolfram API did not respond.');
			msg.channel.send(`WolframAlpha ${textDump.down}`);
		}
	});
}