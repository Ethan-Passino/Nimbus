const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Fetch information about a guild member.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to fetch information about')
                .setRequired(false)),
    async execute(interaction) {
        const { guild, options } = interaction;

        // Get the target user (or default to the command executor)
        const targetUser = options.getUser('user') || interaction.user;
        const member = guild.members.cache.get(targetUser.id);

        // Fetch user and guild member details
        const roles = member?.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.toString())
            .join(', ') || 'No roles';

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle(`${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(`<@${targetUser.id}>`) // Mention that is clickable
            .addFields(
                { name: 'User ID', value: targetUser.id, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`, inline: true },
                { name: 'Joined Server', value: member?.joinedAt ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'N/A', inline: true },
                { name: 'Roles', value: roles }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
