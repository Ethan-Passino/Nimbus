const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(oldState.guild, 'voiceStateUpdate')) return;

        const logsChannel = getLogChannel(oldState.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder().setColor(0x00aaff).setTimestamp();

        // Voice Channel Join
        if (!oldState.channel && newState.channel) {
            embed
                .setTitle('Voice Channel Joined')
                .addFields(
                    { name: 'User', value: `${newState.member.user.tag} (${newState.member.user.id})`, inline: false },
                    { name: 'Channel', value: `${newState.channel.name} (${newState.channel.id})`, inline: false },
                    { name: 'Joined At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: false }
                )
                .setThumbnail(newState.member.user.displayAvatarURL({ dynamic: true }));

            return await logsChannel.send({ embeds: [embed] });
        }

        // Voice Channel Leave
        if (oldState.channel && !newState.channel) {
            embed
                .setTitle('Voice Channel Left')
                .addFields(
                    { name: 'User', value: `${oldState.member.user.tag} (${oldState.member.user.id})`, inline: false },
                    { name: 'Channel', value: `${oldState.channel.name} (${oldState.channel.id})`, inline: false },
                    { name: 'Left At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: false }
                )
                .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }));

            return await logsChannel.send({ embeds: [embed] });
        }
    },
};
