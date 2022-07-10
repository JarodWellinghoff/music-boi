const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Now Playing'),
  async execute(interaction) {
    await interaction.deferReply();
    const { player } = require('../index').default;

    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }
    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    return void interaction.followUp({
      embeds: [
        {
          title: 'Now Playing',
          // eslint-disable-next-line max-len
          description: `🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`,
          fields: [{
            name: '\u200b',
            value: progress,
          }],
          color: 0xffffff,
        },
      ],
    });
  },
};
