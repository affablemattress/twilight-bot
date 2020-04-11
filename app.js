const Discord = require("discord.js");
const request = require("request");
const fs = require("fs");
const weather = require("./weather.js");
const wolfram = require("./wolfram.js")
const dice = require("./dice.js")

const secrets = JSON.parse(fs.readFileSync("./src/secrets.json"));
const textDump = JSON.parse(fs.readFileSync("./src/textDump.json"));
const dump = JSON.parse(fs.readFileSync("./src/dump.json"));

const client = new Discord.Client();
const commandChar = dump.commandChar;

const helpText = "Unknown command. For help, type '"+ commandChar +"help' or '"+ commandChar +"help [command]'.";
const miniHelpText = "For help, type '"+ commandChar +"help' or '"+ commandChar +"help [command]'.";

client.on("ready", ()=>{
	console.log("Twilight Bot is ready to roll!");
})

client.on("message", msg =>{
//Main function
	if (msg.content.trim()[0] === commandChar){
		var msgArray =  msg.content.trim().slice(1).split(" ");
		console.log(msgArray);
		switch (msgArray[0].toLowerCase()){

//Help. Return text from "textDump".
			case "help":
				if(msgArray.length == 1){
					msg.channel.send(textDump.help.main);
				} else{
					switch (msgArray[1].toLowerCase()){
						case "weather":
							msg.channel.send(textDump.help.lorem);
							break;
						default:
							msg.channel.send("Help requested for unknown command [" + msgArray[1] + "]. " + miniHelpText);
					}
				}
				break;

//Weather. Return data from Open Weather Map API.
			case "weather":
				if(msgArray.length < 2){
					msg.channel.send("Invalid weather command. " + miniHelpText)
				} else{
					switch (msgArray[1]){
						case "forecast":
							var queryText = "";
							for (var i=2; i < msgArray.length; i++) queryText += " " + msgArray[i]; queryText = queryText.trim();
							request.get(encodeURI(secrets.api.openWeatherMap.URL + "forecast?q=" + queryText + "&units=metric&appid=" + secrets.api.openWeatherMap.key), (error, response, data) => {
								if(response.statusCode == 200){
									var GETData = JSON.parse(data);
									var weatherEmbed = weather.embedForecast(GETData);
									msg.channel.send({embed: weatherEmbed});
								} else if(response.statusCode == 404){
									msg.channel.send(textDump.invalidProvince);
								} else{
									console.log("Open Weather Map" + response.statusCode);
									msg.channel.send("Weather forecast service " + textDump.down);
								}
							});
							break;
						default:
							var queryText = ""
							for (var i=1; i < msgArray.length; i++) queryText += " " + msgArray[i]; queryText = queryText.trim();
							request.get(encodeURI(secrets.api.openWeatherMap.URL + "weather?q=" + queryText + "&units=metric&appid=" + secrets.api.openWeatherMap.key), (error, response, data) => {
								if(response.statusCode == 200){
									var GETData = JSON.parse(data);
									var weatherEmbed = weather.embedNow(GETData);
									msg.channel.send({embed: weatherEmbed});
								}else if(response.statusCode == 404){
									msg.channel.send(textDump.invalidProvince);
								} else{
									console.log("Open Weather Map" + response.statusCode);
									msg.channel.send("Weather forecast service " + textDump.down);
								}
							});
						}
					}
				break;

//Wolfram. Return a simle text answer from WolframAlpha.
			case "wolfram":
				if(msgArray.length < 2){
					msg.channel.send("Invalid wolfram command. " + miniHelpText);
				} else {
					let queryText = ""
					for (var i=1; i < msgArray.length; i++) queryText += " " + msgArray[i]; queryText = queryText.trim();
					while(queryText.includes("+")) queryText = queryText.replace("+", "%2B");
					request.get(secrets.api.wolframAlpha.URL + "result?i=" + queryText + "&units=metric&appid=" + secrets.api.wolframAlpha.key, (error, response, data) => {
						if(response.statusCode == 200 || response.statusCode == 501){
							msg.channel.send({embed: wolfram.embedData(data, queryText)});
						} else{
							console.log("Wolfram" + response.statusCode);
							msg.channel.send("WolframAlpha " + textDump.down);
						}
					})
				}
				break;

//Dice. Return throw results as embed.
			case "dice":
				if(msgArray.length == 1){
					msg.channel.send({embed: dice.embedDie(msg)})
				} else {
					msg.channel.send({embed: dice.embedDice(msgArray.slice(1), msg)})
				}
				break;

//EOTL. Unknown command.
			default:
				msg.channel.send(helpText);
		}
	}
});

client.login(secrets.token)