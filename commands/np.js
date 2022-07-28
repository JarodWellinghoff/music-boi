const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('np').setDescription('Now Playing'),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const embed = queue.nowPlayingEmbed(interaction);
    return void interaction.followUp({
      embeds: [embed],
    });
  },
};
