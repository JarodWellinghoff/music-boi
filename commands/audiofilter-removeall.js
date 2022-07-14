const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter-removeall')
      .setDescription('Remove all filters from current player'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const disabledFilters = queue.getFiltersDisabled();
    const enabledFilters = queue.getFiltersEnabled();
    const filtersJSON = {};

    enabledFilters.forEach((value) => {
      filtersJSON[value] = false;
    });

    disabledFilters.forEach((value) => {
      filtersJSON[value] = false;
    });

    await queue.setFilters(filtersJSON);

    return void interaction.followUp({
      content: '🎵 | All filters disabled!',
    });
  },
};
