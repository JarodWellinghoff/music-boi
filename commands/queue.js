const {SlashCommandBuilder} = require('@discordjs/builders');
const PAGE_SIZE = 10;
const MINUTES_TO_SECONDS = 60;
const HOURS_TO_SECONDS = MINUTES_TO_SECONDS * 60;
const DAYS_TO_SECONDS = HOURS_TO_SECONDS * 24;

/**
 * It parses 00:00:00 into seconds
 * @param {String} timestamp
 * @return {number}
 */
function timeStampToSeconds(timestamp) {
  const semiCount = (timestamp.match(/:/g) || []).length;
  const t = timestamp.split(':');

  let seconds = parseInt(t[semiCount]);
  if (semiCount >= 1) {
    const minutes = parseInt(t[semiCount - 1]);
    seconds += minutes * MINUTES_TO_SECONDS;
    if (semiCount >= 2) {
      const hours = parseInt(t[semiCount - 2]);
      seconds += hours * HOURS_TO_SECONDS;
      if (semiCount >= 3) {
        const days = parseInt(t[semiCount - 3]);
        seconds += days * DAYS_TO_SECONDS;
      }
    }
  }
  return seconds;
}

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
    const currentTrack = queue.current;
    const noOfPages = Math.floor(queue.tracks.length / PAGE_SIZE);
    const lastPageItemQuantity = queue.tracks.length % PAGE_SIZE;
    const pages = [];
    let page = 0;
    let timeStamp = queue.getPlayerTimestamp();
    let endTime = timeStampToSeconds(timeStamp.end);
    let currentTime = timeStampToSeconds(timeStamp.current);


    for (let i = 0; i <= noOfPages * PAGE_SIZE; i += PAGE_SIZE) {
      let tracks;
      if (i === noOfPages) {
        tracks = queue.tracks.slice(i, i + lastPageItemQuantity).map((m, j) => {
          return `${j + i + 1}. [**${m.title}**](${m.url})`;
        });
      } else {
        tracks = queue.tracks.slice(i, i + 10).map((m, j) => {
          return `${j + i + 1}. [**${m.title}**](${m.url})`;
        });
      }
      pages.push(tracks);
    }

    console.log(pages);
    const message = await interaction.followUp({
      content: pages.length == 1 ? '' : `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
      embeds: [{
        title: pages.length == 1 ? 'Server Queue' : `Server Queue (${page + 1}/${pages.length})`,
        description: `${pages[0].join('\n')}${queue.tracks.length > PAGE_SIZE ?
						`\n...${queue.tracks.length - pages[0].length === 1 ? `${queue.tracks.length - pages[0].length} more track` : `${queue.tracks.length - pages[0].length} more tracks`}` :
						''}`,
        color: 0xff0000,
        fields: [{
          name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})`}],
      }],
    });

    if (noOfPages > 0) {
      const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
      };
      message.react('⬅️').then(() => message.react('➡️'));
      const collector = message.createReactionCollector({
        filter, max: 10, time: endTime * 1000, errors: ['time'], dispose: true,
      });

      collector.on('collect', (reaction) => {
        timeStamp = queue.getPlayerTimestamp();
        endTime = timeStampToSeconds(timeStamp.end);
        currentTime = timeStampToSeconds(timeStamp.current);
        if (reaction.emoji.name === '➡️' && page < pages.length - 1) {
          page++;
        } else if (reaction.emoji.name === '⬅️' && page > 0) {
          page--;
        }
        message.edit({
          content: `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
          embeds: [
            {
              title: `Server Queue (${page + 1}/${pages.length})`,
              description: `${pages[page].join('\n')}${queue.tracks.length > (PAGE_SIZE * (page + 1)) ?
								`\n...${queue.tracks.length - (PAGE_SIZE * (page + 1)) === 1 ? `${queue.tracks.length - (PAGE_SIZE * (page + 1))} more track` : `${queue.tracks.length - (PAGE_SIZE * (page + 1))} more tracks`}` :
								''}`,
              color: 0xff0000,
              fields: [{
                name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})`,
              }],
            },
          ],
        });
      });

      collector.on('remove', (reaction) => {
        timeStamp = queue.getPlayerTimestamp();
        endTime = timeStampToSeconds(timeStamp.end);
        currentTime = timeStampToSeconds(timeStamp.current);
        if (reaction.emoji.name === '➡️' && page < pages.length - 1) {
          page++;
        } else if (reaction.emoji.name === '⬅️' && page > 0) {
          page--;
        }
        message.edit({
          content: `**Scrolling will disabled in ${endTime - currentTime} seconds**`,
          embeds: [{
            title: `Server Queue (${page + 1}/${pages.length})`,
            description: `${pages[page].join('\n')}${queue.tracks.length > (PAGE_SIZE * (page + 1)) ?
								`\n...${queue.tracks.length - (PAGE_SIZE * (page + 1)) === 1 ? `${queue.tracks.length - (PAGE_SIZE * (page + 1))} more track` : `${queue.tracks.length - (PAGE_SIZE * (page + 1))} more tracks`}` :
								''}`,
            color: 0xff0000,
            fields: [{
              name: 'Now Playing', value: `🎶 | [**${currentTrack.title}**](${currentTrack.url})`,
            }],
          }],
        });
      });

      collector.on('end', () => {
        message.edit('**Queue scrolling timed out**');
        message.reactions.removeAll()
            .catch((error) =>
              console.error('Failed to clear reactions:', error),
            );
      });
    }
  },
};
