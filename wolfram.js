const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("src/dump.json"));
const secrets = JSON.parse(fs.readFileSync("src/secrets.json"));

module.exports = {
	embedData: function (data, queryText) {
		return embedData(data, queryText);
	}
};

function embedData(data, queryText){
	queryText = "Answer to Query: " + queryText[0].toUpperCase() + queryText.slice(1);
	while(queryText.includes("%2B")) queryText = queryText.replace("%2B", "+");
	data = data.toString()[0].toUpperCase() + data.toString().slice(1)
	return {
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
	};
}