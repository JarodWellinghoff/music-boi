const { GuildMember } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!interaction.isCommand() || !interaction.guildId) return;
		console.groupCollapsed('INTERACTION CREATE');
		console.log(interaction.toString());
		console.groupEnd();
		if (interaction.commandName === 'ping') return await command.execute(interaction);

		// if (interaction.commandName === 'fs') {
		// 	const roles = [];

		// 	interaction.member.roles.cache.some(role => {
		// 		roles.push(role.name);
		// 	});

		// 	if (!(roles.includes('DJ') || roles.includes('Admin') || roles.includes('Owner') || interaction.member.user.username === 'Skellinghoff')) {
		// 		return void interaction.reply({
		// 			content: '❌ | You\'re not an Admin, DJ, or Owner!',
		// 			ephemeral: true,
		// 		});
		// 	}
		// }

		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return void interaction.reply({
				content: 'You are not in a voice channel!',
				ephemeral: true,
			});
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return void interaction.reply({
				content: 'You are not in my voice channel!',
				ephemeral: true,
			});
		}

		try {
			await command.execute(interaction);
		}
		catch (err) {
			if (err) console.error(err);

			await interaction.reply({
				content: 'An error occurred while executing that command.',
				ephemeral: true,
			});
		}
	},
};
