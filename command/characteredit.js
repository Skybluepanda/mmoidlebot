const { SlashCommandBuilder } = require('@discordjs/builders');
const database = require('../../database');
const { MessageEmbed } = require('discord.js');


async function embedSuccess(interaction) {
    const embedSuccess = new MessageEmbed();
    const cid = await interaction.options.getInteger("id")
    const char = await database.Character.findOne({where: {characterID: cid}});
    embedSuccess.setTitle(`Character ${cid} edited`)
        .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
        .setDescription(`Character ${char.characterName} has been edited`)
        .setColor("GREEN")
        .setThumbnail(interaction.user.avatarURL({ dynamic: true }));
    console.log("embed s dies")
    return embedSuccess;
};

function embedError(interaction) {
    const embedError = new MessageEmbed();
    embedError.setTitle("Unknown Error")
        .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
        .setDescription(`Please report the error if it persists.`)
        .setColor("RED");
    return embedError;
};

async function selectOption(interaction) {
    console.log("2");
    const id = interaction.options.getInteger('id');
    console.log("2");
    const embedS = await embedSuccess(interaction);
    switch (interaction.options.getSubcommand()) {
        case "name":
            console.log("2.1");
            const name = interaction.options.getString('name');
            console.log("2.1");
            await database.Character.update({ characterName: name }, { where: { characterID: id } });
            console.log("2.1");
            return interaction.reply({embeds: [embedS]});

        case "link":
            console.log("2.2");
            const link = interaction.options.getString('link');
            await database.Character.update({ infoLink: link }, { where: { characterID: id } });
            return interaction.reply({embeds: [embedS]});

        case "sid":
            console.log("2.3");
            const sid = interaction.options.getInteger('sid');
            await database.Character.update({ seriesID: sid }, { where: { characterID: id } });
            return interaction.reply({embeds: [embedS]});

        case "alias":
            console.log("2.4");
            const aname = interaction.options.getString('alias');
            await database.Character.update({ alias: aname }, { where: { characterID: id } });
            return interaction.reply({embeds: [embedS]});

        default:
            const embed = embedError(interaction);
            embed.setDescription("Error has occured, try using the command with a subcommand.")
            return interaction.reply({embeds: [embed]})

    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cedit')
		.setDescription('Edits Character Details')
        //cid is constant
        //subcommands for
        /** 
         * characterName
         * infoLink
         * seriesID
         * alias
         */
        .addSubcommand(subcommand => subcommand
            .setName("name")
            .setDescription("Edit the name of the character.")
            .addIntegerOption(option => option
                .setName("id")
                .setDescription("The id of the character")
                .setRequired(true))
            .addStringOption(option => option
                .setName("name")
                .setDescription("The name of the character")
                .setRequired(true)))
        .addSubcommand(subcommand =>subcommand
            .setName("link")
            .setDescription("Edit the link of the character")
            .addIntegerOption(option => option
                .setName("id")
                .setDescription("The id of the character")
                .setRequired(true))
            .addStringOption(option => option
                .setName("link")
                .setDescription("The link of the character")
                .setRequired(true)))
        .addSubcommand(subcommand =>subcommand
            .setName("sid")
            .setDescription("Edit the series of the character")
            .addIntegerOption(option => option
                .setName("id")
                .setDescription("The id of the character")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("sid")
                .setDescription("The series of the character")
                .setRequired(true)))
        .addSubcommand(subcommand =>subcommand
            .setName("alias")
            .setDescription("Edit the alias for the character")
            .addIntegerOption(option => option
                .setName("id")
                .setDescription("The id of the character")
                .setRequired(true))
            .addStringOption(option => option
                .setName("alias")
                .setDescription("The alias")
                .setRequired(true))),
	async execute(interaction) {
        const id = interaction.options.getInteger('id');
        try {
            console.log("1");
            await selectOption(interaction)
            console.log("1");
        } catch (error) {
            console.log("u fucked up");
            return interaction.reply({embeds: [embedError(interaction)]});
        }
	},
};