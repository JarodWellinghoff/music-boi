const {SlashCommandBuilder} = require('@discordjs/builders');


module.exports = {
  data: new SlashCommandBuilder()
      .setName('fs')
      .setDescription('Force Skip'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index').default;
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    const currentTrack = queue.current;
    const success = queue.skip();
    return void interaction.followUp({
      // eslint-disable-next-line max-len
      content: success ? `✅ | Skipped **${currentTrack}**!` : '❌ | Something went wrong!',
    });
  },
};
