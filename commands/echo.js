const { AudioFilters } = require("discord-player");
AudioFilters.define("echo", "aecho=0.8:0.9:1000:0.3");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Adds echo filter'),
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
			"echo": !queue.getFiltersEnabled().includes("echo"),
		});

		return void interaction.followUp({ content: `🎵 | Echo ${queue.getFiltersEnabled().includes("echo") ? "Enabled" : "Disabled"}!` });
	}
};
