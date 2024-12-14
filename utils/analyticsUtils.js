const fs = require('fs');
const path = require('path');
const { isAnalyticsEnabled } = require('./analyticsConfigUtils');

const analyticsFile = path.resolve(__dirname, '../data/analytics.json');

// Load analytics data
function loadAnalytics() {
    if (!fs.existsSync(analyticsFile)) {
        fs.writeFileSync(analyticsFile, JSON.stringify({ guilds: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
}

// Save analytics data
function saveAnalytics(guildId, data) {
    if (!isAnalyticsEnabled(guildId)) {
        return;
    }

    const analytics = loadAnalytics();

    // Save data for this guild
    if (!analytics.guilds) {
        analytics.guilds = {};
    }
    analytics.guilds[guildId] = data;
    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
}


// Ensure guild data exists
function ensureGuildData(guildId) {
    const analytics = loadAnalytics();

    // Skip if analytics is disabled for this guild
    if (!isAnalyticsEnabled(guildId)) {
        return;
    }

    // Initialize the guilds key if missing
    if (!analytics.guilds) {
        analytics.guilds = {};
    }

    // Initialize specific guild data if missing
    if (!analytics.guilds[guildId]) {
        analytics.guilds[guildId] = {
            messages: { total: 0, byUser: {}, byChannel: {} },
            memberStats: { joins: 0, leaves: 0 },
        };
        saveAnalytics(guildId, analytics.guilds[guildId]);
    }
}


module.exports = { loadAnalytics, saveAnalytics, ensureGuildData };
