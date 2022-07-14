const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('audiofilter')
      .setDescription('Manage audio filters')
      .addSubcommandGroup((subcommandgroup) =>
        subcommandgroup
            .setName('add')
            .setDescription('Add an audio filter')
            .addSubcommand((subcommand) =>
              subcommand
                  .setName('Page 1')
                  .setDescription('Page 1 of audio filters')
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
            )
            .addSubcommand((subcommand) =>
              subcommand
                  .setName('Page 2')
                  .setDescription('Page 2 of audio filters')
                  .addStringOption((option) =>
                    option
                        .setName('filter')
                        .setDescription('Audio filter to add')
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
            ),
      )
      .addSubcommandGroup((subcommandgroup) =>
        subcommandgroup
            .setName('remove')
            .setDescription('Remove an audio filter')
            .addSubcommand((subcommand) =>
              subcommand
                  .setName('Page 1')
                  .setDescription('Page 1 of audio filters')
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
            )
            .addSubcommand((subcommand) =>
              subcommand
                  .setName('Page 2')
                  .setDescription('Page 2 of audio filters')
                  .addStringOption((option) =>
                    option
                        .setName('filter')
                        .setDescription('Audio filter to remove')
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
            ),
      )
      .addSubcommand((subcommand) =>
        subcommand.setName('enabled')
            .setDescription('Filters currently enabled'),
      )
      .addSubcommand((subcommand) =>
        subcommand.setName('removeall')
            .setDescription('Removes all filters'),
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

    if (!queue.nowPlaying()) {
      return void interaction.followUp({
        content: '❌ | No queue to clear!',
      });
    }

    queue.clear();
    return void interaction.followUp({
      content: '✅ | Queue cleared!',
    });
  },
};
