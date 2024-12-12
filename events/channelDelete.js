const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'channelDelete',
    async execute(channel) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(channel.guild, 'channelDelete')) return;

        const logsChannel = getLogChannel(channel.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Channel Deleted')
            .setColor(0xff0000) // Red
            .addFields(
                { name: 'Channel Name', value: `${channel.name}`, inline: true },
                { name: 'Channel Type', value: `${channel.type}`, inline: true },
                { name: 'Channel ID', value: `${channel.id}`, inline: true },
                { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
