const { SlashCommandBuilder } = require('@discordjs/builders');
const { getGuildColors, getGuildSettings } = require('../utils/colorsUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assigncolor')
        .setDescription('Assign yourself a color role or remove all colors')
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Choose a color or None to remove all colors')
                .setRequired(true)
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const guildId = interaction.guild.id;
        const colors = getGuildColors(guildId);
        const choices = [{ name: 'None', value: 'none' }];

        for (const color in colors) {
            choices.push({ name: color, value: color });
        }

        await interaction.respond(choices.slice(0, 25)); // Discord limits to 25 choices
    },
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const colorName = interaction.options.getString('color').toLowerCase();
        const colors = getGuildColors(guildId);
        const settings = getGuildSettings(guildId);

        const requiredRoleId = settings.assignColorRole;
        if (requiredRoleId !== 'everyone' && !interaction.member.roles.cache.has(requiredRoleId)) {
            return interaction.reply({
                content: 'You do not have the required role to use this command.',
                ephemeral: true,
            });
        }

        const member = interaction.member;

        if (colorName === 'none') {
            const colorRoles = member.roles.cache.filter(r => r.name.startsWith('color-'));
            if (colorRoles.size > 0) {
                await member.roles.remove(colorRoles);
                return interaction.reply('All color roles have been removed.');
            } else {
                return interaction.reply('You don’t have any color roles assigned.');
            }
        }

        if (!colors[colorName]) {
            return interaction.reply({ content: `No color named "${colorName}" exists.`, ephemeral: true });
        }

        const hex = colors[colorName];
        const roleName = `color-${colorName}`;
        let role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            try {
                role = await interaction.guild.roles.create({
                    name: roleName,
                    color: hex,
                    reason: `Color role "${roleName}" created.`,
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: 'An error occurred while creating the role. Please try again.', ephemeral: true });
            }
        }

        const colorRoles = member.roles.cache.filter(r => r.name.startsWith('color-'));
        await member.roles.remove(colorRoles);
        await member.roles.add(role);

        return interaction.reply(`You have been assigned the color "${colorName}".`);
    },
};