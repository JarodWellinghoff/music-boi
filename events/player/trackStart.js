/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'trackStart',
  execute(queue, track) {
    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor({
          name: `${track.requestedBy.username}`,
          iconURL: `${track.requestedBy.avatarURL()}`,
        });
    console.log(
        `🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`,
    );
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
