const fs = require('fs');
const path = require('path');

// Path to the JSON configuration file
const configPath = path.resolve(__dirname, '../data/logConfig.json');

function isEventEnabled(guild, eventName) {
    // Load the configuration
    const config = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

    // Check if the event is enabled for the guild
    return config[guild.id]?.[eventName] ?? true; // Default to true if not configured
}

module.exports = isEventEnabled;
