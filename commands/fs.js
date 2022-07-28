const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('fs').setDescription('Force skip'),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (queue && queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }
    const success = queue.skip();
    return void interaction.followUp({
      content: success ?
        `✅ | Skipped **${queue.current}**!` :
        'Something went wrong',
    });
  },
};
