// require('dotenv').config();

module.exports = {
	name: 'error',
	async execute(error) {
		console.groupCollapsed('ERROR');
		console.error(`Error: ${error}`);
		console.groupEnd();
	},
};