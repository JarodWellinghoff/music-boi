const { SlashCommandBuilder } = require('@discordjs/builders');
// const { getPlayer, updatePlayer } = require('../update-Player');
// const { Player } = require('discord-player');
// const { players } = require('../index');
// const { players } = require('../events/client/interactionCreate');
// console.log(players);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song'),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);

		if (!queue || !queue.playing) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}

		const currentTrack = queue.current;
		const success = queue.skip();

		return void interaction.followUp({
			content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
		});
	},
};