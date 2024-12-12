const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');

module.exports = {
    name: 'roleDelete',
    async execute(role) {
        const logsChannel = getLogChannel(role.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Role Deleted')
            .setColor(0xff0000) // Red
            .addFields(
                { name: 'Role Name', value: `${role.name}`, inline: true },
                { name: 'Role ID', value: `${role.id}`, inline: true },
                { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
