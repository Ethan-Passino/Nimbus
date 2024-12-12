const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(channel.guild, 'channelCreate')) return;

        const logsChannel = getLogChannel(channel.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Channel Created')
            .setColor(0x00ff00) // Green
            .addFields(
                { name: 'Channel Name', value: `${channel.name} (<#${channel.id}>)`, inline: true },
                { name: 'Channel Type', value: `${channel.type}`, inline: true },
                { name: 'Channel ID', value: `${channel.id}`, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
