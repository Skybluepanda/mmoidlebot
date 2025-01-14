const { createCanvas, loadImage, Canvas } = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, IntegrationApplication } = require('discord.js');
const database = require('../../database.js');

async function checkIDS(interaction) {
	const cid = await interaction.options.getInteger('cid');
	const gNumber = await interaction.options.getInteger('gifnumber')
	const char = await database.Character.findOne({where: {characterID:cid}});
	const exist = await database.Gif.findOne({ where: {characterID: cid, gifNumber: gNumber}})
	const queue = await database.Gifqueue.findOne({ where: {characterID: cid, gifNumber: gNumber}})
	try {
		if (char) {
			if (1 <= gNumber && gNumber < 6) {
				if (exist || queue) {
					return await interaction.reply(`Character ${cid} already has an gif ${gNumber} or it's queued, maximum is 5.`)
				} else {
					console.log("passed the checkids");
					return await upload(interaction);
				};
			} else {
				return await interaction.reply("Range of gif number is 1-5.")
			}
		} else {
			await interaction.reply("Cid doesn't exist.");
		}
	} catch(error){
        console.log("failed in id check.")
	}
}


async function check(interaction) {
    try {
        const url = await interaction.options.getString('gif_link');
        if (url.endsWith(".gif")) {
            const imgName = await imageFilename(interaction);
            const attachment = await new MessageAttachment(url, imgName);
            if (attachment) {await interaction.reply({ files: [attachment] });} else {
                interaction.reply("Gif error.")
            }
            //add it to database
        } else {
            //fucking die u moron.
            return interaction.reply("That's not a gif.")
        }
    } catch(error) {
        console.log(error + "error in gifupload/check");
    }
}


async function upload(interaction) {
    try {
		console.log(1)
        const cid = await interaction.options.getInteger('cid');
		const char = await database.Character.findOne({where: {characterID: cid}})
        const iNumber = await interaction.options.getInteger('gifnumber');
        const art = await interaction.options.getString('artist_name');
        const uploader = await interaction.user.username;
		const player = await database.Player.findOne({where: {playerID: interaction.user.id}});

        // await check(interaction);
        const url = await interaction.options.getString('gif_link');
		console.log(2)
        // const message = await interaction.fetchReply();
		let gif;
        // const link = await message.attachments.first().url;
        if (url.endsWith(".gif")) {
			console.log(3)
            gif = await database.Gifqueue.create({
                characterID: cid,
                gifNumber: iNumber,
                gifURL: url,
                artist: art,
                nsfw: false, 
                selfcrop: true, 
                uploader: uploader,
                uploaderid: player.id
            });
        } else {
            return interaction.channel.send("Thats not a gif.")
        }
	
		// await database.Character.increment({gifCount: 1}, {where: {characterID: cid}})
		// const char = await database.Character.findOne({where: {characterID:cid}});
		// await char.increment('imageCount', {by: 1});
		// await database.Player.increment({gems: 25, karma: 1}, {where: {playerID: interaction.user.id}})
		console.log(4)
		const channel = await interaction.guild.channels.cache.get('950318845430726686');
		await channel.send(`${cid} | ${char.characterName}'s image ${iNumber}
uploaded by ${uploader} and art by ${art}.`);
		await channel.send(`${url}`);
		console.log(5)
        return await interaction.reply(`Gif for ${char.characterName} has been added!
Gif ID (for deleteing and editing): ${gif.gifID}
Gif Number: ${iNumber}. 
The Gif has entered the send queue and will be reviewed by image mods.
You will recieve minimum of 50 gems and 1 karma for gifs taken from other bots or MAL.
There will be bonus rewards based on gif quality.`)
	} catch(error) {
        console.log("upload failed.")
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gsend')
		.setDescription('Adding gif to the database for the character, gif should be 225x350px in size.')
		.addIntegerOption(option => option
			.setName('cid')
			.setDescription('Id of the character')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('gifnumber')
			.setDescription('id number for characters gif slot. Pick an empty one.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('gif_link')
			.setDescription('link of the gif to upload.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('artist_name')
			.setDescription('name of the artist')
			.setRequired(true)),
	async execute(interaction) {
		//check if character exists, and image number is empty
		//than create the image in database with all details.
		if (!interaction.member.roles.cache.has('947640668031975465')) {
			return interaction.reply("You don't have the image send role!", {ephemeral: true});
		};
		if (interaction.channel.id === '947123054570512395') {
			try {
            // interaction.reply("Uploading gif.");
			await checkIDS(interaction);
			} catch(error){
				await interaction.channel.send("Error has occured");
			}
		} else {
			interaction.reply("use #send-image to send gifs please.")
		}
	}
}
