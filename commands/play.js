/* eslint-disable max-len */
const {SlashCommandBuilder} = require('@discordjs/builders');
const {QueryType} = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('play')
      .setDescription('Plays a song from youtube')
      .addStringOption((option) =>
        option
            .setName('query')
            .setDescription('The song you want to play')
            .setRequired(true),
      ),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const query = interaction.options.get('query').value;
    const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: query.toString().includes('soundcloud.com') ?
                              QueryType.SOUNDCLOUD_SEARCH :
                              query.toString().includes('facebook.com') || query.toString().includes('fb.watch') ?
                              QueryType.FACEBOOK :
                              QueryType.AUTO,
        })
        .catch((err) => {
          console.error(err);
        });

    if (!searchResult || !searchResult.tracks.length) {
      return void interaction.followUp({
        content: 'No results were found!',
      });
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch {
      void player.deleteQueue(interaction.guildId);
      return void interaction.followUp({
        content: 'Could not join your voice channel!',
      });
    }

    await interaction.followUp({
      content: `⏱ | Loading your ${
        searchResult.playlist ? 'playlist' : 'track'
      }...`,
    });
    searchResult.playlist ?
      queue.addTracks(searchResult.tracks) :
      queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) await queue.play();
  },
};
