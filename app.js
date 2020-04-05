const Discord = require("discord.js");
const http = require("http");
const fs = require("fs");

const secrets = JSON.parse(fs.readFileSync("src/secrets.json"))
const textDump = JSON.parse(fs.readFileSync("src/textDump.json"))
const dump = JSON.parse(fs.readFileSync("src/dump.json"))

const client = new Discord.Client();
const commandChar = dump.defaultCommandChar;

const helpText = "Unknown command. For help, type '"+ commandChar +"help' or '"+ commandChar +"help [command]'.";
const miniHelpText = "For help, type '"+ commandChar +"help' or '"+ commandChar +"help [command]'.";

client.on("ready", ()=>{
	console.log("Twilight Bot is ready to roll!")
})

client.on("message", msg =>{
//Main function
	if (msg.content.trim()[0] === commandChar){
		var msgArray =  msg.content.trim().slice(1).split(" ")
		console.log(msgArray)
		switch (msgArray[0].toLowerCase()){

// Help. Return text from "textDump".
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

// Weather. Return data from Open Weather Map API
			case "weather":
				if(msgArray.length < 2){
					msg.channel.send("Unknown weather command. " + miniHelpText)
				} else{
					switch (msgArray[1]){
						case "forecast":
							http.get(secrets.api.openWeatherMap.url + "forecast?q=" + msgArray[1] + "&units=metric&appid=" + secrets.api.openWeatherMap.key, (response) => {
								if(response.statusCode == 200){
									response.on("data", (data) => {
										var GETData = JSON.parse(data);
										//TODO: RETURN EMBED OR MESSAGE
									})
								} else{
									msg.channel.send(weatherDownText)
								}
							});
							break;
						default:
							var provinceQueryText = ""
							for (var i=1; i < msgArray.length; i++) provinceQueryText += " " + msgArray[i];
							http.get(secrets.api.openWeatherMap.url + "weather?q=" + provinceQueryText.trim() + "&units=metric&appid=" + secrets.api.openWeatherMap.key, (response) => {
								if(response.statusCode == 200){
									response.on("data", (data) => {
										var GETData = JSON.parse(data);
										console.log(new Date().getTimezoneOffset())
										var sunriseText = dateToText(new Date((GETData.sys.sunrise + GETData.timezone + new Date().getTimezoneOffset() * 60) * 1000));
										var sunsetText = dateToText(new Date((GETData.sys.sunset + GETData.timezone + new Date().getTimezoneOffset() * 60) * 1000));
										var GMTText = GETData.timezone < 0 ? (GETData.timezone / 3600).toString(): "+" + (GETData.timezone / 3600).toString();
										var weatherEmbed = {
											color: 0x00cbb0,
											author: {
												name: "Twilight Bot",
												icon_url: dump.botIconURL,
											},
											title: 'Current Weather in "' + GETData.name + '"',
											description: "Sunrise: " + sunriseText + " & Sunset: " + sunsetText + " (GMT" + GMTText + ")",
											fields: [
												{
													name: "Temperature",
													value: "Temperature: " + GETData.main.temp.toString() + " C° \nFeels Like: " + GETData.main.feels_like.toString() + " C°\nHumidity: " + GETData.main.humidity.toString() + "%",
													inline: false
												},
												{
													name: "Weather",
													value: "Weather: " + GETData.weather[0].main + "\nCloud Coverage: " + GETData.clouds.all.toString() + "%\nWind Speed: " + GETData.wind.speed.toString() + " km/h",
													inline: false
												},
											],
											image: {
												url: "http://openweathermap.org/img/wn/"+ GETData.weather[0].icon + "@2x.png",
											},
											footer: {
												text: 'Weather data acquired from Open Weather Map',
												icon_url: dump.botIconURL
											}
										}
										msg.channel.send({embed: weatherEmbed});
									})
								}else if(response.statusCode == 404){
									msg.channel.send("Make sure you have entered a valid province name.");
								} else{
									msg.channel.send(textDump.weatherDown)
								}
							});
						}
					}
				break;

// EOTL. Unknown command.
			default:
				msg.channel.send(helpText)
		}
	}
});

function dateToText(time){
	var hours = time.getHours() < 10 ? '0' + time.getHours(): time.getHours();
	var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes(): time.getMinutes()
	return hours + "." + minutes;
}

client.login(secrets.token)