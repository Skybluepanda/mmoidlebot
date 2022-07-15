const { REST } = require("@discordjs/rest");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("../../data/config.json");
const fs = require("fs");

module.exports = (client) => {
    client.handleCommands = async (commandsFolders, path) => {
        client.commandArray = [];
        for (folder of commandsFolders) {
            const commandFiles = fs
                .readdirSync(`src/commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                const command = require(`../../src/commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                console.log(`1Command ${file} sucessfully added to list of commands.`);
            }
        }

        const commands = [];
        const commandFiles = fs
            .readdirSync("src/commands")
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
            console.log(
                `2Command ${file} sucessfully added to list of commands.`
            );
        }

        const rest = new REST({ version: "9" }).setToken(token);
        (async () => {
            try {
                // rest.get(Routes.applicationGuildCommands(clientId, guildId))
                //     .then(data => {
                //         const promises = [];
                //         for (const command of data) {
                //             const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
                //             promises.push(rest.delete(deleteUrl));
                //         }
                //         return Promise.all(promises);
                //     });


                console.log("Started refreshing application (/) commands.");

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    {
                        body: client.commandArray,
                    }
                );

                console.log("Successfully reloaded application (/) commands.");
            } catch (error) {
                console.error(error);
            }
        })();
    };
};
