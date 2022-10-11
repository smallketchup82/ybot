// Version 3.0.1
import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'
import chalk from 'chalk'
import fs from 'fs'
import Database from 'better-sqlite3'
import { SapphireClient, LogLevel } from '@sapphire/framework'
dotenv.config()

const verbose = !process.env.VERBOSE === true

export var status: any = {}

class Ybot {
	async main() {

	}

	async start(server: Discord.Guild, user: Discord.User, channel: Discord.TextBasedChannel | Discord.TextChannel, wordlist: string[]) {
		const ensure = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='savedindex'").get()
		if (!ensure) throw new Error("Error: Database not found!")

		var progress = 0

		// Some db work
		const one = db.prepare(`SELECT count(*) FROM savedindex WHERE guild = ${server.id.toString()} AND channel = ${channel.id.toString()}`).get()
		if (one['count(*)'] === 0) {
			db.prepare(`INSERT INTO savedindex VALUES(${server.id.toString()}, ${channel.id.toString()}, 0)`).run();
		}

		const fetchprogress = db.prepare(`SELECT progress FROM savedindex WHERE guild = ${server.id.toString()} AND channel = ${channel.id.toString()}`).get()
		if (fetchprogress && fetchprogress.progress > 0) progress = fetchprogress.progress

		status[`${server.id}-${channel.id}`] = 1

		for (const [index, word] of wordlist.entries()) {
			if (status[`${server.id}-${channel.id}`] === 0) {
				delete status[`${server.id}-${channel.id}`]
				break
			}
			
			if (progress > 0 && index <= progress) {
				continue
			}

			await channel.send("y" + word.toString().trim())
			db.prepare(`UPDATE savedindex SET progress = ${index} WHERE guild = ${server.id.toString()} AND channel = ${channel.id.toString()}`).run()

			if (index === wordlist.length - 1) {
				db.prepare(`DELETE FROM savedindex WHERE guild = ${server.id.toString()} AND channel = ${channel.id.toString()}`).run()
			}
			if (verbose) console.log("index: " + index)
		}

		return `Done!`
	}
	
	async stop(server: Discord.Guild, user: Discord.User, channel: Discord.TextBasedChannel, hard: boolean | null) {
		if (hard) {
			db.prepare(`delete from savedindex where guild = ${server.id.toString()} and channel = ${channel.id.toString()}`).run()
		}

		status[`${server.id}-${channel.id}`] = 0
		return `Success`
	}
}

export const db = new Database('database.db', { verbose: verbose ? console.log : undefined })
const bot = new SapphireClient({ intents: 37424, logger: { level: verbose ? LogLevel.Debug : LogLevel.Info } })


export let ybot: Ybot;
bot.once('ready', async () => {
    console.log(chalk.greenBright(`Bot Online!\nLogged in as ${bot.user?.tag}`))
	db.prepare('create table if not exists savedindex (guild TEXT NOT NULL, channel TEXT NOT NULL, progress INT)').run()
	bot.user?.setActivity('the english dictionary', { type: 'WATCHING' })
	ybot = new Ybot()

	// Check if the channels exist, if not, delete them. This should free space on the database
	const channels = db.prepare('SELECT guild, channel FROM savedindex').all();

	for (const key of channels) {
		await bot.guilds.fetch()
		const guild = bot.guilds.cache.get(key.guild.toString())
		if (!guild) {
			db.prepare('DELETE FROM savedindex WHERE guild = ?').run(key.guild.toString())
			return
		}

		await guild.channels.fetch();
		if (!guild.channels.cache.has(key.channel)) {
			db.prepare('DELETE FROM savedindex WHERE guild = ? AND channel = ?').run(key.guild.toString(), key.channel.toString())
			return
		}
	}
})

bot.login(process.env.TOKEN)
