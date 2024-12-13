const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about this server.'),
    async execute(interaction) {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle(`${guild.name} - Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Boost Level', value: `${guild.premiumTier}`, inline: true },
                { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Created At', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
            )
            .setFooter({ text: `Server ID: ${guild.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
