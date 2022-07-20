const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter')
      .setDescription('Manage audio filters')
      .addSubcommand((subcommand) =>
        subcommand
            .setName('add')
            .setDescription('Add an audio filter')
            .addStringOption((option) =>
              option
                  .setName('filter')
                  .setDescription('Audio filter to add')
                  .setRequired(true)
                  .addChoices(
                      {
                        name: 'bassboost_low',
                        value: 'bassboost_low',
                      },
                      {
                        name: 'bassboost',
                        value: 'bassboost',
                      },
                      {
                        name: 'bassboost_high',
                        value: 'bassboost_high',
                      },
                      {
                        name: 'vaporwave',
                        value: 'vaporwave',
                      },
                      {
                        name: 'nightcore',
                        value: 'nightcore',
                      },
                      {
                        name: 'tremolo',
                        value: 'tremolo',
                      },
                      {
                        name: 'vibrato',
                        value: 'vibrato',
                      },
                      {
                        name: 'reverse',
                        value: 'reverse',
                      },
                      {
                        name: 'normalizer',
                        value: 'normalizer',
                      },
                      {
                        name: 'normalizer2',
                        value: 'normalizer2',
                      },
                      {
                        name: 'surrounding',
                        value: 'surrounding',
                      },
                      {
                        name: 'pulsator',
                        value: 'pulsator',
                      },
                      {
                        name: 'subboost',
                        value: 'subboost',
                      },
                      {
                        name: 'flanger',
                        value: 'flanger',
                      },
                      {
                        name: 'compressor',
                        value: 'compressor',
                      },
                      {
                        name: 'expander',
                        value: 'expander',
                      },
                      {
                        name: 'chorus',
                        value: 'chorus',
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
                      {
                        name: 'double_speed',
                        value: 'double_speed',
                      },
                      {
                        name: 'half_speed',
                        value: 'half_speed',
                      },
                  ),
            ),
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove an audio filter')
            .addStringOption((option) =>
              option
                  .setName('filter')
                  .setDescription('Audio filter to remove')
                  .setRequired(true)
                  .addChoices(
                      {
                        name: 'bassboost_low',
                        value: 'bassboost_low',
                      },
                      {
                        name: 'bassboost',
                        value: 'bassboost',
                      },
                      {
                        name: 'bassboost_high',
                        value: 'bassboost_high',
                      },
                      {
                        name: 'vaporwave',
                        value: 'vaporwave',
                      },
                      {
                        name: 'nightcore',
                        value: 'nightcore',
                      },
                      {
                        name: 'tremolo',
                        value: 'tremolo',
                      },
                      {
                        name: 'vibrato',
                        value: 'vibrato',
                      },
                      {
                        name: 'reverse',
                        value: 'reverse',
                      },
                      {
                        name: 'normalizer',
                        value: 'normalizer',
                      },
                      {
                        name: 'normalizer2',
                        value: 'normalizer2',
                      },
                      {
                        name: 'surrounding',
                        value: 'surrounding',
                      },
                      {
                        name: 'pulsator',
                        value: 'pulsator',
                      },
                      {
                        name: 'subboost',
                        value: 'subboost',
                      },
                      {
                        name: 'flanger',
                        value: 'flanger',
                      },
                      {
                        name: 'compressor',
                        value: 'compressor',
                      },
                      {
                        name: 'expander',
                        value: 'expander',
                      },
                      {
                        name: 'chorus',
                        value: 'chorus',
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
                      {
                        name: 'double_speed',
                        value: 'double_speed',
                      },
                      {
                        name: 'half_speed',
                        value: 'half_speed',
                      },
                  ),
            ),
      )
      .addSubcommand((subcommand) =>
        subcommand.setName('enabled').setDescription('Filters currently enabled'),
      )
      .addSubcommand((subcommand) =>
        subcommand.setName('removeall').setDescription('Removes all filters'),
      ),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    const options = interaction.options;
    const subcommand = options.getSubcommand();
    let filter;

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    if (!(subcommand === 'enabled' || subcommand === 'removeall')) {
      filter = options.get('filter').value;
    }

    const disabledFilters = queue.getFiltersDisabled();
    const enabledFilters = queue.getFiltersEnabled();
    const filtersJSON = {};
    let content;

    enabledFilters.forEach((value) => {
      filtersJSON[value] = true;
    });

    disabledFilters.forEach((value) => {
      filtersJSON[value] = false;
    });

    if (subcommand === 'enabled') {
      content = 'Filters Enabled:\n';

      if (enabledFilters.length == 0) {
        content += '\tNone!';
      } else {
        enabledFilters.forEach((v, i, a) => {
          content += `\t${v}\n`;
        });
      }
    } else if (subcommand === 'removeall') {
      content = '🎵 | All filters disabled!';

      enabledFilters.forEach((value) => {
        filtersJSON[value] = false;
      });

      await queue.setFilters(filtersJSON);
    } else if (subcommand === 'add') {
      filtersJSON[filter] = true;
      await queue.setFilters(filtersJSON);
      content = `🎵 | ${filter} ${
        queue.getFiltersEnabled().includes(filter) ? 'Enabled' : 'Disabled'
      }!`;
    } else if (subcommand === 'remove') {
      filtersJSON[filter] = false;
      await queue.setFilters(filtersJSON);
      content = `🎵 | ${filter} ${
        queue.getFiltersEnabled().includes(filter) ? 'Enabled' : 'Disabled'
      }!`;
    }

    return void interaction.followUp({
      content: content,
    });
  },
};
