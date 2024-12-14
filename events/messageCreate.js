const { addXP } = require('../utils/levelingUtils');
const { loadAnalytics, saveAnalytics, ensureGuildData } = require('../utils/analyticsUtils');
const { isAnalyticsEnabled } = require('../utils/analyticsConfigUtils');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot || !message.guild) return;

        // Add XP for the user
        const result = addXP(message.guild.id, message.author.id, 10, message.guild, message.channel);

        // Handle level-up notification
        if (result.leveledUp) {
            const avatarURL = message.author.displayAvatarURL({ dynamic: true, size: 512 });

            const levelUpEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`🎉 Level Up!`)
                .setDescription(`Congratulations, ${message.author}! You reached level ${result.level}!`)
                .addFields({ name: 'Profile', value: `<@${message.author.id}>` })
                .setThumbnail(avatarURL)
                .setFooter({ text: `Keep going, ${message.author.username}!`, iconURL: avatarURL })
                .setTimestamp();

            message.channel.send({ embeds: [levelUpEmbed] });
        }

        // Analytics Tracking
        try {
            if (isAnalyticsEnabled(message.guild.id)) {
                // Ensure guild data exists
                ensureGuildData(message.guild.id);

                // Load analytics data
                const analytics = loadAnalytics();
                const guildData = analytics.guilds[message.guild.id];

                // Update message analytics
                guildData.messages.total += 1;
                guildData.messages.byUser[message.author.id] = (guildData.messages.byUser[message.author.id] || 0) + 1;
                guildData.messages.byChannel[message.channel.id] = (guildData.messages.byChannel[message.channel.id] || 0) + 1;

                // Save analytics data
                saveAnalytics(message.guild.id, guildData);
            } else {
            }
        } catch (error) {
            console.error(`Failed to record analytics for guild ID ${message.guild.id}:`, error);
        }
    },
};
