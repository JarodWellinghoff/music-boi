const {SlashCommandBuilder} = require('@discordjs/builders');
const MINUTES_TO_SECONDS = 60;
const HOURS_TO_SECONDS = MINUTES_TO_SECONDS * 60;
const DAYS_TO_SECONDS = HOURS_TO_SECONDS * 24;

/**
 * It parses 00:00:00 into seconds
 * @param {String} timestamp
 * @return {number}
 */
function timeStampToSeconds(timestamp) {
  const semiCount = (timestamp.match(/:/g) || []).length;
  const splits = timestamp.split(':');

  let seconds = parseInt(splits[semiCount]);
  if (semiCount >= 1) {
    const minutes = parseInt(splits[semiCount - 1]);
    seconds += minutes * MINUTES_TO_SECONDS;
    if (semiCount >= 2) {
      const hours = parseInt(splits[semiCount - 2]);
      seconds += hours * HOURS_TO_SECONDS;
      if (semiCount >= 3) {
        const days = parseInt(splits[semiCount - 3]);
        seconds += days * DAYS_TO_SECONDS;
      }
    }
  }
  return seconds;
}

/**
 * It returns number into 00:00:00 or 00:00 format
 * @param {number} endTime
 * @param {number} seconds
 * @return {Date}
 */
function secondsToTimeStamp(endTime, seconds) {
  if (endTime >= HOURS_TO_SECONDS) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
  }
}


module.exports = {
  data: new SlashCommandBuilder()
      .setName('timestamp')
      .setDescription('Moves song to a timestamp')
      .addStringOption((option) =>
        option.setName('timestamp')
            .setDescription('Timestamp to scrub to (00:00:00)')
            .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index').default;
    let timestamp;
    try {
      timestamp = timeStampToSeconds(
          interaction.options.get('timestamp').value,
      );
    } catch (e) {
      return void interaction.followUp({
        content: '❌ | Invalid timestamp!',
        ephemeral: true,
      });
    }
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const currentTrack = queue.current;
    const playerTimeStamp = queue.getPlayerTimestamp();
    const currentTime = timeStampToSeconds(playerTimeStamp.current);
    const endTime = timeStampToSeconds(playerTimeStamp.end);
    const timeRemaining = endTime - currentTime;
    const newTime = timestamp;
    let content = '❌ | Something went wrong!';

    if (newTime >= timeRemaining && queue.skip()) {
      content = `✅ | Skipped **${currentTrack}**!`;
    } else if (newTime <= 0 && await queue.seek(0)) {
      content = `✅ | Started **${currentTrack}** over!`;
    } else if (await queue.seek(newTime * 1000)) {
      content = `✅ | Scrubed **${currentTrack}** 
                to ${secondsToTimeStamp(endTime, newTime)}!`;
    }
    return void interaction.followUp({
      content: content,
    });
  },
};
