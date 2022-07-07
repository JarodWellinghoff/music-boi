const { SlashCommandBuilder } = require('@discordjs/builders');

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

function secondsToTimeStamp(endTime, seconds) {
	const hour = 3600;
	if (endTime >= hour) {
		return new Date(seconds * 1000).toISOString().slice(11, 19);
	}
	else {
		return new Date(seconds * 1000).toISOString().slice(14, 19);
	}
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('scrub')
		.setDescription('Scrubs the time in the current song')
		.addNumberOption(option =>
			option.setName('seconds')
				.setDescription('Seconds to scrub')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const { player } = require('../index');
		const seek = interaction.options.get('seconds').value;
		const queue = player.getQueue(interaction.guildId);

		if (!queue || !queue.playing) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}

		const currentTrack = queue.current;
		const timeStamp = queue.getPlayerTimestamp();
		const currentTime = timeStampToSeconds(timeStamp.current);
		const endTime = timeStampToSeconds(timeStamp.end);
		const timeRemaining = endTime - currentTime;
		const newTime = currentTime + seek;

		if (newTime >= timeRemaining) {
			const success = queue.skip();
			return void interaction.followUp({
				content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
			});
		}
		else if (newTime <= 0) {
			const success = await queue.seek(0);
			return void interaction.followUp({
				content: success ? `✅ | Started **${currentTrack}** over!` : '❌ | Something went wrong!',
			});
		}
		else {
			const success = await queue.seek(newTime * 1000);
			return void interaction.followUp({
				content: success ? `✅ | Scrubed **${currentTrack}** to ${secondsToTimeStamp(endTime, newTime)}!` : '❌ | Something went wrong!',
			});
		}
	},
};