const fs = require("fs");

const dump = JSON.parse(fs.readFileSync("./src/dump.json"));


module.exports = {
	main: (msgArray, msg) => {
		main(msgArray, msg);
	},
};


//WRAPPER FUNCTION
function main(msgArray, msg){
	if (msgArray.length == 1) {
		die(msg);
	} else {
		dice(msgArray.slice(1), msg);
	}
}

//Input-> msg: Discord.js msg object. Return-> None.
//Throws a die. Sends the result as embed.
function die(msg){
	var roll = Math.ceil(Math.random()*6).toString();
	var rollText = roll == 6 ? {footer:{text: "Rolled a " + roll + ". Nice one!"}}: {footer:{text: "Rolled a " + roll + "."}};
	var rollText = roll == 1 ? {footer:{text: "Rolled a " + roll + ". Nice 1!"}}: rollText;
	msg.channel.send({embed: {...{
			color: 0x00cbb0,
			author: {
				name: "Twilight Bot",
				icon_url: dump.botIconURL,
			},
			title: "Rolling for " + msg.author.username + "...",
			image: {
				url: dump.diceURL[roll],
			},
		}, ...rollText}
	});
}

//Input-> queryInput: user input - command, msg: Discord.js msg object. Return-> None.
//First checks each element in the array if they are a valid input via Regex. Then throws the dice accordingly. After that applies the modifiers. And finally sends the data as Discord.js embed object.
function dice(queryInput, msg){
	var miniHelpText = "For help, type '" + dump.commandChar + "help' or '" + dump.commandChar + "help [command]'.";
	var HALEmbed = {
		color: 0x00cbb0,
		author: {
			name: "HAL 9000",
			icon_url: dump.HALIconURL,
		},
		title: "I'm sorry " + msg.author.username + ", I'm afraid I can't do that.",
		description: "I think you know what the problem is just as well as I do.",
		footer: {
			text: miniHelpText
		}
	}
	if(queryInput.length > 10){
		msg.channel.send({
			embed: HALEmbed
		});
	} else{
		var uniqueQueries = []; var queries = {}; var sumQueries= [];
		for(var i = 0; i < queryInput.length; i++){
			var query = []; 
			if(/^(\-?[0-9]{0,3}d[1-9][0-9]{0,2})$/.test(queryInput[i].replace(/^\++/g, ""))){
				query = queryInput[i].replace(/^\++/g, "").split("d");
				if(query[0][0] == "-"){
					if(uniqueQueries.includes("-" + query[1])){
						queries["-" + query[1]] = queries[query[1]] + parseInt(query[0].slice(1));
					} else{
						uniqueQueries.push("-" + query[1]);
						queries["-" + query[1]] = parseInt(query[0].slice(1));
					}
				} else{
					if(uniqueQueries.includes(query[1])){
						queries[query[1]] = queries[query[1]] + parseInt(query[0]);
					} else{
						uniqueQueries.push(query[1]);
						queries[query[1]] = parseInt(query[0]);
					}
				}
			} else if(/^((\+|-)[0-9]{1,3})$/.test(queryInput[i])){
				sumQueries.push(" " + queryInput[i]);
			} else {
				msg.channel.send({
					embed: HALEmbed
				});
			}
		}
		if(uniqueQueries.length == 0){
			msg.channel.send({
				embed: HALEmbed
			});
		}
		uniqueQueries = uniqueQueries.sort((a, b) => a - b);
		var fields = []; var sum = 0; var numberOfDice = 0;
		for(var i = 0; i<uniqueQueries.length; i++){
			if(queries[uniqueQueries[i]]>100){
				msg.channel.send({
					embed: HALEmbed
				});
			}
		}
		for(var i = 0; i<uniqueQueries.length; i++){
			numberOfDice += parseInt(queries[uniqueQueries[i].toString()]);
			var roll = 0;
			var rollArray = [];
			var uniqueSum = 0;
			for(var k = 0; k<queries[uniqueQueries[i].toString()]; k++){
				roll = Math.ceil(Math.random() * uniqueQueries[i]);
				if(uniqueQueries[i] < 0){
					roll --;
				}
				uniqueSum += roll;
				sum += roll;
				rollArray.push(" " + roll.toString());
			}
			fields.push({
				name: queries[uniqueQueries[i].toString()] + "d" + uniqueQueries[i].toString() + ". Total: " + uniqueSum,
				value: rollArray.toString(),
				inline: false
			});
		}
		var sumQueriesSum = 0;
		for(var i = 0; i < sumQueries.length; i++){
			sumQueriesSum += parseInt(sumQueries[i]);
		}
		sum += sumQueriesSum;
		if(sumQueries.length > 0){
			fields.push({
				name: "Modifiers. Total: " + sumQueriesSum,
				value: sumQueries.toString(),
				inline: false
			});
		}
		msg.channel.send({
			embed: {
				color: 0x00cbb0,
				author: {
					name: "Twilight Bot",
					icon_url: dump.botIconURL,
				},
				title: "Rolled for " + msg.author.username + ".",
				description: "Rolled " + numberOfDice + " dice. Total: " + sum,
				fields: fields,
				thumbnail: {
					url: dump.d20IconURL,
				},
				footer: {
					text: miniHelpText
				}
			}
		});
	}
}