const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'guildMemberUpdate',
    async execute(oldMember, newMember) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(oldMember.guild, 'guildMemberUpdate')) return;

        const logsChannel = getLogChannel(oldMember.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const userMention = `<@${newMember.id}>`; // Clickable mention for the user
        const userAvatar = newMember.user.displayAvatarURL({ dynamic: true, size: 512 }); // User avatar URL

        // Nickname Changes
        if (oldMember.nickname !== newMember.nickname) {
            const embed = new EmbedBuilder()
                .setTitle('Nickname Changed')
                .setColor(0x00aaff) // Blue
                .setThumbnail(userAvatar) // Add user avatar
                .addFields(
                    { name: 'User', value: `${userMention} (${newMember.user.tag})`, inline: false }, // Clickable mention
                    { name: 'Old Nickname', value: oldMember.nickname || 'None', inline: true },
                    { name: 'New Nickname', value: newMember.nickname || 'None', inline: true },
                    { name: 'Changed At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
                )
                .setTimestamp();

            await logsChannel.send({ embeds: [embed] });
        }

        // Role Updates
        const oldRoles = oldMember.roles.cache.map(r => r.name);
        const newRoles = newMember.roles.cache.map(r => r.name);

        const addedRoles = newRoles.filter(r => !oldRoles.includes(r));
        const removedRoles = oldRoles.filter(r => !newRoles.includes(r));

        if (addedRoles.length || removedRoles.length) {
            const embed = new EmbedBuilder()
                .setTitle('Roles Updated')
                .setColor(0xffa500) // Orange
                .setThumbnail(userAvatar) // Add user avatar
                .addFields(
                    { name: 'User', value: `${userMention} (${newMember.user.tag})`, inline: false }, // Clickable mention
                    { name: 'Added Roles', value: addedRoles.join(', ') || 'None', inline: true },
                    { name: 'Removed Roles', value: removedRoles.join(', ') || 'None', inline: true },
                    { name: 'Updated At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
                )
                .setTimestamp();

            await logsChannel.send({ embeds: [embed] });
        }
    },
};
