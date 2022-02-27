const database = require('../database.js')
const database2 = require('../database2.js')
const database3 = require('../database3.js')

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        client.application.commands.set([]);
        console.log(`Ready! Logged in as ${client.user.tag}`);
        // database.Tags.sync();
        // database.Player.sync();
        // database.Character.sync();
        // database.Skill.sync();
        // database.SkillDesc.sync();
        database2.Player.sync();
        database.Character.sync();
        database.Image.sync();
        database.Series.sync();
        database3.Daily.sync();
        console.log('database sync complete!');
    },
};