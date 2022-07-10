const { SlashCommandBuilder } = require('@discordjs/builders');
const { timeStampToSeconds, secondsToTimeStamp } = require('../utilities');

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
    const { player } = require('../index');
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
      content = `✅ | Scrubed **${currentTrack}** to ${secondsToTimeStamp(endTime, newTime)}!`;
    }
    return void interaction.followUp({
      content: content,
    });
  },
};
