# twilight-bot 
An easy to modify Discord bot whose functionality is separated into independent and interchangeable modules.

### Under Development
Uses "$" as command prefix by default.

### Dependencies: 
`Discord.js` `Cheerio` `request`

### Commands: 
 - `dice` or `dice ((^(\-?[0-9]{0,3}d[1-9][0-9]{0,2})$)|(^((\+|-)[0-9]{1,3})$)){0-10}` throws dice and returns results as embed.
 - `help` get help.
 - `prefix` or `prefix [non-alphanumeric]` view or change Guild's command prefix.
 - `lyrics [artist or track name]` scrapes the song's lyrics from Genius.com then returns them as embed.
 - `weather [region]` or `weather forecast [region]` returns the weather data acquired from Open Weather Map API as embed. 
 - `wolfram [question]` sends the answer acquired from Wolfram|Alpha Short Answer API as embed.
