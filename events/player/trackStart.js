/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'trackStart',
  execute(queue, track) {
    console.log(track);
    const embed = track.trackStartEmbed(queue);

    console.log(
        `🎶 | Started playing: ${track.title} in ${queue.connection.channel.name}!`,
    );
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
