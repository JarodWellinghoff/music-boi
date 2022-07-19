require('dotenv').config();
const fs = require('fs');
const {Client, Intents, Collection} = require('discord.js');
const {Player, AudioFilters} = require('discord-player');
const downloader = require('@discord-player/downloader').Downloader;
const {main} = require('./prototypes');
const path = require('path');
const findRemoveSync = require('find-remove');

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

player.use('YOUTUBE_DL', downloader);

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
  const event = require(`./events/player/${file}`);

  if (event.once) {
    player.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    player.on(event.name, (...args) => event.execute(...args, commands));
  }
}

console.log(player.scanDeps());
main();
client.login(process.env.DISCORD_TOKEN);

const fileAgeMS = 86400000;
const checkMS = 10800000;

setInterval(function() {
  walkDir('./downloads/', function(filePath) {
    fs.stat(filePath, function(err, stat) {
      const now = new Date().getTime();
      const endTime = new Date(stat.mtime).getTime() + fileAgeMS;

      if (err) {
        return console.error(err);
      }

      if (now > endTime) {
      // console.log('DEL:', filePath);
        return fs.unlink(filePath, function(err) {
          if (err) return console.error(err);
        });
      }
    });
  });
}, checkMS);

/**
 *
 * @param {string} dir
 * @param {function} callback
 */
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach( (f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
  isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};
