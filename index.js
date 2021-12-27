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
                var channel = message.mentions.channels.first();

                if (!args[1] || channel) {
                    channel = message.channel
                }
                const words = await (await readFile('words.txt')).toString().split('\n')

                words.forEach((word, index) => {
                    setTimeout(() => {
                        const yword = "y" + word.toString()
                        channel.send(yword)
                        console.log("Sent " + yword)
                    }, 1000 * index);
                })
            break;

        case 'stop':
            process.exit();
            break;

    }
})



bot.login('OTI0OTIzMDg5NzY5MzQ5MTIx.YclnwA.K8DB4tsI9bru0s4Yy7O11vrEK1E')