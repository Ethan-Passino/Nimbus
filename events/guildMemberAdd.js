const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');
const isEventEnabled = require('../utils/isEventEnabled');
const { loadAnalytics, saveAnalytics, ensureGuildData } = require('../utils/analyticsUtils');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        // Ensure guild data exists
        ensureGuildData(member.guild.id);

        // Track analytics for member joins
        const analytics = loadAnalytics();
        const guildData = analytics.guilds[member.guild.id];
        guildData.memberStats.joins += 1;
        saveAnalytics(analytics);

        if (!isEventEnabled(member.guild, 'guildMemberAdd')) return;

        const logsChannel = getLogChannel(member.guild);
        if (!logsChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('Member Joined')
            .setColor(0x00ff00)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: false },
                { name: 'Joined At', value: `<t:${Math.floor(Date.now() / 1000)}>` }
            )
            .setTimestamp();

        await logsChannel.send({ embeds: [embed] });
    },
};
