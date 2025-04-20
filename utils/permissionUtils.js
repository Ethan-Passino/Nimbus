const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/permissions.json');

function getPermissions() {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function savePermissions(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

function getGuildCommandRoles(guildId, commandName) {
    const perms = getPermissions();
    return perms[guildId]?.[commandName] || [];
}

function setGuildCommandRoles(guildId, commandName, roles) {
    const perms = getPermissions();
    if (!perms[guildId]) perms[guildId] = {};
    perms[guildId][commandName] = roles;
    savePermissions(perms);
}

function isAuthorized(member, commandName) {
    const roles = getGuildCommandRoles(member.guild.id, commandName);
    return roles.some(role => member.roles.cache.some(r => r.name === role)) || member.permissions.has('Administrator');
}

module.exports = {
    getGuildCommandRoles,
    setGuildCommandRoles,
    isAuthorized
};
