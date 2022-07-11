const { AudioFilters } = require("discord-player");
AudioFilters.define("bitcrush", "acrusher=mix=1:samples=10");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bitcrush')
		.setDescription('Adds bitcrush filter'),
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
			"bitcrush": !queue.getFiltersEnabled().includes("bitcrush"),
		});

		return void interaction.followUp({ content: `🎵 | Bitcrush ${queue.getFiltersEnabled().includes("bitcrush") ? "Enabled" : "Disabled"}!` });
	}
};
