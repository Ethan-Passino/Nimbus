const { EmbedBuilder } = require('discord.js');
const getLogChannel = require('../utils/getLogChannel');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
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
