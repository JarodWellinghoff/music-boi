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
    let query = interaction.options.get('query');
    if (query) {
      query = query.value;
    } else {
      if (!queue || !queue.playing) {
        return void interaction.followUp({
          content: '❌ | No music is being played!',
        });
      }
      query = queue.nowPlaying.title;
    }
    const data = await lyricsClient.search(query).catch(console.error());
    console.log(data);

    return void interaction.followUp({
      content: '✅ | Queue cleared!',
    });
  },
};
