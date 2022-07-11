const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bassboost')
		.setDescription('Adds bassboost filter'),
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
			bassboost_high: !queue.getFiltersEnabled().includes("bassboost_high"),
			normalizer2: !queue.getFiltersEnabled().includes("bassboost_high") // because we need to toggle it with bass
		});

		return void interaction.followUp({ content: `🎵 | Bassboost ${queue.getFiltersEnabled().includes("bassboost_high") ? "Enabled" : "Disabled"}!` });
	}
};