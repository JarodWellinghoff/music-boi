const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Returns the current latency of the bot in ms'),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guild);

    return void interaction.followUp({
      embeds: [
        {
          title: '⏱️ | Latency',
          fields: [
            {
              name: 'Bot Latency',
              value: `\`${Math.round(
                  interaction.client.ws.ping,
              )}ms\``,
            },
            {
              name: 'Voice Latency',
              value: !queue ?
                                'N/A' :
                                `UDP: \`${
                                  queue.connection.voiceConnection.ping
                                      .udp ?? 'N/A'
                                }\`ms\nWebSocket: \`${
                                  queue.connection.voiceConnection.ping
                                      .ws ?? 'N/A'
                                }\`ms`,
            },
          ],
          color: 0xffffff,
        },
      ],
    });
  },
};
