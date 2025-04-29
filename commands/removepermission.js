const { SlashCommandBuilder } = require('discord.js');
const { removeRoleFromCommand } = require('../utils/permissionUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepermission')
        .setDescription('Removes a role\'s permission to use a specific command in this server.')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command name.')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove permission from.')
                .setRequired(true)),
    
    async execute(interaction) {
        const commandName = interaction.options.getString('command');
        const role = interaction.options.getRole('role');

        const success = removeRoleFromCommand(interaction.guild.id, commandName, role.name);

        if (success) {
            await interaction.reply({ content: `✅ Removed **${role.name}** from allowed roles for **/${commandName}**.`, ephemeral: true });
        } else {
            await interaction.reply({ content: `⚠️ No permissions found for **/${commandName}** or nothing to remove.`, ephemeral: true });
        }
    }
};
