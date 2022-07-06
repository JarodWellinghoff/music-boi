const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('fs')
		.setDescription('Force Skip'),
	async execute(interaction) {

		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);

		if (!queue || !queue.playing) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}

		const currentTrack = queue.current;
		const success = queue.skip();
		return void interaction.followUp({
			content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
		});
	},
};