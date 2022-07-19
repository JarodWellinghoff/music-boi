const {SlashCommandBuilder} = require('@discordjs/builders');
const {QueryType, QueryResolver} = require('discord-player');
const downloader = require('@discord-player/downloader').Downloader;
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('download')
      .setDescription('Download a song')
      .addStringOption((option) =>
        option
            .setName('query')
            .setDescription(
                'The song you want to download,' +
                ' leave blank to download currently playing song',
            )
            .setRequired(false),
      ),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    let query = interaction.options.get('query');
    let track;
    if (query) {
      query = query.value;
      const searchResult = await player
          .search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
          })
          .catch((err) => {
            console.error(err);
          });

      if (!searchResult || !searchResult.tracks.length) {
        return void interaction.followUp({
          content: 'No results were found!',
        });
      }
      track = searchResult.tracks[0];
    } else {
      if (!queue || !queue.playing) {
        return void interaction.followUp({
          content: '❌ | No music is being played!',
        });
      }
      track = queue.nowPlaying();
    }

    const url = track.url;
    const filePath = `./downloads/${track.title}.mp3`;

    const message = await interaction.followUp({
      embeds: [track.trackDownloadEmbed('started')],
    });

    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        console.log('file does not exists');
        const inputStream = downloader.download(url);
        const outputStream = fs.createWriteStream(filePath);
        inputStream.pipe(outputStream);
        outputStream.on('finish', () => {
          message.edit({
            embeds: [track.trackDownloadEmbed('finished')],
            files: [filePath],
          });
        });
      } else {
        console.log('file exists');
        message.edit({
          embeds: [track.trackDownloadEmbed('finished')],
          files: [filePath],
        });
      }
    });
  },
};
