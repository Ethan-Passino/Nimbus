const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        // Check if logging for this event is enabled for the guild
        if (!isEventEnabled(member.guild, 'guildMemberAdd')) return;

        const logsChannel = getLogChannel(member.guild);
        if (!logsChannel) return; // Skip if no log channel is set

        const embed = new EmbedBuilder()
            .setTitle('Member Joined')
            .setColor(0x00ff00) // Green
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: false },
                { name: 'Joined At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
