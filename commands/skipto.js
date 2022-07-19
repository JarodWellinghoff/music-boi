const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('skipto')
      .setDescription('Skip to a postion in the queue')
      .addIntegerOption((option) =>
        option
            .setName('position')
            .setDescription('Position to skip to')
            .setRequired(true),
      ),
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
      const track = queue.tracks[position - 1];
      queue.skipTo(position - 1);
      interaction.followUp({
        embeds: [track.trackSkipToEmbed(interaction)],
      });
    }
  },
};
