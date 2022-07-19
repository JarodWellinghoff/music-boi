const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('fs')
      .setDescription('Force skip')
      .addIntegerOption((option) =>
        option.setName('position')
            .setDescription('Removes track at that position')
            .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    const position = interaction.options.get('position').value;

    if (position < 0 || position > queue.tracks.length) {
      interaction.followUp({
        content: '❌ | Not valid position!',
      });
    }

    if (!queue || !queue.playing) {
      interaction.followUp({
        content: '❌ | No music is being played!',
      });
    } else {
      const track = queue.remove(position);
      interaction.followUp({
        embeds: [track.trackRemovedEmbed(interaction)],
      });
    }
  },
};
