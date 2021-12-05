const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Initiates player profile'),
    async execute(interaction) {
        await interaction.reply('Creating Profile...');
        const userID = interaction.user.id
        try {
            const player = await database.Player.create({
                playerID: userID,
            });
            return interaction.editReply(`Player Profile Created!`);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.editReply(`The player \`${interaction.user.username}\` already exists.`);
            }
            return interaction.editReply('Something went wrong with adding a profile.');
        }
    },
};