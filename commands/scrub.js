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
  const t = timestamp.split(':');

  let seconds = parseInt(t[semiCount]);
  if (semiCount >= 1) {
    const minutes = parseInt(t[semiCount - 1]);
    seconds += minutes * MINUTES_TO_SECONDS;
    if (semiCount >= 2) {
      const hours = parseInt(t[semiCount - 2]);
      seconds += hours * HOURS_TO_SECONDS;
      if (semiCount >= 3) {
        const days = parseInt(t[semiCount - 3]);
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
  const hour = 3600;
  if (endTime >= hour) {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().slice(14, 19);
  }
}


module.exports = {
  data: new SlashCommandBuilder()
      .setName('scrub')
      .setDescription('Scrubs the time in the current song')
      .addNumberOption((option) =>
        option.setName('seconds')
            .setDescription('Seconds to scrub')
            .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index').default;
    const seek = interaction.options.get('seconds').value;
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const currentTrack = queue.current;
    const timeStamp = queue.getPlayerTimestamp();
    const currentTime = timeStampToSeconds(timeStamp.current);
    const endTime = timeStampToSeconds(timeStamp.end);
    const timeRemaining = endTime - currentTime;
    const newTime = currentTime + seek;
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
