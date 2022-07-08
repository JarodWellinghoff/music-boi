const { SlashCommandBuilder } = require('@discordjs/builders');


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

		let listener_count = interaction.member.voice.channel.members.size - 1;
		let majority = Math.ceil(listener_count / 2);
		const currentTrack = queue.current;
		const skipper = interaction.member.user.username;


		if (listener_count > 1) {

			const message = await interaction.followUp({
				content: `skip? [1/${majority}]`,
			});
			message.react('✅');
			const filter = (reaction, user) => {
				console.log(skipper);
				console.log(user.username);
				console.log(['✅'].includes(reaction.emoji.name));
				console.log(user.id === interaction.user.id);
				console.log(skipper === user.username);
				return ['✅'].includes(reaction.emoji.name) && user.id === interaction.user.id;
			};
			//  && skipper !== interaction.user.id
			message.awaitReactions({ filter, max: listener_count, time: 60000, errors: ['time'] })
				.then(collected => {
					console.log('Reaction');
					console.log(skipper);
					listener_count = interaction.member.voice.channel.members.size - 1;
					majority = Math.ceil(listener_count / 2);
					const reaction = collected.first();
					const vote = collected.size + 1;

					if (reaction.emoji.name === '✅') {
						message.edit(`skip? [${vote}/${majority}]`);
					}
					if (vote >= majority) {
						const success = queue.skip();
						return message.reply({
							content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
						});
					}
				})
				.catch(() => {
					message.edit('Voting timed out');
				});
		}
		else {
			const success = queue.skip();
			return void interaction.followUp({
				content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
			});
		}
	},
};