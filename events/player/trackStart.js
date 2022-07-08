module.exports = {
	name: 'trackStart',
	execute(queue, track) {
		// console.log('TRACK START');
		console.groupCollapsed('TRACK START');
		console.log('TRACK');
		console.log(track.toJSON());
		console.log('QUEUE');
		console.log(queue.toJSON());
		console.groupEnd();
		// console.log(`${track.title} is playing in ${queue.connection.channel.name} in ${queue.guild}`);
		queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
	},
};
