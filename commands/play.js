const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a YouTube video in your voice channel.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The YouTube URL to play.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const url = interaction.options.getString('url');

        // Validate URL
        if (!ytdl.validateURL(url)) {
            return interaction.reply({ content: 'Please provide a valid YouTube URL.', ephemeral: true });
        }

        const channel = interaction.member.voice.channel;

        // Check if user is in a voice channel
        if (!channel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
        }

        try {
            // Join the voice channel
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            // Create an audio player
            const player = createAudioPlayer();

            // Stream the YouTube audio
            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream);

            // Play the audio
            player.play(resource);
            connection.subscribe(player);

            // Reply to the user
            interaction.reply({ content: `🎵 Now playing: ${url}` });

            // Handle player events
            player.on(AudioPlayerStatus.Playing, () => {
            });

            player.on(AudioPlayerStatus.Idle, () => {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            });

            player.on('error', error => {
                console.error('Error during playback:', error);
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
                    connection.destroy();
                }
            });
        } catch (error) {
            console.error('Error connecting to the voice channel:', error);
            interaction.reply({ content: 'An error occurred while trying to play the audio.', ephemeral: true });
        }
    },
};
