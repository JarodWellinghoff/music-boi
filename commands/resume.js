const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const { player } = require('../index');

		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const paused = queue.setPaused(false);
		return void interaction.followUp({ content: !paused ? '❌ | Something went wrong!' : '▶ | Resumed!' });
	},
};
