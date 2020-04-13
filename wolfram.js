const fs = require("fs");
const request = require("request");

const dump = JSON.parse(fs.readFileSync("./src/dump.json"));
const secrets = JSON.parse(fs.readFileSync("./src/secrets.json"));

module.exports = {
	main: (msgArray, msg) => {
		main(msgArray, msg)
	},
};

//WRAPPER FUNCTION
function main(msgArray, msg){
	let miniHelpText = "For help, type '" + dump.commandChar + "help' or '" + dump.commandChar + "help [command]'.";
	if (msgArray.length < 2) {
		msg.channel.send("Invalid wolfram command. " + miniHelpText);
	} else {
		wolfram(msgArray, msg);
	}
}

//Input-> data: Hex data acquired from WolframAlpha Simple Answer API, queryText: URL encoded query which was sent to API. Return-> None.
function wolfram(msgArray, msg){
	let queryText = "";
	for (var i = 1; i < msgArray.length; i++) queryText += " " + msgArray[i];
	queryText = queryText.trim();
	while (queryText.includes("+")) queryText = queryText.replace("+", "%2B");
	request.get(secrets.api.wolframAlpha.URL + "result?i=" + queryText + "&units=metric&appid=" + secrets.api.wolframAlpha.key, (error, response, data) => {
		if (response.statusCode == 200 || response.statusCode == 501) {
			queryText = "Answer to Query: " + queryText[0].toUpperCase() + queryText.slice(1);
			while (queryText.includes("%2B")) queryText = queryText.replace("%2B", "+");
			data = data.toString()[0].toUpperCase() + data.toString().slice(1);
			msg.channel.send({
				embed: {
					color: 0x00cbb0,
					author: {
						name: "Twilight Bot",
						icon_url: dump.botIconURL,
					},
					title: queryText,
					description: data.toString(),
					footer: {
						text: 'Data acquired from Wolfram|Alpha',
						icon_url: secrets.api.wolframAlpha.iconURL
					}
				}
			});
		} else {
			console.log("Wolfram" + response.statusCode);
			msg.channel.send("WolframAlpha " + textDump.down);
		}
	})
}