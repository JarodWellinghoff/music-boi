const {SlashCommandBuilder} = require('@discordjs/builders');
const {Lyrics} = require('@discord-player/extractor');
const lyricsClient = Lyrics.init();

module.exports = {
  data: new SlashCommandBuilder()
      .setName('lyrics')
      .setDescription('Get lyrics')
      .addStringOption((option) =>
        option.setName('query')
            .setDescription('Leave blank for currently playing song')
            .setRequired(false),
      ),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    console.log(interaction.options.get('query'));

    // try {
    //   const query = interaction.options.get('query').value;
    // } catch {
    //   if (!queue || !queue.playing) {
    //     return void interaction.followUp({
    //       content: '❌ | No music is being played!',
    //     });
    //   }
    //   const query = queue.nowPlaying.title;
    // }

    return void interaction.followUp({
      content: '✅ | Queue cleared!',
    });
  },
};
