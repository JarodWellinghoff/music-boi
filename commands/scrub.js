const { SlashCommandBuilder } = require('@discordjs/builders');
const { timeStampToSeconds, secondsToTimeStamp } = require('../utilities');

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
    const { player } = require('../index');
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
      content = `✅ | Scrubed **${currentTrack}** to ${secondsToTimeStamp(endTime, newTime)}!`;
    }
    return void interaction.followUp({
      content: content,
    });
  },
};
