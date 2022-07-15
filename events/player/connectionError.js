/* eslint-disable max-len */
module.exports = {
  name: 'connectionError',
  execute(queue, error) {
    console.log(
        `[${queue.guild.name}] Error emitted from the queue: `, JSON.stringify(error.toJSON(), undefined, 2),
    );
  },
};
