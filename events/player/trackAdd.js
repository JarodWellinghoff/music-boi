/* eslint-disable max-len */

module.exports = {
  name: 'trackAdd',
  execute(queue, track) {
    console.log(track);
    const embed = track.trackAddEmbed();

    console.log(`🎶 | Track **${track.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
