const { createCanvas, loadImage, Canvas } = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, IntegrationApplication } = require('discord.js');
const database = require('../../database.js');
const database2 = require('../../database2.js');

async function checkIDS(interaction) {
	const cid = interaction.options.getInteger('cid');
	const iNumber = interaction.options.getInteger('image_number')
	try {
		if (0 <= iNumber < 25) {
			const count = await database.Image.count({ where: {characterID: cid, imageNumber: iNumber}})
			if (count != 0) {
				await interaction.reply(`Character ${cid} already has an image ${iNumber}, maximum is 24.`)
			} else {
				upload(interaction);
			};
		} else {
			await interaction.reply("Range of image number is 0-24.")
		}
	} catch(error){
        console.log("failed in id check.")
	}
}

function imageFilename(interaction) {
	const nsfw = interaction.options.getBoolean('nsfw');
    const cid = interaction.options.getInteger('cid');
    const char = database.Character.findOne({where: {characterID: cid}});
    const charname = char.characterName
	if (nsfw) {
		const imgName = 'SPOILER_'+ charname + '.gif';
		return imgName;
	} else {
		const imgName = charname + '.gif';
		return imgName;
	}
}

async function check(interaction) {
    try {
        const url = await interaction.options.getString('gif_link');
        if (url.endsWith(".gif")) {
            const imgName = await imageFilename(interaction);
            const attachment = await new MessageAttachment(url, imgName);
            console.log(imgName);
            if (attachment) {await interaction.reply({ files: [attachment] });} else {
                interaction.reply("Image error.")
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

// function checkNSFW(interaction){
// 	const nsfw = interaction.options.getBoolean('nsfw');
// 	const iNumber = interaction.options.getInteger('image_number');
// 	if ((nsfw && 25 > iNumber > 9) || (!nsfw && 0 <= iNumber < 10)) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// }


async function upload(interaction) {
    try {
        const cid = await interaction.options.getInteger('cid');
        const iNumber = await interaction.options.getInteger('image_number');
        const art = await interaction.options.getString('artist_name');
        const sauce = await interaction.options.getString('source');
        const isnsfw = await interaction.options.getBoolean('nsfw');
        const uploader = await interaction.user.username;
        // await check(interaction);
        const url = await interaction.options.getString('gif_link');

        // const message = await interaction.fetchReply();

        // const link = await message.attachments.first().url;
        await console.log(url);
        if (url.endsWith(".gif")) {
            await database.Image.create({
                characterID: cid,
                imageNumber: iNumber,
                imageURL: url,
                artist: art,
                source: sauce,
                nsfw: isnsfw, 
                uploader: uploader,
            });
        } else {
            interaction.channel.send("Thats not a gif.")
        }
        await console.log("broke with this check?");
	
		await database.Character.increment({imageCount: 1}, {where: {characterID: cid}})
		// const char = await database.Character.findOne({where: {characterID:cid}});
		// await char.increment('imageCount', {by: 1});
		await database2.Player.increment({gems: 10}, {where: {playerID: interaction.user.id}})
        await console.log("wait did we fail here because we never sent anything?");
        return await interaction.reply(`Image added to the database.`)
	} catch(error) {
        console.log("upload failed.")
	}
	
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gifupload')
		.setDescription('Adding image to the database for the character, image should be 225x350px in size.')
		.addIntegerOption(option => option
			.setName('cid')
			.setDescription('Id of the character')
			.setRequired(true))
		.addIntegerOption(option => option
			.setName('image_number')
			.setDescription('id number for characters image slot. Pick an empty one.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('gif_link')
			.setDescription('link of the image or upload.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('artist_name')
			.setDescription('name of the artist')
			.setRequired(true))
		.addStringOption(option => option
			.setName('source')
			.setDescription('image source link.')
			.setRequired(true))
		.addBooleanOption(option => option
			.setName('nsfw')
			.setDescription('is this an nsfw image or gif?')
			.setRequired(true)),
	async execute(interaction) {
		//check if character exists, and image number is empty
		//than create the image in database with all details.
		try {
            // interaction.reply("Uploading gif.");
			checkIDS(interaction);
			// if (checkNSFW(interaction)){
			// 	checkIDS(interaction);
			// } else {
			// 	return await interaction.reply("None NSFW images have number 0-9, NSFW images have number 10-24")
			// }
		} catch(error){
			await interaction.channel.send("Error has occured");
		}
	}
}
