/* eslint-disable max-len */
module.exports = {
  name: 'error',
  execute(queue, error) {
    console.log(
        `[${queue.guild.name}] Error emitted from the queue: ${JSON.stringify(error.toJSON())}`,
    );
  },
};
