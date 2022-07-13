const { SlashCommandBuilder } = require('@discordjs/builders');

const { AudioFilters } = require("discord-player");
AudioFilters.define("echo", "aecho=0.8:0.9:1000:0.3");
AudioFilters.define("underwater", "firequalizer=gain='if(lt(f,1000), 0, -INF)'");
AudioFilters.define("bitcrush", "acrusher=mix=1:samples=10");
const FILTERS = [
	'echo',
	'underwater',
	'bitcrush',
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
	'earrape'
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addfilter')
		.setDescription('Sets a filter')
		.addStringOption(option =>
			option.setName('filter')
				.setDescription('The filter to add')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);
		const filter = interaction.options.get('filter').value;

		if (!queue || !queue.playing) {
			return void interaction.followUp({
				content: "❌ | No music is being played!"
			});
		}

		if (FILTERS.includes(filter))
		await queue.setFilters({
			bassboost_high: !queue.getFiltersEnabled().includes("bassboost_high"),
			normalizer2: !queue.getFiltersEnabled().includes("bassboost_high") // because we need to toggle it with bass
		});

		return void interaction.followUp({
			content: `🎵 | Bassboost ${queue.getFiltersEnabled().includes("bassboost_high") ? "Enabled" : "Disabled"}!`
		});
	}
};

