const Discord = require('discord.js');
const fs = require('fs');

const dice = require('./commands/dice.js');
const help = require('./commands/help.js');
const lyrics = require('./commands/lyrics.js');
const prefixJS = require('./commands/prefix.js');
const weather = require('./commands/weather.js');
const wolfram = require('./commands/wolfram.js');

const secrets = JSON.parse(fs.readFileSync('./src/secrets.json'));
let prefixStorage = JSON.parse(fs.readFileSync('./src/prefixStorage.json'));

let prefix = prefixStorage.defaultPrefix;
const client = new Discord.Client();

client.on('ready', () => {
		console.log('Twilight Bot is ready to roll!');
	}
);

//Get user input.
client.on('message', msg => {
	if (!(msg.guild.id in prefixStorage.prefixes)) {
		prefix = prefixStorage.defaultPrefix;
	} else {
		prefix = prefixStorage.prefixes[msg.guild.id];
	}

	if (msg.content.trim()[0] === prefix) {
		let msgArray =  msg.content.trim().slice(1).split(' ');
		console.log(msgArray);
		switch (msgArray[0].toLowerCase()){

//Dice. Send throw results as embed.
			case 'dice': {
				dice.main(msgArray, msg, prefix);
				break;
			}

//Help. Send help to degenerates.'.
			case 'help': {
				help.main(msgArray, msg, prefix);
				break;
			}

//Lyrics. Send lyrics scraped from Genius.
			case 'lyrics': {
				lyrics.main(msgArray, msg, prefix);
				break;
			}

//Prefix. Change bot's command prefix.
			case 'prefix': {
				prefixJS.main(msgArray, msg, prefix);
				prefixStorage = JSON.parse(fs.readFileSync('./src/prefixStorage.json'));
				break;
			}

//Weather.Send data from Open Weather Map API as embed.
			case 'weather': {
				weather.main(msgArray, msg, prefix);
				break;
			}

//Wolfram. Send a simple text answer from WolframAlpha as embed.
			case 'wolfram': {
				wolfram.main(msgArray, msg, prefix);
				break;
			}

//EOTL. Unknown command.
			default: {
				msg.channel.send(`Unknown command. For help, type '${prefix}help' or '${prefix}help [command]'.`);
			}
		}
	} else if (msg.content == '$prefix') {
		prefixJS.main(['prefix'], msg);
	}
});

client.login(secrets.token);