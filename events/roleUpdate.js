const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'roleUpdate',
    async execute(oldRole, newRole) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(oldRole.guild, 'roleUpdate')) return;

        const logsChannel = getLogChannel(oldRole.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Role Updated')
            .setColor(0xffa500) // Orange
            .addFields(
                { name: 'Role Name', value: `${newRole.name}`, inline: true },
                { name: 'Old Permissions', value: `${oldRole.permissions.bitfield}`, inline: true },
                { name: 'New Permissions', value: `${newRole.permissions.bitfield}`, inline: true },
                { name: 'Updated At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
