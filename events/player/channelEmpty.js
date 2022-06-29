module.exports = {
	name: 'channelEmpty',
	execute(queue) {
		queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
	},
};