/* ybot by smallketchup82 | Version 2 */
require("dotenv").config()
const Discord = require("discord.js")
const bot = new Discord.Client({ intents: 1585 })
const { readFile } = require("fs/promises")
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const Enmap = require("enmap")
const cliprog = require("cli-progress")
const chalk = require("chalk")

console.log("Initializing")

const db = new Enmap({
	name: "maindb",
})

const owners = process.env.OWNERS.toString().split(",")

bot.once("ready", () => {
	console.log(chalk.green(`Logged in as ${bot.user.tag} (${bot.user.id})!`))

	bot.user.setActivity(process.env.ACTIVITYTEXT || "the english dictionary", { type: process.env.ACTIVITYTYPE || "WATCHING" })
	console.log(chalk.green("Bot online!"))
})

var stop = false
var status = 0 // 0 = Idle | 1 = Working

bot.on("messageCreate", async message => {
	if (!owners.includes(message.author.id) || message.author.bot || message.author.system) return
	const args = message.content.slice("y!".length).trim().split(/ +/)

	switch (args[0].toLowerCase()) {
	case "start": {

		if (status == 1) { // Check if the bot is already running, if so then to not allow you to start it again. This is a measure to prevent discord api spam and to reduce ratelimits.
			try {
				message.author.send("Bot is already working")
			} catch {
				message.reply("Bot is already working").then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 10000)
				})
			}
		}

		// Get list of words from the words text file, ensure that the result is a string, and split the string at every new line, resulting in an array of strings which will be used as our words.
		const words = (await readFile("./words.txt")).toString().split("\n")

		// Create a progress bar and start it
		const bar = new cliprog.SingleBar({
			format: "{bar} {percentage}% | {value}/{total} messages | ETA: {eta_formatted} | Enlapsed: {duration_formatted}",
			barCompleteChar: "\u2588",
			barIncompleteChar: "\u2591",
			clearOnComplete: true,
		})
		bar.start(words.length, 0)

		// Inform user that it was started
		try {
			message.author.send("Started!")
		} catch {
			message.reply("Started!").then(msg => {
				setTimeout(() => {
					msg.delete()
				}, 10000)
			})
		}

		message.delete() // Defer message deleting to after reply functions have passed.

		var outsideindex
		// Run a for loop for each word in the words array.
		for (const [index, word] of words.entries()) {
			if (stop) { // If the stop variable has the value of true, then to change the value back to false and also end the for loop.
				stop = false
				status = 0
				break
			}
			const savedindex = db.ensure("savedindex", 0) // Check if the key in the database exists, if not then to create it with the default value of 0. If it does exist, then to fetch the value of it.
			if (savedindex > 0 && index <= savedindex) { // Check if the index saved in the database has existing progress (if its larger than 0), if so then the if statement checks
				continue
			}

			if (process.env.DELAY && process.env.DELAY !== false && process.env.DELAY > 0 && process.env.DELAY < 30 && !isNaN(process.env.DELAY)) { // Allow setting a delay for sending messages, this will result in the process being slower but might be favorable if you want to avoid API spam or want the bot to send messages smoother.
				await wait(process.env.DELAY * 1000)
			}
			const yword = "y" + word.toString()
			await message.channel.send(yword) // Send the message and wait for Discord's API to confirm that it sent. This is useful because we don't want the bot to send every word at the same time, but rather one by one.
			db.set("savedindex", index) // Save the current index in the database so that if the bot suddenly restarts it can recover its progress.
			if (index === words.length - 1) { // Check if this is the last iteration and reset database if so.
				db.set("savedindex", 0)
			}
			bar.increment()
			outsideindex = index
		}
		bar.stop()
		console.log(`Finished sending ${outsideindex.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} words!`)
		break
	}

	case "stop": {
		if (status !== 1) {
			try {
				message.author.send("ybot is not currently active")
			} catch {
				message.reply("ybot is not currently active").then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 10000)
				})
			}
		}
		if (!stop) {
			stop = true
			try {
				message.author.send("Stopped!")
			} catch {
				message.reply("Stopped!").then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 10000)
				})
			}
		} else {
			try {
				message.author.send("Bot stop variable is true, can indicate possible stop error. Try again in a bit or stop process via terminal")
			} catch {
				message.reply("Bot stop variable is true, can indicate possible stop error. Try again in a bit or stop process via terminal").then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 10000)
				})
			}
		}
		message.delete()
		break
	}

	case "reset": {
		if (status !== 0) {
			try {
				message.author.send("ybot is currently running, please stop it to reset the database.")
			} catch {
				message.reply("ybot is currently running, please stop it to reset the database.").then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 10000)
				})
			}
		}
		await db.ensure("savedindex", 0)
		await db.set("savedindex", 0)
		try {
			message.author.send("Reset the database! Bot will now start at index 0")
		} catch {
			message.reply("Reset the database! Bot will now start at index 0").then(msg => {
				setTimeout(() => {
					msg.delete()
				}, 10000)
			})
		}
		message.delete()
		break
	}
	}
})

bot.login(process.env.TOKEN)
