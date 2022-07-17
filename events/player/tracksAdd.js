/* eslint-disable max-len */

module.exports = {
  name: 'tracksAdd',
  execute(queue, tracks) {
    console.log(tracks);
    const embed = tracks[0].tracksAddEmbed();

    console.log(`🎶 | Playlist **${tracks[0].playlist.title}** queued!`);
    queue.metadata.send({
      embeds: [embed],
    });
  },
};
