const {SlashCommandBuilder} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Clears current queue'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index').default;
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
