const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/colors.json');

function loadColors() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveColors(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getGuildSettings(guildId) {
    const data = loadColors();
    if (!data[guildId]) {
        data[guildId] = { colors: {}, settings: { assignColorRole: 'everyone' } };
    }
    return data[guildId].settings;
}

function saveGuildSettings(guildId, settings) {
    const data = loadColors();
    if (!data[guildId]) {
        data[guildId] = { colors: {}, settings: {} };
    }
    data[guildId].settings = { ...data[guildId].settings, ...settings };
    saveColors(data);
}

function getGuildColors(guildId) {
    const data = loadColors();
    if (!data[guildId]) {
        data[guildId] = { colors: {}, settings: { assignColorRole: 'everyone' } };
    }
    return data[guildId].colors;
}

function saveGuildColors(guildId, colors) {
    const data = loadColors();
    if (!data[guildId]) {
        data[guildId] = { colors: {}, settings: { assignColorRole: 'everyone' } };
    }
    data[guildId].colors = { ...data[guildId].colors, ...colors };
    saveColors(data);
}

module.exports = { getGuildColors, saveGuildColors, getGuildSettings, saveGuildSettings };
