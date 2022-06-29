const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const { player } = require('../index');

		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			interaction.followUp({ content: '❌ | No music is being played!' });
		}
		else {
			const paused = queue.setPaused(true);
			interaction.followUp({ content: paused ? '⏸ | Paused!' : '❌ | Something went wrong!' });
		}

	},
};
