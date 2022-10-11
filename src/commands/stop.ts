import * as Discord from 'discord.js'
import * as main from '../index'
import { Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';

export class StopCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, {
			...options,
			runIn: CommandOptionsRunTypeEnum.GuildText,
			requiredUserPermissions: ['ADMINISTRATOR'],
		})
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder 
				.setName("stop")
				.setDescription("Stop or pause the process")
				.addBooleanOption((bool) => bool
					.setName('hard')
					.setDescription('Reset the progress')
					.setRequired(false))
		);

	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		await interaction.deferReply()
		const hardstop = interaction.options.getBoolean('hard')


		if (!interaction.guild) throw new Error("Error: Could not fetch guild!")
		await interaction.guild.channels.fetch()
		if (!interaction.channel) throw new Error(`Error: Could not fetch guild!`)

		await main.ybot.stop(interaction.guild, interaction.user, interaction.channel, hardstop)

		await interaction.editReply(hardstop ? 'Stopped and reset progress!' : 'Paused!')
	}
}