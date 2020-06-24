const fs = require('fs');

const storage = JSON.parse(fs.readFileSync(__dirname + '/../src/storage.json'));
let prefixStorage = JSON.parse(fs.readFileSync(__dirname + '/../src/prefixStorage.json'));

//WRAPPER FUNCTION
const main = async function (msgArray, msg, prefix) {
	if (msgArray.length == 1) {
		showPrefix(msg, prefix);
	} else {
		editPrefix(msgArray, msg);
	}
}

module.exports.main = main;

const showPrefix = async function sendGuildPrefix(msg, prefix) {
	msg.channel.send({
		embed: {
			color: 0x00cbb0,
			author: {
				name: 'Twilight Bot',
				icon_url: storage.botIconURL,
			},
			title: `Prefix for ${msg.guild.name} is '${prefix}'`,
			description: `For help, type '${prefix}help' or '${prefix}help [command]'.`
		},
	});
}

const editPrefix = async function editGuildPrefixAtPrefixStorage(msgArray, msg) {
	if (/[^a-zA-Z\d\s:@]/.test(msgArray[1].slice(0, 1))) {
		prefixStorage = JSON.parse(fs.readFileSync(__dirname + '/../src/prefixStorage.json'));
		prefixStorage.prefixes[msg.guild.id] = msgArray[1].slice(0, 1);
		fs.writeFileSync(__dirname + '/../src/prefixStorage.json', JSON.stringify(prefixStorage));
		msg.channel.send({
			embed: {
				color: 0x00cbb0,
				author: {
					name: 'Twilight Bot',
					icon_url: storage.botIconURL,
				},
				title: `Prefix for ${msg.guild.name} is changed to '${msgArray[1].slice(0, 1)}'`,
				description: `For help, type '${msgArray[1].slice(0, 1)}help' or '${msgArray[1].slice(0, 1)}help [command]'.`
			},
		});
	} else {
		msg.channel.send(`'${msgArray[1].slice(0, 1)}' is not a valid prefix. Try a non-alphanumeric character except '@'.`);
	}
}