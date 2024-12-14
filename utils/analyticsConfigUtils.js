const fs = require('fs');
const path = require('path');

const configFile = path.resolve(__dirname, '../data/analyticsConfig.json');

// Load configuration
function loadAnalyticsConfig() {
    if (!fs.existsSync(configFile)) {
        fs.writeFileSync(configFile, JSON.stringify({ guilds: {} }, null, 2));
    }

    try {
        const data = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(data || '{}'); // Handle empty file
    } catch (error) {
        console.error(`Failed to load analytics config: ${error.message}`);
        return { guilds: {} }; // Return a default structure
    }
}

// Save configuration
function saveAnalyticsConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

module.exports = { loadAnalyticsConfig, saveAnalyticsConfig };


// Save configuration
function saveAnalyticsConfig(config) {
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

// Ensure guild config exists
function ensureGuildConfig(guildId) {
    const config = loadAnalyticsConfig();
    if (!config.guilds[guildId]) {
        config.guilds[guildId] = { analyticsEnabled: false };
        saveAnalyticsConfig(config);
    }
    return config.guilds[guildId];
}

// Check if analytics is enabled for a guild
function isAnalyticsEnabled(guildId) {
    const config = loadAnalyticsConfig();

    // Ensure guild config exists
    if (!config.guilds) {
        config.guilds = {};
    }

    // Initialize analyticsEnabled to false if missing
    if (!config.guilds[guildId]) {
        config.guilds[guildId] = { analyticsEnabled: false };
        saveAnalyticsConfig(config);
    }

    return config.guilds[guildId].analyticsEnabled;
}


module.exports = { loadAnalyticsConfig, saveAnalyticsConfig, ensureGuildConfig, isAnalyticsEnabled };
