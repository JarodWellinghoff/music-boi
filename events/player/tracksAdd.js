/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'tracksAdd',
  execute(queue, tracks) {
    console.log(tracks);
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`**Queued** in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${tracks[0].requestedBy.username}`,
          iconURL: `${tracks[0].requestedBy.avatarURL()}`,
        })
        .setDescription(`[${tracks[0].playlist.title}](${tracks[0].playlist.url}) by [${tracks[0].playlist.author.name}](${tracks[0].playlist.author.url})`)
        .addField('Videos', `${tracks.length}`, true)
        .setThumbnail(tracks[0].thumbnail);

    console.log(`🎶 | Playlist **${tracks[0].playlist.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
