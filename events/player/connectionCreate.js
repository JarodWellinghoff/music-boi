module.exports = {
  name: 'connectionCreate',
  execute(queue) {
    console.log(`✅ | Connected to ${queue.connection.channel.name}!`);
    queue.metadata.send(`✅ | Connected to ${queue.connection.channel.name}!`);
  },
};
