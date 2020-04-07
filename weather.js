const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("./src/dump.json"));
const secrets = JSON.parse(fs.readFileSync("./src/secrets.json"));

module.exports = {
	embedNow: function (GETData) {
	  return embedNow(GETData);
	},
	embedForecast: function (GETData) {
	  return embedForecast(GETData);
	}
};

//Input-> time: Date object. Return-> The hour and the minute as string. Format: "05.67"
function dateToText(time){
	var hours = time.getHours() < 10 ? '0' + time.getHours(): time.getHours();
	var minutes = time.getMinutes() < 10 ? '0' + time.getMinutes(): time.getMinutes();
	return hours + "." + minutes;
}

//Input-> GETData: Object acquired from Weather Data Map Current Weather API. Return-> Discord.js embed object.
function embedNow(GETData){
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
			icon_url: secrets.api.openWeatherMap.iconURL
		}
	}
	return weatherEmbed;
}

//Input-> GETData: Object acquired from Weather Data Map Weather Forecast API. Return-> Discord.js embed object.
function embedForecast(GETData){
	var day= []
	var nextDayIndex = (24 - parseInt(GETData.list[0].dt_txt.slice(11, 13)))/3;
	for(i=0; i<4; i++){
		day.push(getDayWeather(GETData, nextDayIndex));
		nextDayIndex += 8;
	}
	console.log(day);
	var weatherEmbed = {
		color: 0x00cbb0,
		author: {
			name: "Twilight Bot",
			icon_url: dump.botIconURL,
		},
		title: 'Weather Forecast for "' + GETData.city.name + '"',
		fields: [
			{
				name: "Tomorrow:",
				value: "Weather: " + day[0].weather + "\nMax. Temperature: " + day[0].tempHigh + " C°\nMin. Temperature: " + day[0].tempLow + " C°\nCloud Coverage: " + day[0].cloudsLow + "-" + day[0].cloudsHigh + " %",
				inline: true
			},
			{
				name: day[1].date,
				value: "Weather: " + day[1].weather + "\nMax. Temperature: " + day[1].tempHigh + " C°\nMin. Temperature: " + day[1].tempLow + " C°\nCloud Coverage: " + day[1].cloudsLow + "-" + day[1].cloudsHigh + " %",
				inline: true
			},
			{
				name: "\u200b",
				value: "\u200b",
				inline: false
			},
			{
				name: day[2].date,
				value: "Weather: " + day[2].weather + "\nMax. Temperature: " + day[2].tempHigh + " C°\nMin. Temperature: " + day[2].tempLow + " C°\nCloud Coverage: " + day[2].cloudsLow + "-" + day[2].cloudsHigh + " %",
				inline: true
			},
			{
				name: day[3].date,
				value: "Weather: " + day[3].weather + "\nMax. Temperature: " + day[3].tempHigh + " C°\nMin. Temperature: " + day[3].tempLow + " C°\nCloud Coverage: " + day[3].cloudsLow + "-" + day[3].cloudsHigh + " %",
				inline: true
			}
		],
		footer: {
			text: 'Weather data acquired from Open Weather Map',
			icon_url: secrets.api.openWeatherMap.iconURL
		}
	}
	return weatherEmbed
}

function getDayWeather(GETData, nextDayIndex){
	var weatherId = 0
	var submitData = {
		date: GETData.list[nextDayIndex].dt_txt.slice(0, 10),
		tempHigh: -200,
		tempLow: 200,
		cloudsHigh: -100,
		cloudsLow: 200,
		weather: "NaN",
		weatherIcon: "NaN"
	}
	for(k=0; k<8; k++){
		submitData.tempHigh = submitData.tempHigh < GETData.list[nextDayIndex + k].main.temp_max ? GETData.list[nextDayIndex + k].main.temp_max: submitData.tempHigh;
		submitData.tempLow = submitData.tempLow < GETData.list[nextDayIndex + k].main.temp_min ? submitData.tempLow: GETData.list[nextDayIndex + k].main.temp_min;
		submitData.cloudsHigh = submitData.cloudsHigh < GETData.list[nextDayIndex + k].clouds.all ? GETData.list[nextDayIndex + k].clouds.all: submitData.cloudsHigh;
		submitData.cloudsLow = submitData.cloudsLow < GETData.list[nextDayIndex + k].clouds.all ? submitData.cloudsLow: GETData.list[nextDayIndex + k].clouds.all;
		if(parseInt(GETData.list[nextDayIndex + k].weather[0].icon.slice(0,2)) > weatherId){
			weatherId = parseInt(GETData.list[nextDayIndex + k].weather[0].icon.slice(0,2));
			submitData.weather = GETData.list[nextDayIndex + k].weather[0].main;
			submitData.weatherIcon = GETData.list[nextDayIndex + k].weather[0].icon;
		}
		if(submitData.cloudsHigh < 25 && submitData.weather == "Clouds"){
			submitData.weather = "Clear";
		}
	}
	return submitData;
}
