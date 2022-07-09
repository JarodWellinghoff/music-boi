require('dotenv').config();

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {
		console.groupCollapsed('VOICE STATE UPDATE');
		// Joined VC without being connected to one previously
		if (oldState.channelId === null && newState.channelId !== null) {
			console.log(`${newState.member.user.username} joined ${newState.member.voice.channel.name}`);
		}
		// Left VC without joining another
		else if (newState.channelId === null) {
			console.log(`${oldState.member.user.username} left ${oldState.channel.name}`);
		}
		console.groupEnd();
	},
};