const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nightcore')
		.setDescription('Adds nightcore filter'),
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
			nightcore: !queue.getFiltersEnabled().includes("nightcore"),
			normalizer2: !queue.getFiltersEnabled().includes("nightcore") // because we need to toggle it with bass
		});

		return void interaction.followUp({ content: `🎵 | Nightcore ${queue.getFiltersEnabled().includes("nightcore") ? "Enabled" : "Disabled"}!` });
	}
};
