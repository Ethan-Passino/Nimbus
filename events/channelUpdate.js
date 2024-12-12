const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'channelUpdate',
    async execute(oldChannel, newChannel) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(oldChannel.guild, 'channelUpdate')) return;

        const logsChannel = getLogChannel(oldChannel.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Channel Updated')
            .setColor(0xffa500) // Orange
            .addFields(
                { name: 'Channel Name', value: `${newChannel.name}`, inline: true },
                { name: 'Channel ID', value: `${newChannel.id}`, inline: true },
                { name: 'Old Topic', value: oldChannel.topic || 'None', inline: true },
                { name: 'New Topic', value: newChannel.topic || 'None', inline: true },
                { name: 'Updated At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
