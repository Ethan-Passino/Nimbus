const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(message.guild, 'messageDelete')) return;

        // Ensure the message is from a guild and is not a system message
        if (!message.guild || message.author.bot) return;

        const logsChannel = getLogChannel(message.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        // Get the author's avatar URL
        const authorAvatar = message.author.displayAvatarURL({ dynamic: true, size: 512 });

        // Create an embed with message deletion details
        const embed = new EmbedBuilder()
            .setTitle('Message Deleted')
            .setColor(0xff0000) // Red for deletions
            .setThumbnail(authorAvatar) // Add the author's avatar
            .addFields(
                { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Channel', value: `${message.channel.name} (${message.channel.id})`, inline: true },
                { name: 'Message Content', value: message.content || '[No content]', inline: false },
                { name: 'Created At', value: `<t:${Math.floor(message.createdTimestamp / 1000)}>`, inline: true },
                { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: true }
            )
            .setFooter({ text: `Message ID: ${message.id}` })
            .setTimestamp();

        // Send the embed to the logs channel
        try {
            await logsChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to log message deletion:', error);
        }
    },
};
