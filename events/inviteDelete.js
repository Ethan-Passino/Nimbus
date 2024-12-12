const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'inviteDelete',
    async execute(invite) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(invite.guild, 'inviteDelete')) return;

        const logsChannel = getLogChannel(invite.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Invite Deleted')
            .setColor(0xff0000) // Red
            .addFields(
                { name: 'Code', value: invite.code, inline: true },
                { name: 'Channel', value: `${invite.channel.name} (${invite.channel.id})`, inline: true },
                { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
