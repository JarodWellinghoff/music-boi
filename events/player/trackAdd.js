module.exports = {
	name: 'trackAdd',
	execute(queue, track) {
		console.groupCollapsed('TRACK ADDED');
		console.log('TRACK');
		console.log(track.toString());
		console.log('QUEUE');
		console.log(queue.toString());
		console.groupEnd();
		queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
	},
};