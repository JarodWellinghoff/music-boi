/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'trackStart',
  execute(queue, track) {
    console.log(track);
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`**Now Playing** in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${track.requestedBy.username}`,
          iconURL: `${track.requestedBy.avatarURL()}`,
        })
        .setDescription(`**[${track.title}](${track.url})** by ${track.author}`)
        .addField('Duration', track.duration, true)
        .setImage(track.thumbnail)
        .setThumbnail(track.raw.channel.icon.url);
    if (queue.tracks.length !== 0) {
      const nextTrack = queue.tracks[0];
      embed.setFooter({
        text: `Next: ${nextTrack.title} by ${nextTrack.author}`,
        iconURL: nextTrack.thumbnail,
      });
    }
    if (track.playlist !== undefined) {
      embed.addField(
          'Playlist',
          `[${track.playlist.title}](${track.playlist.url}) by ${track.playlist.author.name}`,
          true,
      );
    }
    if (track.views !== 0) {
      embed.addField('Views', `${track.views.toLocaleString('en-US')}`, true);
    }

    console.log(
        `🎶 | Started playing: ${track.title} in **${queue.connection.channel.name}**!`,
    );
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
