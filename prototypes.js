/* eslint-disable max-len */
require('dotenv').config();
const {getWaitTime, playlistDuration} = require('./utilities');
const {MessageEmbed} = require('discord.js');
const tslib_1 = require('tslib');
const {Track, Queue} = require('discord-player');

/**
 * Runs prototypes.
 */
function main() {
  // Track prototypes ------------------------------------------------------------------------------------------------
  Track.prototype.trackSkipToEmbed = function(interaction) {
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
        })
        .setTitle(`Skipping to ${this.title}`)
        .setThumbnail(this.thumbnail);
    return embed;
  };

  Track.prototype.trackRemovedEmbed = function(queue, interaction) {
    const embed = new MessageEmbed()
        .setColor('RED')
        .setTitle(`Removed from **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
        })
        .setDescription(`**[${this.title}](${this.url})** by ${this.author}`)
        .setThumbnail(this.thumbnail);
    return embed;
  };

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
    if (this.source && this.source !== 'arbitrary') {
      embed.setDescription(embed.description + `\n\nSource: ${this.source}`);
    }
    return embed;
  };

  Track.prototype.trackStartEmbed = function(queue, title = '') {
    let channelAuthorURL = null;
    let channelIcon = null;
    try {
      channelAuthorURL = this.raw.channel.url;
    } catch {
      console.log('No channelAuthorURL');
    }

    try {
      channelIcon = this.raw.channel.icon.url;
    } catch {
      console.log('No channelIcon');
    }

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Now Playing in **${queue.connection.channel.name}**`)
        .setAuthor({
          name: `${this.requestedBy.username}`,
          iconURL: `${this.requestedBy.displayAvatarURL()}`,
        })
        .setDescription(
            `**[${this.title}](${this.url})** by [${this.author}](${channelAuthorURL})`,
        )
        .addField('Duration', this.duration, true)
        .setImage(this.thumbnail)
        .setThumbnail(channelIcon);

    if (title !== '') {
      embed.setTitle(title);
    }

    if (queue.tracks.length !== 0) {
      const nextTrack = queue.tracks[0];
      embed.setFooter({
        text: `Next: ${nextTrack.title} by ${nextTrack.author}`,
        iconURL: nextTrack.thumbnail,
      });
    }

    if (this.playlist !== undefined && this.playlist !== null) {
      embed.addField(
          'Playlist',
          `[${this.playlist.title}](${this.playlist.url}) by [${this.playlist.author.name}](${this.playlist.author.url})`,
          true,
      );
    }

    if (this.source && this.source !== 'arbitrary') {
      embed.setDescription(embed.description + `\n\nSource: ${this.source}`);
    }

    if (this.views !== 0) {
      embed.addField('Views', `${this.views.toLocaleString('en-US')}`, true);
    }
    return embed;
  };

  Track.prototype.tracksAddEmbed = function() {
    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setAuthor({
          name: `${this.requestedBy.username}`,
          iconURL: `${this.requestedBy.displayAvatarURL()}`,
        })
        .setTitle(`Queued in **${this.queue.connection.channel.name}**`)
        .setDescription(
            `[${this.playlist.title}](${this.playlist.url}) by [${this.playlist.author.name}](${this.playlist.author.url})`,
        )
        .addField('Videos Added', `${this.queue.tracks.length}`, true)
        .addField('Total Time', playlistDuration(this.queue.tracks), true)
        .setThumbnail(
        this.playlist.thumbnail.url ?
          this.playlist.thumbnail.url :
          this.thumbnail,
        );
    if (this.source && this.source !== 'arbitrary') {
      embed.setDescription(embed.description + `\n\nSource: ${this.source}`);
    }
    return embed;
  };

  Track.prototype.trackDownloadEmbed = function(state) {
    let channelAuthorURL = null;
    let channelIcon = null;
    try {
      channelAuthorURL = this.raw.channel.url;
    } catch {
      console.log('No channelAuthorURL');
    }

    try {
      channelIcon = this.raw.channel.icon.url;
    } catch {
      console.log('No channelIcon');
    }

    const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Downloading ${this.title} **${state.toUpperCase()}**`)
        .setAuthor({
          name: `${this.requestedBy.username}`,
          iconURL: `${this.requestedBy.displayAvatarURL()}`,
        })
        .setDescription(
            `**[${this.title}](${this.url})** by [${this.author}](${channelAuthorURL})`,
        )
        .addField('Duration', this.duration, true)
        .setImage(this.thumbnail)
        .setThumbnail(channelIcon);

    if (this.playlist !== undefined && this.playlist !== null) {
      embed.addField(
          'Playlist',
          `[${this.playlist.title}](${this.playlist.url}) by [${this.playlist.author.name}](${this.playlist.author.url})`,
          true,
      );
    }

    if (this.source && this.source !== 'arbitrary') {
      embed.setDescription(embed.description + `\n\nSource: ${this.source}`);
    }

    if (this.views !== 0) {
      embed.addField('Views', `${this.views.toLocaleString('en-US')}`, true);
    }
    return embed;
  };

  // Queue prototypes --------------------------------------------------------------------------------------------------------
  Queue.prototype.nowPlayingEmbed = function(interaction) {
    let channelAuthorURL = null;
    try {
      channelAuthorURL = this.raw.channel.url;
    } catch {
      console.log('No channelAuthorURL');
    }
    const progress = this.createProgressBar();
    const perc = this.getPlayerTimestamp();
    const track = this.current;

    const embed = new MessageEmbed()
        .setColor('WHITE')
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.displayAvatarURL()}`,
        })
        .setTitle(`Currently Playing in ${this.connection.channel.name}`)
        .setDescription(
            `**[${track.title}](${track.url})** by [${track.author}](${channelAuthorURL})`,
        )
        .addField(`Progress: (\`${perc.progress}%\`)`, progress)
        .setImage(track.thumbnail);
    if (track.source && track.source !== 'arbitrary') {
      embed.setDescription(embed.description + `\n\nSource: ${track.source}`);
    }

    return embed;
  };

  Queue.prototype.usersTrackCount = function() {
    const count = {};

    for (const track of this.tracks) {
      const name = track.requestedBy.username;
      if (count[name]) {
        count[name] += 1;
      } else {
        count[name] = 1;
      }
    }
    return count;
  };

  Queue.prototype.insert = function(track, index = 0, emit = true) {
    if ((0, tslib_1.__classPrivateFieldGet())(this, this._Queue_instances, 'm', this._Queue_watchDestroyed).call(this)) {
      return;
    }
    if (!track || !(track instanceof this.Track_1.default)) {
      throw new this.PlayerError_1.PlayerError('track must be the instance of Track', this.PlayerError_1.ErrorStatusCode.INVALID_TRACK);
    }
    if (typeof index !== 'number' || index < 0 || !Number.isFinite(index)) {
      throw new this.PlayerError_1.PlayerError(`Invalid index "${index}"`, this.PlayerError_1.ErrorStatusCode.INVALID_ARG_TYPE);
    }
    this.tracks.splice(index, 0, track);
    if (emit) {
      this.player.emit('trackAdd', this, track);
    }
  };
}

module.exports = {
  main,
};
