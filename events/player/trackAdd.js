/* eslint-disable max-len */
const {MessageEmbed} = require('discord.js');
const {getWaitTime} = require('../../utilities');

module.exports = {
  name: 'trackAdd',
  execute(queue, track) {
    console.log(track);
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setTitle(`**Queued** in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${track.requestedBy.username}`,
          iconURL: `${track.requestedBy.displayAvatarURL()}`,
        })
        .setDescription(
            `**[${track.title}](${track.url})** by [${track.author}](${track.raw.channel.url})`,
        )
        .setThumbnail(track.thumbnail);

    if (queue.tracks.length !== 0 && queue.playing) {
      embed.addField('Place in queue', `${queue.tracks.length}`, true);
      embed.addField('Wait Time', getWaitTime(queue), true);
      console.log(queue.totalTime);
    }

    console.log(`🎶 | Track **${track.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
