const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setGuildCommandRoles } = require('../utils/permissionUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcommandroles')
        .setDescription('Set which roles can use a specific command in this server.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command name to assign roles to (no slash)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('roles')
                .setDescription('Comma-separated list of role names allowed to use the command')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const commandName = interaction.options.getString('command').toLowerCase();
        const roleNamesInput = interaction.options.getString('roles');

        const roleNames = roleNamesInput.split(',').map(r => r.trim()).filter(r => r.length > 0);
        const guildRoles = interaction.guild.roles.cache;

        const invalidRoles = roleNames.filter(name => !guildRoles.find(role => role.name === name));

        if (invalidRoles.length) {
            return interaction.reply({
                content: `These roles were not found in this server: ${invalidRoles.join(', ')}`,
                ephemeral: true,
            });
        }

        setGuildCommandRoles(interaction.guild.id, commandName, roleNames);

        return interaction.reply({
            content: `✅ Command \`${commandName}\` can now be used by: ${roleNames.join(', ')}`,
            ephemeral: true,
        });
    },
};
