const { SlashCommandBuilder } = require('@discordjs/builders');
const page_size = 10;

function timeStampToSeconds(timestamp) {
	const semi_count = (timestamp.match(/:/g) || []).length;
	const t = timestamp.split(':');

	let seconds = parseInt(t[semi_count]);
	const minutes = parseInt(t[semi_count - 1]);
	seconds += minutes * 60;

	if (semi_count >= 2) {
		const hours = parseInt(t[semi_count - 2]);
		seconds += hours * 60 * 60;
		if (semi_count >= 3) {
			const days = parseInt(t[semi_count - 3]);
			seconds += days * 24 * 60 * 60;
		}
	}
	return seconds;
}

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
		const no_of_pages = Math.floor(queue.tracks.length / page_size);
		const last_page_item_quantity = queue.tracks.length % page_size;
		const pages = [];
		let page = 0;
		let timeStamp = queue.getPlayerTimestamp();
		let endTime = timeStampToSeconds(timeStamp.end);
		let currentTime = timeStampToSeconds(timeStamp.current);


		for (let i = 0; i <= no_of_pages; i++) {
			let tracks;
			if (i === no_of_pages) {
				tracks = queue.tracks.slice(no_of_pages * 10, (no_of_pages * 10) + last_page_item_quantity).map((m, j) => {
					return `${(j + (no_of_pages * 10)) + 1}. [**${m.title}**](${m.url})`;
				});
			}
			else {
				tracks = queue.tracks.slice(i * 10, 10 * (i + 1)).map((m, j) => {
					return `${(j + (i * 10)) + 1}. [**${m.title}**](${m.url})`;
				});
			}
			pages.push(tracks);
		}

		console.log(pages);
		const message = await interaction.followUp({
			content: pages.length == 1 ? '' : `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
			embeds: [
				{
					title: pages.length == 1 ? 'Server Queue' : `Server Queue (${page + 1}/${pages.length})`,
					description: `${pages[0].join('\n')}${queue.tracks.length > page_size
						? `\n...${queue.tracks.length - pages[0].length === 1 ? `${queue.tracks.length - pages[0].length} more track` : `${queue.tracks.length - pages[0].length} more tracks`}`
						: ''}`,
					color: 0xff0000,
					fields: [{ name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})` }],
				},
			],
		});

		if (no_of_pages > 0) {
			const filter = (reaction, user) => {
				return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
			};
			message.react('⬅️').then(() => message.react('➡️'));
			const collector = message.createReactionCollector({ filter, max: 10, time: endTime * 1000, errors: ['time'], dispose: true });

			collector.on('collect', (reaction) => {
				timeStamp = queue.getPlayerTimestamp();
				endTime = timeStampToSeconds(timeStamp.end);
				currentTime = timeStampToSeconds(timeStamp.current);
				if (reaction.emoji.name === '➡️' && page < pages.length - 1) {
					page++;
				}
				else if (reaction.emoji.name === '⬅️' && page > 0) {
					page--;
				}
				message.edit({
					content: `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
					embeds: [
						{
							title: `Server Queue (${page + 1}/${pages.length})`,
							description: `${pages[page].join('\n')}${queue.tracks.length > (page_size * (page + 1))
								? `\n...${queue.tracks.length - (page_size * (page + 1)) === 1 ? `${queue.tracks.length - (page_size * (page + 1))} more track` : `${queue.tracks.length - (page_size * (page + 1))} more tracks`}`
								: ''}`,
							color: 0xff0000,
							fields: [{ name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})` }],
						},
					],
				});
			});

			collector.on('remove', (reaction) => {
				timeStamp = queue.getPlayerTimestamp();
				endTime = timeStampToSeconds(timeStamp.end);
				currentTime = timeStampToSeconds(timeStamp.current);
				if (reaction.emoji.name === '➡️' && page < pages.length - 1) {
					page++;
				}
				else if (reaction.emoji.name === '⬅️' && page > 0) {
					page--;
				}
				message.edit({
					content: `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
					embeds: [
						{
							title: `Server Queue (${page + 1}/${pages.length})`,
							description: `${pages[page].join('\n')}${queue.tracks.length > (page_size * (page + 1))
								? `\n...${queue.tracks.length - (page_size * (page + 1)) === 1 ? `${queue.tracks.length - (page_size * (page + 1))} more track` : `${queue.tracks.length - (page_size * (page + 1))} more tracks`}`
								: ''}`,
							color: 0xff0000,
							fields: [{ name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})` }],
						},
					],
				});
			});

			collector.on('end', () => {
				message.edit('**Queue scrolling timed out**');
				message.reactions.removeAll()
					.catch(error => console.error('Failed to clear reactions:', error));
			});
		}
	},
};