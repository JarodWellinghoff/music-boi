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
    // const trackAddEvent = (queue, track) => {
    //   console.log(track);
    //   const embed = track.trackAddEmbed();

    //   console.log(`🎶 | Track **${track.title}** queued!`);
    //   queue.metadata.send({
    //     embeds: [embed],
    //   });
    // };


    if (!queue || !queue.playing) {
      interaction.followUp({
        content: '❌ | No music is being played!',
      });
    } else if (queue.previousTracks.length === 1) {
      console.log(queue.previousTracks);
      interaction.followUp({
        content: '❌ | No previous tracks!',
      });
    } else {
      const currentTrack = queue.nowPlaying();
      await queue.back();
      interaction.followUp({
        content: 'Playing previous track',
      });
      player.removeListener('trackAdd', trackAddEvent.data);
      queue.insert(currentTrack, 0);
      player.on('trackAdd', trackAddEvent.data);
    }
  },
};
