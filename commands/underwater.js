const { AudioFilters } = require("discord-player");
AudioFilters.define("underwater", "firequalizer=gain='if(lt(f,1000), 0, -INF)'");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('underwater')
		.setDescription('Adds underwater filter'),
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
			"underwater": !queue.getFiltersEnabled().includes("underwater"),
		});

		return void interaction.followUp({ content: `🎵 | Underwater ${queue.getFiltersEnabled().includes("underwater") ? "Enabled" : "Disabled"}!` });
	}
};