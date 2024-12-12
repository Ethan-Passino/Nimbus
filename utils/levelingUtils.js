// utils/levelingUtils.js
const fs = require('fs');
const path = require('path');

const levelingFilePath = path.join(__dirname, '../data/leveling.json');
const rewardsFilePath = path.join(__dirname, '../data/rewards.json');

// Load leveling data
function loadLevelingData() {
    if (!fs.existsSync(levelingFilePath)) {
        fs.writeFileSync(levelingFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(levelingFilePath));
}

// Save leveling data
function saveLevelingData(data) {
    fs.writeFileSync(levelingFilePath, JSON.stringify(data, null, 2));
}

// Load rewards data
function loadRewardsData() {
    if (!fs.existsSync(rewardsFilePath)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(rewardsFilePath));
}

// Add XP to a user and handle level-ups
function addXP(guildId, userId, amount, guild, channel) {
    const data = loadLevelingData();
    if (!data[guildId]) {
        data[guildId] = {};
    }

    if (!data[guildId][userId]) {
        data[guildId][userId] = { xp: 0, level: 0 };
    }

    const userData = data[guildId][userId];
    userData.xp += amount;

    const nextLevelXP = 100 * Math.pow(userData.level + 1, 2);
    if (userData.xp >= nextLevelXP) {
        userData.level += 1;

        // Check for rewards
        const rewardsData = loadRewardsData();
        if (rewardsData[guildId] && rewardsData[guildId][userData.level]) {
            const roleId = rewardsData[guildId][userData.level];
            const member = guild.members.cache.get(userId);

            if (member) {
                const role = guild.roles.cache.get(roleId);
                if (role) {
                    member.roles.add(role).catch(console.error);

                    // Notify in the channel
                    channel.send(`🎉 Congratulations <@${userId}>! You've reached level **${userData.level}** and have been awarded the **${role.name}** role!`);
                }
            }
        }
    }

    saveLevelingData(data);
    return { ...userData, leveledUp: userData.xp >= nextLevelXP };
}



// Get user level
function getUserLevel(guildId, userId) {
    const data = loadLevelingData();
    return data[guildId]?.[userId] || { xp: 0, level: 0 };
}

// Get leaderboard
function getLeaderboard(guildId) {
    const data = loadLevelingData();
    const guildData = data[guildId] || {};

    return Object.entries(guildData)
        .map(([userId, stats]) => ({ userId, ...stats }))
        .sort((a, b) => b.xp - a.xp);
}

module.exports = {
    addXP,
    getUserLevel,
    getLeaderboard
};
