const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter-add2')
      .setDescription('Add filter to current player (page 2)')
      .addStringOption((option) =>
        option
            .setName('filter')
            .setDescription('Audio filter')
            .setRequired(true)
            .addChoices(
                {
                  name: 'expander',
                  value: 'expander',
                },
                {
                  name: 'softlimiter',
                  value: 'softlimiter',
                },
                {
                  name: 'chorus',
                  value: 'chorus',
                },
                {
                  name: 'chorus2d',
                  value: 'chorus2d',
                },
                {
                  name: 'chorus3d',
                  value: 'chorus3d',
                },
                {
                  name: 'bassboost_low',
                  value: 'bassboost_low',
                },
                {
                  name: 'fadein',
                  value: 'fadein',
                },
                {
                  name: 'dim',
                  value: 'dim',
                },
                {
                  name: 'earrape',
                  value: 'earrape',
                },
                {
                  name: 'underwater',
                  value: 'underwater',
                },
                {
                  name: 'bitcrush',
                  value: 'bitcrush',
                },
            ),
      ),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }
    const filter = interaction.options.get('filter').value;
    const disabledFilters = queue.getFiltersDisabled();
    const enabledFilters = queue.getFiltersEnabled();
    const filtersJSON = {};

    enabledFilters.forEach((value) => {
      filtersJSON[value] = true;
    });

    disabledFilters.forEach((value) => {
      filtersJSON[value] = false;
    });

    filtersJSON[filter] = true;

    await queue.setFilters(filtersJSON);

    return void interaction.followUp({
      content: `🎵 | ${filter} ${
        queue.getFiltersEnabled().includes(filter) ? 'Enabled' : 'Disabled'
      }!`,
    });
  },
};
