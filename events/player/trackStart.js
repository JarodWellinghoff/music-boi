module.exports = {
	name: 'trackStart',
	execute(queue, track) {
		console.log(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
		queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
	},
};
