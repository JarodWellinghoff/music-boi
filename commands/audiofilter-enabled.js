const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter-enabled')
      .setDescription('Currently enabled audio filters'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const enabledFilters = queue.getFiltersEnabled();

    let content = 'Filters Enabled:\n';
    if (enabledFilters.length == 0) {
      content += '\tNone!';
    } else {
      enabledFilters.forEach((v, i, a) => {
        content += `\t${v}\n`;
      });
    }

    return void interaction.followUp({
      content: content,
    });
  },
};
