const {SlashCommandBuilder} = require('@discordjs/builders');
const {timeStampToSeconds, getQueuePage, PAGE_SIZE} = require('../utilities');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('queue')
      .setDescription('See the queue'),
  async execute(interaction) {
    await interaction.deferReply();

    const {player} = require('../index');
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return void interaction.followUp({
        content: '❌ | No music is being played!',
      });
    }

    if (queue.tracks.length === 0) {
      return void interaction.followUp({
        content: 'No song in the queue!',
      });
    }
    const currentTrack = queue.current;
    const noOfPages = Math.floor(queue.tracks.length / PAGE_SIZE);
    const pages = [];
    let pageNumber = 0;
    let timeStamp = queue.getPlayerTimestamp();
    let endTime = timeStampToSeconds(timeStamp.end);
    let currentTime = timeStampToSeconds(timeStamp.current);

    for (let i = 0; i <= noOfPages * PAGE_SIZE; i += PAGE_SIZE) {
      const page = queue.tracks.slice(i, i + PAGE_SIZE);
      pages.push(page);
    }
    // console.log(pages);
    const message = await interaction.followUp(
        getQueuePage(queue, pageNumber, pages),
    );

    if (noOfPages > 0) {
      const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
      };
      message.react('⬅️').then(() => message.react('➡️'));
      const collector = message.createReactionCollector({
        filter,
        max: 10,
        time: endTime * 1000,
        errors: ['time'],
        dispose: true,
      });

      collector.on('collect', (reaction) => {
        timeStamp = queue.getPlayerTimestamp();
        endTime = timeStampToSeconds(timeStamp.end);
        currentTime = timeStampToSeconds(timeStamp.current);

        if (reaction.emoji.name === '➡️' && pageNumber < pages.length - 1) {
          pageNumber++;
        } else if (reaction.emoji.name === '⬅️' && pageNumber > 0) {
          pageNumber--;
        }

        message.edit(getQueuePage(queue, pageNumber, pages));
      });

      collector.on('remove', (reaction) => {
        timeStamp = queue.getPlayerTimestamp();
        endTime = timeStampToSeconds(timeStamp.end);
        currentTime = timeStampToSeconds(timeStamp.current);
        if (reaction.emoji.name === '➡️' && pageNumber < pages.length - 1) {
          pageNumber++;
        } else if (reaction.emoji.name === '⬅️' && pageNumber > 0) {
          pageNumber--;
        }
        message.edit(getQueuePage(queue, pageNumber, pages));
      });

      collector.on('end', () => {
        message.reactions
            .removeAll()
        // eslint-disable-next-line max-len
            .catch((error) => console.error('Failed to clear reactions:', error));
      });

      player.on('trackStart', () => {
        collector.stop('New Song');
      });
    }
  },
};
