const { SlashCommandBuilder } = require('@discordjs/builders');
const MESSAGE_CHAR_LIMIT = 2000;

const splitString = (string, prepend = '', append = '') => {
	if (string.length <= MESSAGE_CHAR_LIMIT) {
		return [string];
	}

	const splitIndex = string.lastIndexOf('\n', MESSAGE_CHAR_LIMIT - prepend.length - append.length);
	const sliceEnd = splitIndex > 0 ? splitIndex : MESSAGE_CHAR_LIMIT - prepend.length - append.length;
	const rest = splitString(string.slice(sliceEnd), prepend, append);

	return [`${string.slice(0, sliceEnd)}${append}`, `${prepend}${rest[0]}`, ...rest.slice(1)];
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See the queue'),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const q = player.getQueue(interaction.guildId).toString();
		const split_q = splitString(q);

		for (let i = 0; i < split_q.length; i++) {
			await interaction.followUp({
				content: `${split_q[i]}`,
			});
		}
	},
};