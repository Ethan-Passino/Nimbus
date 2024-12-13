const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('path');
const { token, clientId } = require(path.resolve(__dirname, 'config.json'));
const {loadCustomCommands, saveCustomCommands} = require('./utils/commandUtils');

// Create client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Required for most guild-related events
        GatewayIntentBits.GuildMembers, // Required for member join/leave, updates
        GatewayIntentBits.GuildMessages, // Required for message-related events
        GatewayIntentBits.GuildVoiceStates, // Required for voice state changes
        GatewayIntentBits.MessageContent, // Required for reading message content (edit/delete events)
        GatewayIntentBits.GuildInvites, // For invite creation/deletion
    ],
});

// Load commands from Commands folder
client.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Path to the custom commands file
const customCommandsFile = path.resolve(__dirname, 'data/customCommands.json');

console.log("Loading commands:");
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`${command.data.name}.js`);
    commands.push(command.data.toJSON());
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log("\nLoading events:");
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    console.log(`${event.name}.js`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Register Slash commands
const rest = new REST({ version: '10'}).setToken(token);

(async () => {
    try {
        console.log('\nStarted refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Event Listener for ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});


// Login to discord
client.login(token);