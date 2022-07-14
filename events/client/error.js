// require('dotenv').config();

module.exports = {
  name: 'error',
  async execute(error) {
    console.error(`Error: ${error}`);
  },
};
