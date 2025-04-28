const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getPermissions } = require('../utils/permissionUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getpermissions')
        .setDescription('Displays the role permissions set for each command in this server.'),

    async execute(interaction) {
        const permissions = getPermissions();
        const guildPerms = permissions[interaction.guild.id];

        if (!guildPerms || Object.keys(guildPerms).length === 0) {
            return interaction.reply({
                content: '❌ No command permissions have been set for this server.',
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('📜 Command Permissions')
            .setDescription('Here are the roles allowed for each command:')
            .setColor(0x00AE86);

        for (const [commandName, roles] of Object.entries(guildPerms)) {
            embed.addFields({
                name: `/${commandName}`,
                value: roles.length > 0 ? roles.map(role => `• ${role}`).join('\n') : 'No roles set',
                inline: false,
            });
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
