import * as Discord from 'discord.js'
import fetch from 'node-fetch'
import * as main from '../index'
import { ChatInputCommand, Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';

export class StartCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			runIn: CommandOptionsRunTypeEnum.GuildText,
			requiredUserPermissions: ['ADMINISTRATOR']
		})
	}

	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder 
				.setName("start")
				.setDescription("Start Ybot")
		);

	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply()

		const wordlistreq = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt')
		if (!wordlistreq.ok) throw new Error(`Error: Failed to fetch wordlist, got status code ${wordlistreq.status}`)
		
		const wordlist = (await wordlistreq.text()).trim().split('\n')
		
		if (!interaction.guild) throw new Error("Error: Could not fetch guild!")
		await interaction.guild.channels.fetch()
		if (!interaction.member || !interaction.channel || !wordlist) throw new Error("Error: Failed to fetch member, channel, or wordlist")

		try {
			await interaction.editReply({ content: "Started!" })
			if (!(interaction.member instanceof Discord.GuildMember)) throw new Error("Error: Member is not a GuidMember, this shouldn't be possible but somehow it is.")
			await main.ybot.start(interaction.guild, interaction.user, interaction.channel, wordlist)
		} catch (error: any) {
			await interaction.editReply("Error while trying to run command: " + error.stack)
			console.log(error.stack)
		}
	}
}