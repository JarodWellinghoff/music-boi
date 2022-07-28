const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Returns the current latency of the bot in ms'),
  async execute(interaction) {
    await interaction.deferReply();
    const {player} = require('../index');
    const queue = player.getQueue(interaction.guild);

    const embed = new MessageEmbed()
        .setTitle('⏱️ | Latency')
        .setColor('WHITE')
        .addField(
            'Bot Latency',
            `\`${Math.round(interaction.client.ws.ping)}ms\``,
            true,
        )
        .addField(
            'Voice Latency',
        !queue ?
          'N/A' :
          `UDP: \`${
            queue.connection.voiceConnection.ping.udp ?? 'N/A'
          }\`ms
          \nWebSocket: \`${
            queue.connection.voiceConnection.ping.ws ?? 'N/A'
          }\`ms`,
        true,
        );

    return void interaction.followUp({
      embeds: [embed],
    });
  },
};
