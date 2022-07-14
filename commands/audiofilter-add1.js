const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter-add1')
      .setDescription('Add filter to current player (page 1)')
      .addStringOption((option) =>
        option
            .setName('filter')
            .setDescription('Audio filter')
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
                  name: '8D',
                  value: '8D',
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
                  name: 'phaser',
                  value: 'phaser',
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
                  name: 'treble',
                  value: 'treble',
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
                  name: 'karaoke',
                  value: 'karaoke',
                },
                {
                  name: 'flanger',
                  value: 'flanger',
                },
                {
                  name: 'gate',
                  value: 'gate',
                },
                {
                  name: 'haas',
                  value: 'haas',
                },
                {
                  name: 'mcompand',
                  value: 'mcompand',
                },
                {
                  name: 'mono',
                  value: 'mono',
                },
                {
                  name: 'mstlr',
                  value: 'mstlr',
                },
                {
                  name: 'mstrr',
                  value: 'mstrr',
                },
                {
                  name: 'compressor',
                  value: 'compressor',
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
