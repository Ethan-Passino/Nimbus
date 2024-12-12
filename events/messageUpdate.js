const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(oldMessage.guild, 'messageUpdate')) return;

        // Ensure the message is from a guild, is not a system message, and the content was actually changed
        if (!oldMessage.guild || oldMessage.author.bot || oldMessage.content === newMessage.content) return;

        const logsChannel = getLogChannel(oldMessage.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        // Get the author's avatar URL
        const authorAvatar = oldMessage.author.displayAvatarURL({ dynamic: true, size: 512 });

        // Create a clickable mention for the author
        const authorMention = `<@${oldMessage.author.id}>`;

        // Create an embed with message edit details
        const embed = new EmbedBuilder()
            .setTitle('Message Edited')
            .setColor(0xffa500) // Orange for edits
            .setThumbnail(authorAvatar) // Add the author's avatar
            .addFields(
                { name: 'Author', value: `${authorMention} (${oldMessage.author.tag})`, inline: true },
                { name: 'Channel', value: `${oldMessage.channel.name} (<#${oldMessage.channel.id}>)`, inline: true },
                { name: 'Original Content', value: oldMessage.content || '[No content]', inline: false },
                { name: 'Edited Content', value: newMessage.content || '[No content]', inline: false },
                { name: 'Created At', value: `<t:${Math.floor(oldMessage.createdTimestamp / 1000)}>`, inline: true },
                { name: 'Edited At', value: `<t:${Math.floor(newMessage.editedTimestamp / 1000)}>`, inline: true }
            )
            .setFooter({ text: `Message ID: ${oldMessage.id}` })
            .setTimestamp();

        // Send the embed to the logs channel
        try {
            await logsChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to log message edit:', error);
        }
    },
};
