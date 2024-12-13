const fs = require('fs');
const path = require('path');
const customCommandsFile = path.resolve(__dirname, '../data/customCommands.json');

// Load custom commands
function loadCustomCommands() {
    if (!fs.existsSync(customCommandsFile)) {
        fs.writeFileSync(customCommandsFile, JSON.stringify({ guilds: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(customCommandsFile, 'utf8'));
}

// Save custom commands
function saveCustomCommands(data) {
    try {
        fs.writeFileSync(customCommandsFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Failed to save custom commands: ${error.message}`);
    }
}

// Ensure guild-specific commands object exists
function ensureGuildCommands(guildId) {
    const customCommands = loadCustomCommands();

    if (!customCommands.guilds) {
        customCommands.guilds = {};
    }

    if (!customCommands.guilds[guildId]) {
        customCommands.guilds[guildId] = {};
        saveCustomCommands(customCommands); // Save the updated structure
    }

    return customCommands.guilds[guildId];
}

module.exports = {
    loadCustomCommands,
    saveCustomCommands,
    ensureGuildCommands,
};
