module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            const event = require(`../${path}/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
                console.log(`Event ${file} sucessfully triggered once.`)
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
                console.log(`Event ${file} sucessfully added to events.`)
            }
        }
    }
}