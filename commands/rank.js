const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserLevel } = require('../utils/levelingUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Check your current level and XP progress.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user whose rank you want to check.')), // Optional user argument
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user; // Default to the command user
        const { guild } = interaction;

        // Fetch the target user's leveling data
        const userLevelData = getUserLevel(guild.id, targetUser.id);
        const { xp, level } = userLevelData;

        // Calculate progress
        const nextLevelXP = 100 * Math.pow(level + 1, 2);
        const currentLevelXP = 100 * Math.pow(level, 2);
        const progressXP = xp - currentLevelXP;
        const progressTotal = nextLevelXP - currentLevelXP;

        // Generate styled progress bar
        const progressBarLength = 10; // Number of segments in the progress bar
        const filledBars = Math.floor((progressXP / progressTotal) * progressBarLength);
        const emptyBars = progressBarLength - filledBars;
        const progressBar =
            '🟩 '.repeat(filledBars) + // Filled progress segment
            '⬜ '.repeat(emptyBars);  // Empty progress segment

        // User's avatar
        const avatarURL = targetUser.displayAvatarURL({ dynamic: true, size: 512 });

        // Create embed
        const rankEmbed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle(`${targetUser.username}'s Rank`)
            .setDescription(`<@${targetUser.id}>`) // Discord mention
            .setThumbnail(avatarURL)
            .addFields(
                { name: 'Level', value: `${level}`, inline: true },
                { name: 'XP', value: `${xp} / ${nextLevelXP}`, inline: true },
                { name: 'Progress', value: `${progressBar}` } // Styled progress bar
            )
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 512 }) })
            .setTimestamp();

        // Respond with the rank embed
        await interaction.reply({ embeds: [rankEmbed] });
    },
};
