module.exports = {
  name: 'connectionError',
  execute(queue, error) {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
  },
};

