require('dotenv').config();
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { Player } = require('discord-player');
// const mongoose = require('mongoose');


const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
	partials: ['CHANNEL', 'MESSAGE'],
});
const player = new Player(client);

module.exports = {
	player,
};

// const player = new Player(client);
// console.log(player);

// Dynamically add all commands in the "./commands" directory
const commands = [];
client.commands = new Collection();
const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// module.exports = {
// 	// players,
// 	commands,
// };


// Dynamically add all events in the "./events" directory
const clientEventFiles = fs
	.readdirSync('./events/client')
	.filter(file => file.endsWith('.js'));

for (const file of clientEventFiles) {
	// console.log(file);
	const event = require(`./events/client/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, commands));
	}
}

// Dynamically add all events in the "./events" directory
const playerEventFiles = fs
	.readdirSync('./events/player')
	.filter(file => file.endsWith('.js'));

for (const file of playerEventFiles) {
	// console.log(file);
	const event = require(`./events/player/${file}`);

	if (event.once) {
		player.once(event.name, (...args) => event.execute(...args, commands));
	}
	else {
		player.on(event.name, (...args) => event.execute(...args, commands));
	}
}
// console.log(client_player);

// player.on('error', (queue, error) => {
// 	console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
// });
// player.on('connectionError', (queue, error) => {
// 	console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
// });
// player.on('trackStart', (queue, track) => {
// 	queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
// });

// player.on('trackAdd', (queue, track) => {
// 	queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
// });

// player.on('botDisconnect', (queue) => {
// 	queue.metadata.send('❌ | I was manually disconnected from the voice channel, clearing queue!');
// });

// player.on('channelEmpty', (queue) => {
// 	queue.metadata.send('❌ | Nobody is in the voice channel, leaving...');
// });

// player.on('queueEnd', (queue) => {
// 	queue.metadata.send('✅ | Queue finished!');
// });
<<<<<<< HEAD

=======
console.log(process.env.DISCORD_TOKEN);
>>>>>>> 5e16a14d32376b7dd70c4e455c2ac773ae89498e
client.login(process.env.DISCORD_TOKEN);
