const {SlashCommandBuilder} = require('@discordjs/builders');
const filters = [
  {
    name: 'Bassboost (Low)',
    value: 'bassboost_low',
  },
  {
    name: 'Bassboost',
    value: 'bassboost',
  },
  {
    name: 'Bassboost (High)',
    value: 'bassboost_high',
  },
  {
    name: 'Vaporwave',
    value: 'vaporwave',
  },
  {
    name: 'Nightcore',
    value: 'nightcore',
  },
  {
    name: 'Tremolo',
    value: 'tremolo',
  },
  {
    name: 'Vibrato',
    value: 'vibrato',
  },
  {
    name: 'Reverse',
    value: 'reverse',
  },
  {
    name: 'Normalizer (dynamic audio normalizer based)',
    value: 'normalizer',
  },
  {
    name: 'Normalizer (audio compressor based)',
    value: 'normalizer2',
  },
  {
    name: 'Surrounding',
    value: 'surrounding',
  },
  {
    name: 'Pulsator',
    value: 'pulsator',
  },
  {
    name: 'Subboost',
    value: 'subboost',
  },
  {
    name: 'Flanger',
    value: 'flanger',
  },
  {
    name: 'Compressor',
    value: 'compressor',
  },
  {
    name: 'Expander',
    value: 'expander',
  },
  {
    name: 'Chorus',
    value: 'chorus',
  },
  {
    name: 'Earrape',
    value: 'earrape',
  },
  {
    name: 'Underwater',
    value: 'underwater',
  },
  {
    name: 'Bitcrush',
    value: 'bitcrush',
  },
  {
    name: 'Double Speed',
    value: 'double_speed',
  },
  {
    name: 'Half Speed',
    value: 'half_speed',
  },
  {
    name: 'Echo',
    value: 'echo',
  },
  {
    name: 'Haas',
    value: 'haas',
  },
];

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter')
      .setDescription('Manage audio filters')
      .addSubcommand((subcommand) =>
        subcommand
            .setName('add')
            .setDescription('Add an audio filter')
            .addIntegerOption((option) => {
              option
                  .setName('filter')
                  .setDescription('Audio filter to add')
                  .setRequired(true);
              filters.forEach((v, i, a) =>
                option.addChoices({
                  name: v.name,
                  value: i,
                }),
              );
              return option;
            }),
      )
      .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove an audio filter')
            .addIntegerOption((option) => {
              option
                  .setName('filter')
                  .setDescription('Audio filter to remove')
                  .setRequired(true);
              filters.forEach((v, i, a) =>
                option.addChoices({
                  name: v.name,
                  value: i,
                }),
              );
              return option;
            }),
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

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const options = interaction.options;
    const subcommand = options.getSubcommand();
    const disabledFilters = queue.getFiltersDisabled();
    let enabledFilters = queue.getFiltersEnabled();
    const filtersJSON = {};
    const addOrSub = subcommand === 'add';

    enabledFilters.forEach((value) => (filtersJSON[value] = true));

    disabledFilters.forEach((value) => (filtersJSON[value] = false));

    if (subcommand === 'enabled') {
      let content = 'Filters Enabled:\n';

      if (enabledFilters.length == 0) {
        content += '\tNone!';
      } else {
        enabledFilters.forEach((v) => (content += `\t${v}\n`));
      }
      return void interaction.followUp({
        content: content,
      });
    }
    if (subcommand === 'removeall') {
      enabledFilters.forEach((value) => (filtersJSON[value] = false));

      await queue.setFilters(filtersJSON);
      return void interaction.followUp({
        content: '🎵 | All filters disabled!',
      });
    }

    const index = options.get('filter').value;
    const filterName = filters[index].name;
    const filterValue = filters[index].value;
    filtersJSON[filterValue] = addOrSub;

    await queue.setFilters(filtersJSON);
    enabledFilters = queue.getFiltersEnabled();

    return void interaction.followUp({
      content: `🎵 | ${filterName} ${
        enabledFilters.includes(filterValue) ? 'Enabled' : 'Disabled'
      }!`,
    });
  },
};
