const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears current queue'),
	async execute(interaction) {

		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);

		if (!queue || !queue.playing) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}

		queue.clear();
		return void interaction.followUp({
			content: '✅ | Queue cleared!',
		});
	},
};