module.exports = {
	name: 'connectionCreate',
	execute(queue) {
		queue.metadata.send(`✅ | Connected to ${queue.connection.channel.name}!`);
	},
};