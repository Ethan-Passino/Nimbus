const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');

module.exports = {
    name: 'channelCreate',
    async execute(channel) {
        const logsChannel = getLogChannel(channel.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Channel Created')
            .setColor(0x00ff00) // Green
            .addFields(
                { name: 'Channel Name', value: `${channel.name}`, inline: true },
                { name: 'Channel Type', value: `${channel.type}`, inline: true },
                { name: 'Channel ID', value: `${channel.id}`, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
