const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');

module.exports = {
    name: 'inviteCreate',
    async execute(invite) {
        const logsChannel = getLogChannel(invite.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Invite Created')
            .setColor(0x00ff00) // Green
            .addFields(
                { name: 'Code', value: invite.code, inline: true },
                { name: 'Inviter', value: `${invite.inviter.tag} (${invite.inviter.id})`, inline: true },
                { name: 'Channel', value: `${invite.channel.name} (${invite.channel.id})`, inline: true },
                { name: 'Max Uses', value: `${invite.maxUses || 'Unlimited'}`, inline: true },
                { name: 'Expires At', value: invite.expiresAt ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}>` : 'Never', inline: true },
                { name: 'Created At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
