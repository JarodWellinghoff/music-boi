require('dotenv').config();
const {MessageEmbed} = require('discord.js');
const {getWaitTime} = require('./utilities');
const fs = require('fs');
const {Client, Intents, Collection} = require('discord.js');
const {Player, Track} = require('discord-player');
const {AudioFilters} = require('discord-player');

AudioFilters.define(
    'underwater',
    'firequalizer=gain=\'if(lt(f,1000), 0, -INF)\'',
);
AudioFilters.define('bitcrush', 'acrusher=mix=1:samples=10');
AudioFilters.define('double_speed', 'atempo=2');
AudioFilters.define('half_speed', 'atempo=0.5');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
});

const player = new Player(client, {
  ytdlOptions: {
    filter: 'audioonly',
    opusEncoded: 'true',
    quality: 'highestaudio',
    highWaterMark: 1 << 30,
  },
});

// player.use('reverbnation', Reverbnation);
// player.use('vimeo', Vimeo);

module.exports = {
  player,
};

// Dynamically add all commands in the "./commands" directory
const commands = [];
client.commands = new Collection();
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

// Dynamically add all events in the "./events" directory
const clientEventFiles = fs
    .readdirSync('./events/client')
    .filter((file) => file.endsWith('.js'));

for (const file of clientEventFiles) {
  // console.log(file);
  const event = require(`./events/client/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

// Dynamically add all events in the "./events" directory
const playerEventFiles = fs
    .readdirSync('./events/player')
    .filter((file) => file.endsWith('.js'));

for (const file of playerEventFiles) {
  // console.log(file);
  const event = require(`./events/player/${file}`);

  if (event.once) {
    player.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    player.on(event.name, (...args) => event.execute(...args, commands));
  }
}

Track.prototype.trackAddEmbed = function() {
  const embed = new MessageEmbed()
      .setColor('WHITE')
      .setTitle(`Queued in **${this.queue.connection.channel.name}**`)
      .setAuthor({
        name: `${this.requestedBy.username}`,
        iconURL: `${this.requestedBy.displayAvatarURL()}`,
      })
      .setDescription(`**[${this.title}](${this.url})** by ${this.author}`)
      .setThumbnail(this.thumbnail);

  if (this.queue.tracks.length !== 0 && this.queue.playing) {
    embed.addField('Place in queue', `${this.queue.tracks.length}`, true);
    embed.addField('Wait Time', getWaitTime(this.queue), true);
  }
  return embed;
};

Track.prototype.trackAddEmbed = function() {
  let channelAuthorURL = null;
  let channelIcon = null;
  try {
    channelAuthorURL = this.raw.channel.url;
  } catch {
    console.log('No channel url');
  }
  const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(`**Now Playing** in **${this.queue.connection.channel.name}**`)
      .setAuthor({
        name: `${this.requestedBy.username}`,
        iconURL: `${this.requestedBy.displayAvatarURL()}`,
      })
      .setDescription(
          `**[${this.title}](${this.url})** by [${this.author}](${null})`,
      )
      .addField('Duration', this.duration, true)
      .setImage(this.thumbnail)
      .setThumbnail(this.raw.channel.icon.url);
  if (this.queue.tracks.length !== 0) {
    const nextTrack = this.queue.tracks[0];
    embed.setFooter({
      text: `Next: ${nextTrack.title} by ${nextTrack.author}`,
      iconURL: nextTrack.thumbnail,
    });
  }
  if (this.playlist !== undefined) {
    embed.addField(
        'Playlist',
        `[${this.playlist.title}](${this.playlist.url}) by [${this.playlist.author.name}](${this.playlist.author.url})`,
        true,
    );
  }
  if (this.views !== 0) {
    embed.addField('Views', `${this.views.toLocaleString('en-US')}`, true);
  }
  return embed;
};

client.login(process.env.DISCORD_TOKEN);
