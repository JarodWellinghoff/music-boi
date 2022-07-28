const {SlashCommandBuilder} = require('@discordjs/builders');
const trackAddEvent = require('../events/player/trackAdd');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('back')
      .setDescription('Play previous track'),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    const currentTrack = queue.nowPlaying();

    if (!queue || !queue.playing) {
      return interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }
    if (queue.previousTracks.length === 1) {
      return interaction.followUp({
        content: '❌ | No previous tracks!',
      });
    }

    await queue.back();

    player.removeAllListeners(trackAddEvent.name);
    queue.insert(currentTrack);
    player.on(trackAddEvent.name, (...args) => trackAddEvent.execute(...args));

    return interaction.followUp({
      content: 'Playing previous track',
    });
  },
};
