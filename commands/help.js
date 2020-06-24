//Send help.
const main = async function (msgArray, msg, prefix) {
	if (msgArray.length == 1) {
		msg.channel.send('HELP LOREM IPSUM');
	} else {
		switch (msgArray[1].toLowerCase()) {
			case 'weather':
				msg.channel.send("WEATHER LOREM IPSUM");
				break;
			default:
				msg.channel.send(`Help requested for unknown command ['${msgArray[1]}']. For help, type '${prefix}help ' or '${prefix}help[command]'.`);
		}
	}
}

module.exports.main = main;
