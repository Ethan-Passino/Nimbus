const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'roleCreate',
    async execute(role) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(role.guild, 'roleCreate')) return;

        const logsChannel = getLogChannel(role.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Role Created')
            .setColor(0x00ff00) // Green
            .addFields(
                { name: 'Role Name', value: `${role.name}`, inline: true },
                { name: 'Role ID', value: `${role.id}`, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
