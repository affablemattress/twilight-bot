const Discord = require("discord.js");
const fs = require("fs");
const weather = require("./weather.js");
const wolfram = require("./wolfram.js")
const dice = require("./dice.js");
const help = require("./help.js");

const secrets = JSON.parse(fs.readFileSync("./src/secrets.json"));
const dump = JSON.parse(fs.readFileSync("./src/dump.json"));

const client = new Discord.Client();
const commandChar = dump.commandChar;

const helpText = "Unknown command. For help, type '"+ commandChar +"help' or '"+ commandChar +"help [command]'.";

client.on("ready", ()=>{
	console.log("Twilight Bot is ready to roll!");
})

client.on("message", msg =>{
//Gets user input.
	if (msg.content.trim()[0] === commandChar){
		var msgArray =  msg.content.trim().slice(1).split(" ");
		console.log(msgArray);
		switch (msgArray[0].toLowerCase()){

//Help. Send text from "textDump.json".
			case "help":
				help.main(msgArray, msg);
				break;

//Weather.Send data from Open Weather Map API as embed.
			case "weather":
				weather.main(msgArray, msg);
				break;

//Wolfram. Send a simple text answer from WolframAlpha as embed.
			case "wolfram":
				wolfram.main(msgArray, msg);
				break;

//Dice. Send throw results as embed.
			case "dice":
				dice.main(msgArray, msg);
				break;

//EOTL. Unknown command.
			default:
				msg.channel.send(helpText);
		}
	}
});

client.login(secrets.token);