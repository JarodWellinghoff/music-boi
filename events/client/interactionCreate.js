// const { Player } = require('discord-player');
// const fs = require('fs');
const { GuildMember } = require('discord.js');
// const { player } = require('../..');
// const { commands } = require('../../index');
// const players = new Map();

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		// console.log(players);
		if (!interaction.isCommand() || !interaction.guildId) return;

		if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
			return void interaction.reply({
				content: 'You are not in a voice channel!',
				ephemeral: true,
			});
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return void interaction.reply({
				content: 'You are not in my voice channel!',
				ephemeral: true,
			});
		}

		try {
			// if (!players.has(interaction.guildId)) {
			// 	const player = new Player(interaction.client);

			// 	// Dynamically add all events in the "./events" directory
			// 	const playerEventFiles = fs
			// 		.readdirSync('./events/player')
			// 		.filter(file => file.endsWith('.js'));

			// 	for (const file of playerEventFiles) {
			// 		// console.log(file);
			// 		// const event = require(`../events/player/${file}`);
			// 		const event = require(`../player/${file}`);

			// 		if (event.once) {
			// 			player.once(event.name, (...args) => event.execute(...args, commands));
			// 		}
			// 		else {
			// 			player.on(event.name, (...args) => event.execute(...args, commands));
			// 		}
			// 	}
			// 	players.set(interaction.guildId, player);
			// 	module.exports = {
			// 		players,
			// 	};
			// 	console.log(players);
			// }
			await command.execute(interaction);
		}
		catch (err) {
			if (err) console.error(err);

			await interaction.reply({
				content: 'An error occurred while executing that command.',
				ephemeral: true,
			});
		}
	},
};
