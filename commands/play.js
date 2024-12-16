const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');
const queue = new Map();
const originalWrite = process.stdout.write;
process.stdout.write = function (chunk, encoding, callback) {
    if (chunk.includes('Copyright (C) 2014 by Vitaly Puzrin')) {
        // Ignore specific logs, having weird issues that log unneeded stuff
        return;
    }
    originalWrite.apply(process.stdout, arguments);
};


module.exports = {
    queue, // Export the queue for use in other commands

    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song or adds it to the queue.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Search for a song or provide a YouTube URL.')
                .setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        const guildQueue = queue.get(interaction.guild.id) || {
            songs: [],
            connection: null,
            player: createAudioPlayer(),
        };
        queue.set(interaction.guild.id, guildQueue);

        if (ytdl.validateURL(query)) {
            const songInfo = await ytdl.getBasicInfo(query);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };

            guildQueue.songs.push(song);
            await interaction.reply({ content: `Added **${song.title}** to the queue!`, ephemeral: true });

            if (!guildQueue.connection) {
                guildQueue.connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                this.playSong(interaction.guild.id);
            }
        } else {
            const searchResults = await ytSearch(query);

            if (!searchResults.videos.length) {
                return interaction.reply({ content: 'No results found for your search.', ephemeral: true });
            }

            // Paginate search results
            const resultsPerPage = 5;
            const pages = [];
            for (let i = 0; i < searchResults.videos.length; i += resultsPerPage) {
                pages.push(searchResults.videos.slice(i, i + resultsPerPage));
            }

            let currentPage = 0;

            const createEmbed = (page) => {
                const embed = new EmbedBuilder()
                    .setTitle('Search Results')
                    .setDescription(
                        page.map((video, index) => `**${index + 1}.** [${video.title}](${video.url})`).join('\n')
                    )
                    .setFooter({ text: `Page ${currentPage + 1} of ${pages.length}` })
                    .setColor(0x00ae86);
                return embed;
            };

            const createButtons = (page) => {
                const row = new ActionRowBuilder();
                page.forEach((_, index) => {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId(`select_${index}`)
                            .setLabel(`${index + 1}`)
                            .setStyle(ButtonStyle.Primary)
                    );
                });

                return row;
            };

            const navigationRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === pages.length - 1)
            );

            const message = await interaction.reply({
                embeds: [createEmbed(pages[currentPage])],
                components: [createButtons(pages[currentPage]), navigationRow],
                ephemeral: true,
            });

            const collector = message.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (btnInteraction) => {
                if (btnInteraction.user.id !== interaction.user.id) {
                    return btnInteraction.reply({ content: 'This interaction is not for you!', ephemeral: true });
                }

                if (btnInteraction.customId === 'prev') {
                    currentPage = Math.max(0, currentPage - 1);
                } else if (btnInteraction.customId === 'next') {
                    currentPage = Math.min(pages.length - 1, currentPage + 1);
                } else if (btnInteraction.customId.startsWith('select_')) {
                    const index = parseInt(btnInteraction.customId.split('_')[1], 10);
                    const selectedVideo = pages[currentPage][index];
                    const song = {
                        title: selectedVideo.title,
                        url: selectedVideo.url,
                    };

                    guildQueue.songs.push(song);

                    // Disable all buttons
                    const disabledButtons = new ActionRowBuilder();
                    pages[currentPage].forEach((_, index) => {
                        disabledButtons.addComponents(
                            new ButtonBuilder()
                                .setCustomId(`select_${index}`)
                                .setLabel(`${index + 1}`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true)
                        );
                    });

                    const disabledNavigationRow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    );

                    await btnInteraction.update({
                        content: `Added **${song.title}** to the queue!`,
                        embeds: [createEmbed(pages[currentPage])],
                        components: [disabledButtons, disabledNavigationRow],
                    });

                    if (!guildQueue.connection) {
                        guildQueue.connection = joinVoiceChannel({
                            channelId: voiceChannel.id,
                            guildId: interaction.guild.id,
                            adapterCreator: interaction.guild.voiceAdapterCreator,
                        });

                        this.playSong(interaction.guild.id);
                    }

                    collector.stop();
                    return;
                }

                await btnInteraction.update({
                    embeds: [createEmbed(pages[currentPage])],
                    components: [createButtons(pages[currentPage]), navigationRow],
                });
            });

            collector.on('end', () => {
                message.edit({
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Secondary).setDisabled(true),
                            new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Secondary).setDisabled(true)
                        ),
                    ],
                });
            });
        }
    },

    playSong(guildId) {
        const guildQueue = queue.get(guildId);

        if (!guildQueue.songs.length) {
            guildQueue.connection.destroy();
            queue.delete(guildId);
            return;
        }

        const song = guildQueue.songs.shift();

        const stream = ytdl(song.url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);

        guildQueue.player.play(resource);
        guildQueue.connection.subscribe(guildQueue.player);

        guildQueue.player.on(AudioPlayerStatus.Idle, () => this.playSong(guildId));
    },
};
