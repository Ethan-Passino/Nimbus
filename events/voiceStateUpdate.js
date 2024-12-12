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

        const userMention = `<@${newState.member.user.id}>`; // Clickable mention
        const embed = new EmbedBuilder().setColor(0x00aaff).setTimestamp();

        // Voice Channel Join
        if (!oldState.channel && newState.channel) {
            embed
                .setTitle('Voice Channel Joined')
                .setColor(0x00ff00) // Green
                .addFields(
                    { name: 'User', value: `${userMention} (${newState.member.user.tag})`, inline: false },
                    { name: 'Channel', value: `<#${newState.channel.id}>`, inline: false },
                    { name: 'Joined At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: false }
                )
                .setThumbnail(newState.member.user.displayAvatarURL({ dynamic: true }));

            return logsChannel.send({ embeds: [embed] });
        }

        // Voice Channel Leave
        if (oldState.channel && !newState.channel) {
            embed
                .setTitle('Voice Channel Left')
                .setColor(0xff0000) // Red
                .addFields(
                    { name: 'User', value: `${userMention} (${oldState.member.user.tag})`, inline: false },
                    { name: 'Channel', value: `<#${oldState.channel.id}>`, inline: false },
                    { name: 'Left At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: false }
                )
                .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true }));

            return logsChannel.send({ embeds: [embed] });
        }

        // Voice Channel Switch
        if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
            embed
                .setTitle('Voice Channel Switched')
                .setColor(0xffa500) // Orange
                .addFields(
                    { name: 'User', value: `${userMention} (${newState.member.user.tag})`, inline: false },
                    { name: 'Old Channel', value: `<#${oldState.channel.id}>`, inline: true },
                    { name: 'New Channel', value: `<#${newState.channel.id}>`, inline: true },
                    { name: 'Switched At', value: `<t:${Math.floor(Date.now() / 1000)}>`, inline: false }
                )
                .setThumbnail(newState.member.user.displayAvatarURL({ dynamic: true }));

            return logsChannel.send({ embeds: [embed] });
        }
    },
};
