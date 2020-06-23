const fs = require('fs');

const dump = JSON.parse(fs.readFileSync(__dirname + '/../src/dump.json'));
const textDump = JSON.parse(fs.readFileSync(__dirname + '/../src/secrets.json'));

var miniHelpText = "For help, type '" + dump.commandChar + "help' or '" + dump.commandChar + "help [command]'.";

//Send help text from 'textDump.json'
const main = async function (msgArray, msg) {
	if (msgArray.length == 1) {
		msg.channel.send(textDump.help.main);
	} else {
		switch (msgArray[1].toLowerCase()) {
			case 'weather':
				msg.channel.send(textDump.help.lorem);
				break;
			default:
				msg.channel.send('Help requested for unknown command [' + msgArray[1] + ']. ' + miniHelpText);
		}
	}
}

module.exports.main = main;
