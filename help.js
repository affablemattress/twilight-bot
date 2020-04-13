const fs = require("fs");

const textDump = JSON.parse(fs.readFileSync("./src/secrets.json"));

module.exports = {
	main: (msgArray, msg) => {
		main(msgArray, msg);
	},
};


//Send help text from "textDump.json"
function main(msgArray, msg){
	if (msgArray.length == 1) {
		msg.channel.send(textDump.help.main);
	} else {
		switch (msgArray[1].toLowerCase()) {
			case "weather":
				msg.channel.send(textDump.help.lorem);
				break;
			default:
				var miniHelpText = "For help, type '" + dump.commandChar + "help' or '" + dump.commandChar + "help [command]'.";
				msg.channel.send("Help requested for unknown command [" + msgArray[1] + "]. " + miniHelpText);
		}
	}
}
