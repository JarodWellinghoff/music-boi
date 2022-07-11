const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vaporwave')
		.setDescription('Adds vaporwave filter'),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);

		if (!queue || !queue.playing) {
			return void interaction.followUp({
				content: "❌ | No music is being played!"
			});
		}
		await queue.setFilters({
			vaporwave: !queue.getFiltersEnabled().includes("vaporwave"),
			normalizer2: !queue.getFiltersEnabled().includes("vaporwave") // because we need to toggle it with bass
		});
		console.log(queue.getFiltersEnabled(), queue.getFiltersDisabled());
		return void interaction.followUp({ content: `🎵 | Vaporwave ${queue.getFiltersEnabled().includes("vaporwave") ? "Enabled" : "Disabled"}!` });
	}
};
