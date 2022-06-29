const { SlashCommandBuilder } = require('@discordjs/builders');
// const { updatePlayer, getPlayer } = require('../update-Player');
// const { Player } = require('discord-player');
// const { players } = require('../index');
// const { players } = require('../events/client/interactionCreate');
// console.log(players);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the player'),
	async execute(interaction) {
		await interaction.deferReply();
		const { player } = require('../index');
		// const { players } = require('../events/client/interactionCreate');
		// console.log(players);
		// const player = new Player(interaction.client);
		// const player = players.get(interaction.guildId);
		// const player = getPlayer();
		// console.log(interaction);
		const queue = player.getQueue(interaction.guildId);
		if (!queue || !queue.playing) {
			return void interaction.followUp({ content: '❌ | No music is being played!' });
		}
		queue.destroy();
		// updatePlayer(player);
		return void interaction.followUp({ content: '🛑 | Stopped the player!' });

	},
};