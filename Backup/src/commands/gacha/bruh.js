const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bruh')
		.setDescription('bruh'),
	async execute(interaction) {
		await interaction.reply(`bruh`);
	},
};
