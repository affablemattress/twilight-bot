const fs = require('fs');

const storage = JSON.parse(fs.readFileSync(__dirname + '/../src/storage.json'));

//WRAPPER FUNCTION
const main = async function (msgArray, msg, prefix) {
	if (msgArray.length == 1) {
		die(msg);
	} else {
		dice(msgArray.slice(1), msg, prefix);
	}
}

module.exports.main = main;

const die = function rollDieThenSendResult(msg) {
	let roll = Math.ceil(Math.random() * 6).toString();
	let rollText = "";
	rollText = roll == 6 
		? {
			footer: { text: `Rolled a ${roll} Nice one!` }
		} 
		: {
			footer: { text: `Rolled a ${roll}.` }
		};
	rollText = roll == 1 
		? {
			footer: { text: 'Rolled a ' + roll + '. Nice 1!' }
		}
		: rollText;
	msg.channel.send({
		embed: {
			...{
				color: 0x00cbb0,
				author: {
					name: 'Twilight Bot',
					icon_url: storage.botIconURL,
				},
				title: 'Rolling for ' + msg.author.username + '...',
				image: {
					url: storage.diceURL[roll],
				},
			}, 
			...rollText
		}
	});
}

const dice = function validateInputRollDiceApplyModifiersSendResult(queryInput, msg, prefix) {
	let HALEmbed = {
		color: 0x00cbb0,
		author: {
			name: 'HAL 9000',
			icon_url: storage.HALIconURL,
		},
		title: `I'm sorry ${msg.author.username}, I'm afraid I can't do that.`,
		description: 'I think you know what the problem is just as well as I do.',
		footer: {
			text: `For help, type '${prefix}help' or '${prefix}help [command]'.`
		}
	}
	if (queryInput.length > 10) {
		msg.channel.send({
			embed: HALEmbed
		});
	} else {
		let uniqueQueries = [];
		let queries = {};
		let sumQueries= [];

		queryInput.forEach((rawQuery) => {
			let query = [];
			if (/^(\-?[0-9]{0,3}d[1-9][0-9]{0,2})$/.test(rawQuery.replace(/^\++/g, ''))) {
				query = rawQuery.replace(/^\++/g, '').split('d');
				if (query[0][0] == '-') {
					if (uniqueQueries.includes('-' + query[1])) {
						queries['-' + query[1]] = queries[query[1]] + parseInt(query[0].slice(1));
					} else {
						uniqueQueries.push('-' + query[1]);
						queries['-' + query[1]] = parseInt(query[0].slice(1));
					}
				} else {
					if (uniqueQueries.includes(query[1])) {
						queries[query[1]] = queries[query[1]] + parseInt(query[0]);
					} else {
						uniqueQueries.push(query[1]);
						queries[query[1]] = parseInt(query[0]);
					}
				}
			} else if (/^((\+|-)[0-9]{1,3})$/.test(rawQuery)) {
				sumQueries.push(' ' + rawQuery);
			} else {
				msg.channel.send({
					embed: HALEmbed
				});
			}
		});

		if (uniqueQueries.length == 0) {
			msg.channel.send({
				embed: HALEmbed
			});
		}

		let fields = [];
		let sum = 0; 
		let numberOfDice = 0;

		uniqueQueries = uniqueQueries.sort((a, b) => a - b);
		uniqueQueries.forEach((uniqueQuery) => {
			if (queries[uniqueQuery] > 100) {
				msg.channel.send({
					embed: HALEmbed
				});
			}
		});

		uniqueQueries.forEach((uniqueQuery) => {
			numberOfDice += parseInt(queries[uniqueQuery.toString()]);
			let roll = 0;
			let rollArray = [];
			let uniqueSum = 0;
			for (let i = 0; i < queries[uniqueQuery.toString()]; i++) {
				roll = Math.ceil(Math.random() * uniqueQuery);
				if (uniqueQuery < 0) {
					roll--;
				}
				uniqueSum += roll;
				sum += roll;
				rollArray.push(' ' + roll.toString());
			}

			fields.push({
				name: `${queries[uniqueQuery.toString()]}d${uniqueQuery.toString()}. Total: ${uniqueSum}`,
				value: rollArray.toString(),
				inline: false
			});
		});

		if (sumQueries.length > 0) {
			let sumQueriesSum = 0;
			sumQueries.forEach((sumQuery) => {
				sumQueriesSum += parseInt(sumQuery)
			});
			sum += sumQueriesSum;
			fields.push({
				name: `Modifiers. Total: ${sumQueriesSum}`,
				value: sumQueries.toString(),
				inline: false
			});
		}

		msg.channel.send({
			embed: {
				color: 0x00cbb0,
				author: {
					name: 'Twilight Bot',
					icon_url: storage.botIconURL,
				},
				title: `Rolled for ${msg.author.username}.`,
				description: `Rolled ${numberOfDice} dice. Total: ${sum}`,
				fields: fields,
				thumbnail: {
					url: storage.d20IconURL,
				},
				footer: {
					text: `For help, type '${prefix}help' or '${prefix}help [command]'.`
				}
			}
		});
	}
}
