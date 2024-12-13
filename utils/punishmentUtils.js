const fs = require('fs');
const path = require('path');

// Path to punishment data
const punishmentsFile = path.resolve(__dirname, '../data/punishments.json');

// Load punishments
function loadPunishments() {
    if (!fs.existsSync(punishmentsFile)) {
        fs.writeFileSync(punishmentsFile, JSON.stringify({ guilds: {} }, null, 2));
    }
    return JSON.parse(fs.readFileSync(punishmentsFile, 'utf8'));
}

// Save punishments
function savePunishments(data) {
    fs.writeFileSync(punishmentsFile, JSON.stringify(data, null, 2));
}

// Save a punishment
function savePunishment(guildId, userId, type, reason, duration = null) {
    const punishments = loadPunishments();

    if (!punishments.guilds[guildId]) {
        punishments.guilds[guildId] = {};
    }

    if (!punishments.guilds[guildId][userId]) {
        punishments.guilds[guildId][userId] = [];
    }

    punishments.guilds[guildId][userId].push({
        type,
        reason,
        duration,
        timestamp: new Date().toISOString(),
    });

    savePunishments(punishments);
}

// Get a user's punishment history
function getUserHistory(guildId, userId) {
    const punishments = loadPunishments();
    return punishments.guilds[guildId]?.[userId] || [];
}

module.exports = {
    savePunishment,
    getUserHistory,
};
