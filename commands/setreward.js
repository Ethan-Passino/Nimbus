const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// File path for storing rewards
const rewardsFilePath = path.join(__dirname, '../data/rewards.json');

// Load rewards data
function loadRewardsData() {
    if (!fs.existsSync(rewardsFilePath)) {
        fs.writeFileSync(rewardsFilePath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(rewardsFilePath));
}

// Save rewards data
function saveRewardsData(data) {
    fs.writeFileSync(rewardsFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreward')
        .setDescription('Set a role to be assigned at a specific level.')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The level at which the role is assigned.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign at the specified level.')
                .setRequired(true)),
    async execute(interaction) {
        const { guild, options } = interaction;
        const level = options.getInteger('level');
        const role = options.getRole('role');

        // Load and update rewards data
        const rewardsData = loadRewardsData();
        if (!rewardsData[guild.id]) {
            rewardsData[guild.id] = {};
        }

        rewardsData[guild.id][level] = role.id;
        saveRewardsData(rewardsData);

        await interaction.reply(`Reward set: Users will receive the **${role.name}** role at level **${level}**.`);
    },
};
