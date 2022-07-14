const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('skip')
      .setDescription('Skip the current song'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    let listenerCount = interaction.member.voice.channel.members.size - 1;
    let majority = Math.ceil(listenerCount / 2);
    const currentTrack = queue.current;
    const skipper = interaction.member.user.username;

    const filter = (reaction, user) => {
      return (
        ['✅'].includes(reaction.emoji.name) &&
                !user.bot &&
                skipper !== user.username
      );
    };

    if (listenerCount > 1) {
      listenerCount = interaction.member.voice.channel.members.size - 1;
      majority = Math.ceil(listenerCount / 2);
      let votes = 1;

      const message = await interaction.followUp(
          `skip? [${votes}/${majority}]`,
      );
      message.react('✅');
      const collector = message.createReactionCollector({
        filter,
        max: listenerCount,
        time: 60000,
        errors: ['time'],
        dispose: true,
      });

      collector.on('collect', (reaction) => {
        if (reaction.emoji.name === '✅') {
          votes++;
          message.edit(`skip? [${votes}/${majority}]`);
        }
        if (votes >= majority) {
          const success = queue.skip();
          collector.stop('Majority rules');
          return message.edit({
            content: success ?
                            `✅ | Skipped **${currentTrack}**!` :
                            '❌ | Something went wrong!',
          });
        }
      });

      collector.on('remove', (reaction) => {
        if (reaction.emoji.name === '✅') {
          votes--;
          message.edit(`skip? [${votes}/${majority}]`);
        }
      });

      collector.on('end', (reason) => {
        if (reason === 'Majority rules') {
          const success = queue.skip();
          return message.edit({
            content: success ?
                            `✅ | Skipped **${currentTrack}**!` :
                            '❌ | Something went wrong!',
          });
        } else {
          message.edit('Voting timed out');
        }
        message.reactions.removeAll().catch((error) => {
          console.error('Failed to clear reactions:', error);
        });
      });
    } else {
      const success = queue.skip();
      return void interaction.followUp({
        content: success ?
                    `✅ | Skipped **${currentTrack}**!` :
                    '❌ | Something went wrong!',
      });
    }
  },
};
