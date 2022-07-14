const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder().setName('fs').setDescription('Force skip'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    let content = '❌ | No music is being played!';

    if (queue && queue.playing && queue.skip()) {
      content = `✅ | Skipped **${queue.current}**!`;
    }
    return void interaction.followUp({
      content: content,
    });
  },
};
