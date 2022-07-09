module.exports = {
	name: 'trackAdd',
	execute(queue, track) {
		console.log(`🎶 | Track **${track.title}** queued!`);
		queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
	},
};