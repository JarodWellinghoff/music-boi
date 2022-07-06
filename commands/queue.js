const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the queue'),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) return void interaction.followUp({ content: '❌ | No music is being played!' });
		const currentTrack = queue.current;
		const tracks = queue.tracks.slice(0, 10).map((m, i) => {
			return `${i + 1}. [**${m.title}**](${m.url})`;
		});

		return void interaction.followUp({
			embeds: [
				{
					title: 'Server Queue',
					description: `${tracks.join('\n')}${queue.tracks.length > tracks.length
						? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}`
						: ''
					}`,
					color: 0xff0000,
					fields: [{ name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})` }],
				},
			],
		});
	},
};