const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const FILTERS = [
	'bassboost_low',
	'bassboost',
	'bassboost_high',
	'8D',
	'vaporwave',
	'nightcore',
	'phaser',
	'tremolo',
	'vibrato',
	'reverse',
	'treble',
	'normalizer',
	'normalizer2',
	'surrounding',
	'pulsator',
	'subboost',
	'karaoke',
	'flanger',
	'gate',
	'haas',
	'mcompand',
	'mono',
	'mstlr',
	'mstrr',
	'compressor',
	'expander',
	'softlimiter',
	'chorus',
	'chorus2d',
	'chorus3d',
	'fadein',
	'dim',
	'earrape',
];

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
			bassboost: !queue.getFiltersEnabled().includes("bassboost"),
			normalizer2: !queue.getFiltersEnabled().includes("bassboost") // because we need to toggle it with bass
		});

		return void interaction.followUp({ content: `🎵 | Bassboost ${queue.getFiltersEnabled().includes("bassboost") ? "Enabled" : "Disabled"}!` });
	}
};
