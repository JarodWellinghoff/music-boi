const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('fs')
		.setDescription('Force Skip'),
	async execute(interaction) {
		await interaction.deferReply();

		const { player } = require('../index');
		const queue = player.getQueue(interaction.guildId);

		interaction.member.roles.cache.some(role => {
			if (role.name !== 'DJ' || role.name !== 'Admin' || role.name !== 'Owner')
				console.log(role.name);
		},
		);

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