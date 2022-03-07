const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../../database.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addgem')
        .setDescription('adds gem to a profile.')
        .addUserOption(option => 
            option
                .setName("target")
                .setDescription("The user account")
                .setRequired(true)
                )
        .addIntegerOption(option => 
            option
                .setName("quantity")
                .setDescription("Quantity of the gem")
                .setRequired(true)
                )
        .addStringOption(option => 
            option
                .setName("reason")
                .setDescription("Reason?")
                .setRequired(true)
                ),


    async execute(interaction) {
        const username = interaction.user.username;
        const userId = interaction.user.id;
        
        const embed = new MessageEmbed();
        const embedDone = new MessageEmbed();
        const embedError = new MessageEmbed();

        embed.setTitle("Adding Gem")
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setDescription(`Checking for ${username}'s account.`)
            .setColor("#00ecff")

        embedDone.setTitle("Added Gems")
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setColor("#7cff00")

        embedError.setTitle("Unknown Error")
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setDescription(`Please report the error if it persists.`)
            .setColor("#ff0000")

        await interaction.reply({ embeds: [embed] }, {ephemeral: true});
        try {
            
            if (!interaction.member.roles.cache.has('947442920724787260')) {
                embedError.setDescription("You don't have the gemmod role!")

                return interaction.editReply({ embeds: [embedError] }, {ephemeral: true});

            };
            if (interaction.channel.id === '950495634337726575') {
                console.log("you have gemmod role");
                const target = await interaction.options.getUser('target');
                const quantity = await interaction.options.getInteger('quantity');
                const reason = await interaction.options.getString('reason');
                embedDone.setDescription(`${target.toString()} recieved ${quantity} gems!
                Reason: ${reason}`);
                await database.Player.increment({gems: quantity}, {where: {playerID: target.id}})
                await interaction.editReply({ embeds: [embedDone] }, {ephemeral: true});
            } else {
                embedError.setDescription("Use this command in #rewards-commands channel")
                return interaction.editReply({ embeds: [embedError] }, {ephemeral: true});
            }
            
        } catch (error) {
            return interaction.editReply({ embeds: [embedError] }, {ephemeral: true});
        }
    }
};