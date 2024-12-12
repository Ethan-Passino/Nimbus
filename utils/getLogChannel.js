const fs = require('fs');
const path = require('path');

const logChannelsPath = path.resolve(__dirname, '../data/logChannels.json');

function getLogChannel(guild) {
    // Load log channels
    const logChannels = fs.existsSync(logChannelsPath)
        ? JSON.parse(fs.readFileSync(logChannelsPath, 'utf-8'))
        : {};

    // Get the log channel ID for this guild
    const logsChannelId = logChannels[guild.id];
    if (!logsChannelId) return null;

    // Fetch the channel from the guild
    return guild.channels.cache.get(logsChannelId) || null;
}

module.exports = getLogChannel;
