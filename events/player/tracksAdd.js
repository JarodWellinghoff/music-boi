/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');
const {playlistDuration} = require('../../utilities');

module.exports = {
  name: 'tracksAdd',
  execute(queue, tracks) {
    console.log(tracks);
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle(`**Queued** in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${tracks[0].requestedBy.username}`,
          iconURL: `${tracks[0].requestedBy.displayAvatarURL()}`,
        })
        .setDescription(`[${tracks[0].playlist.title}](${tracks[0].playlist.url}) by [${tracks[0].playlist.author.name}](${tracks[0].playlist.author.url})`)
        .addField('Videos added', `${tracks.length}`, true)
        .addField('Total Time', playlistDuration(tracks), true)
        .setThumbnail(tracks[0].thumbnail);

    console.log(`🎶 | Playlist **${tracks[0].playlist.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
