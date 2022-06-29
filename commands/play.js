const { SlashCommandBuilder } = require('@discordjs/builders');
// const { execute } = require('../helpers');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('play')
// 		.setDescription('Plays given YouTube videos in Voice Chat.')
// 		.addStringOption(option =>
// 			option.setName('search')
// 				.setDescription('YouTube url/search term')
// 				.setRequired(true)),
// 	async execute(interaction) {
// 		const search = interaction.options.getString('search');
// 		const response = await execute(interaction, search);
// 		console.log(response);
// 		interaction.reply({
// 			content: response,
// 			ephemeral: true,
// 		});
// 	},
// };
// const index = require('../index');
const { QueryType } = require('discord-player');
// const { players } = require('../index');
// const { players } = require('../events/client/interactionCreate');
// console.log(players);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song from youtube')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('The song you want to play')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const { player } = require('../index');
		// const { players } = require('../events/client/interactionCreate');
		// console.log(players);
		// const player = new Player(interaction.client);
		// const player = getPlayer();
		console.log(player);

		const query = interaction.options.get('query').value;
		const searchResult = await player
			.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			})
			.catch(err => {
				console.error(err);
			});
		if (!searchResult || !searchResult.tracks.length) {
			return void interaction.followUp({
				content: 'No results were found!',
			});
		}
		const queue = await player.createQueue(interaction.guild, {
			metadata: interaction.channel,
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch {
			void player.deleteQueue(interaction.guildId);
			return void interaction.followUp({
				content: 'Could not join your voice channel!',
			});
		}

		await interaction.followUp({
			content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...`,
		});
		searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
		if (!queue.playing) {
			await queue.play();
		}
		// updatePlayer(player);
		// console.log(interaction);
	},
};