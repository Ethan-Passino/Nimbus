const { addXP } = require('../utils/levelingUtils');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        // Ignore bot messages and DMs
        if (message.author.bot || !message.guild) return;

        // Add XP for the user
        const result = addXP(message.guild.id, message.author.id, 10, message.guild, message.channel); // Award 10 XP per message

        // Handle level-up notification
        if (result.leveledUp) {
            // User profile details
            const avatarURL = message.author.displayAvatarURL({ dynamic: true, size: 512 });

            // Create the embed
            const levelUpEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`🎉 Level Up!`)
                .setDescription(`Congratulations, ${message.author}! You reached level ${result.level}!`)
                .addFields({ name: 'Profile', value: `<@${message.author.id}>` }) 
                .setThumbnail(avatarURL) // User's profile picture
                .setFooter({ text: `Keep going, ${message.author.username}!`, iconURL: avatarURL })
                .setTimestamp();

            // Send the embed
            message.channel.send({ embeds: [levelUpEmbed] });
        }
    },
};
