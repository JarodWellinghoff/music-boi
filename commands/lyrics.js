const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {Lyrics} = require('@discord-player/extractor');
const lyricsClient = Lyrics.init();

module.exports = {
  data: new SlashCommandBuilder()
      .setName('lyrics')
      .setDescription('Get lyrics')
      .addStringOption((option) =>
        option
            .setName('query')
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
    const song = await lyricsClient.search(query).catch(console.error());

    if (song) {
      const artist = song.artist;
      const artistName = artist.name;
      const artistImage = artist.image;
      const artistIcon = song.image;
      const artistURL = artist.url;
      const songLyrics = song.lyrics;
      const songURL = song.url;
      const songTitle = song.title;
      const songThumbnail = song.image;

      const embed = new MessageEmbed()
          .setColor('BLUE')
          .setAuthor({
            name: artistName,
            iconURL: artistIcon,
            url: artistURL,
          })
          .setDescription(songLyrics)
          .setTitle(songTitle)
          .setURL(songURL)
          .setThumbnail(songThumbnail)
          .setImage(artistImage);

      return void interaction.followUp({
        embeds: [embed],
      });
    } else {
      return void interaction.followUp({
        content: 'no',
      });
    }
  },
};
