/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'trackAdd',
  execute(queue, track) {
    console.log(track.raw);
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`**Queued** in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${track.requestedBy.username}`,
          iconURL: `${track.requestedBy.avatarURL()}`,
        })
        .setDescription(`**[${track.title}](${track.url})** by [${track.author}](${track.raw.channel.url})`)
        .setThumbnail(track.thumbnail);

    console.log(`🎶 | Track **${track.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
