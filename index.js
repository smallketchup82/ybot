const Discord = require('discord.js')
const bot = new Discord.Client({ intents: 1585 })
const { readFile, writeFile } = require('fs/promises')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

bot.once('ready', () => {
    console.log("Logged in!")
})

bot.on('messageCreate', async message => {
    const args = message.content.slice("y!".length).trim().split(/ +/);

    switch (args[0].toLowerCase()) {
        case 'start':
                if (message.author.id !== "296052363427315713" || message.author.bot || message.author.system ) return;
                message.delete()
                var channel = message.mentions.channels.first();

                if (!args[1] || channel) {
                    channel = message.channel
                }
                const words = await (await readFile('./words.txt')).toString().split('\n')

                var i = 0;
                for ( let word of words ) {
                    const yword = "y" + word.toString()
                    await channel.send(yword)
                    console.log("Sent " + yword)
                }
            break;
        case 'stop':
	    if (message.author.bot || message.author.system || message.author.id !== "296052363427315713") return;
            message.delete();
            process.exit();
            break;
    }
})

const config = require("./config.json")
bot.login(config.token)
