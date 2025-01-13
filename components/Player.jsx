"use client"

import useSpotify from '@/hooks/useSpotify';
import { formatTime } from '@/lib/misc';
import spotifyApi from '@/lib/spotify';
import { faBackwardStep, faForwardStep, faPauseCircle, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Slider, Tooltip } from '@mui/material';
import { MusicNote03Icon, Playlist03Icon, VolumeHighIcon, VolumeLowIcon } from 'hugeicons-react';
import { Speaker } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react'
import { usePlaybackState, useSpotifyPlayer, WebPlaybackSDK } from 'react-spotify-web-playback-sdk';

const Player = ({ deviceId, setDeviceId, globalIsTrackPlaying, setGlobalIsTrackPlaying, setTrackURI }) => {
    const spotifyApi = useSpotify();

    const getOAuthToken = useCallback((callback) => {
        callback(spotifyApi.getAccessToken());
    }, [spotifyApi]);

    return (
        <WebPlaybackSDK
            initialDeviceName='Spotify clone player'
            getOAuthToken={getOAuthToken}
            initialVolume={0.8}
            connectOnInitialized={true}
        >
            <PlayerUI
                deviceId={deviceId}
                setDeviceId={setDeviceId}
                globalIsTrackPlaying={globalIsTrackPlaying}
                setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                setTrackURI={setTrackURI}
            />
        </WebPlaybackSDK>
    )
};

const PlayerUI = ({ deviceId, setDeviceId, globalIsTrackPlaying, setGlobalIsTrackPlaying, setTrackURI }) => {
    const player = useSpotifyPlayer();
    const [isConnected, setIsConnected] = useState(false);
    const playbackState = usePlaybackState();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);

    useEffect(() => {
        if (player) {
            const handleReady = async ({ device_id }) => {
                console.log('Player ready with devicde ID: ', device_id);
                setDeviceId(device_id);
                
                const success = await player.connect();
                if (success) {
                    console.log('Player connected successfully!');
                    setIsConnected(true);

                    // Transfer playback to this device
                    spotifyApi.transferMyPlayback([device_id], false).then(() => {
                        console.log(`Playback transferred to device ID: ${device_id}`);
                    }).catch((err) => {
                        console.error('Error transferring playback:', err);
                    });
                }
            };

            const handleNotReady = ({ device_id }) => {
                console.log('Device ID has gone offline:', device_id);
                if (isConnected) {
                    player.disconnect();
                    setIsConnected(false);
                    console.log('Player disconnected due to device going offline.');
                }
            };

            player.addListener('ready', handleReady);
            player.addListener('not_ready', handleNotReady);

            return () => {
                player.removeListener('ready', handleReady);
                player.removeListener('not_ready', handleNotReady);
            };
        }
    }, [player]);

    useEffect(() => {
        if (playbackState) {
            // setPlayURI(playbackState.track_window.current_track.uri);
            setTrackURI(playbackState.track_window.current_track.uri);
            setProgress(playbackState.position);
            setDuration(playbackState.duration);
            if (playbackState.paused) {
                setGlobalIsTrackPlaying(false);
            } else {
                setGlobalIsTrackPlaying(true);
            }
        }
    }, [playbackState]);

    useEffect(() => {
        if (player) {
            player.addListener('player_state_changed', (state) => {
                if (state && state.paused && state.position === 0 && state.track_window.previous_tracks.length > 0) {
                    setGlobalIsTrackPlaying(false);
                }
            });
        }
    }, [player, setGlobalIsTrackPlaying]);

    const currentTrack = playbackState?.track_window?.current_track;

    useEffect(() => {
        const interval = setInterval(() => {
            if (globalIsTrackPlaying && playbackState) {
                setProgress(prev => Math.min(prev + 1000, duration));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [globalIsTrackPlaying, playbackState, duration]);

    const handleSeek = (e) => {
        setProgress(e.target.value);
        player.seek(e.target.value).catch(err => console.error('Error seeking:', err));
    };

    const handlePlayPause = () => {
        if (globalIsTrackPlaying) {
            player.pause()
                .then(() => setGlobalIsTrackPlaying(false))
                .catch((err) => console.error('Error pausing playback:', err));
        } else {
            player.resume()
                .then(() => setGlobalIsTrackPlaying(true))
                .catch((err) => console.error('Error resuming playback:', err));
        }
    };

    const handleNextTrack = async () => {
        try {
            await player.nextTrack();
            setGlobalIsTrackPlaying(true);
        } catch (err) {
            console.error('Error skipping to next track with player:', err);
            // Fallback to spotifyApi if player.nextTrack() fails
            try {
                await spotifyApi.skipToNext({ device_id: deviceId });
                setGlobalIsTrackPlaying(true);
            } catch (apiErr) {
                console.error('Error skipping to next track with spotifyApi:', apiErr);
            }
        }
    };

    const handlePreviousTrack = async () => {
        try {
            await player.previousTrack();
            setGlobalIsTrackPlaying(true);
        } catch (err) {
            console.error('Error going to previous track with player:', err);
            // Fallback to spotifyApi if player.previousTrack() fails
            try {
                await spotifyApi.skipToPrevious({ device_id: deviceId });
                setGlobalIsTrackPlaying(true);
            } catch (apiErr) {
                console.error('Error going to previous track with spotifyApi:', apiErr);
            }
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
        player.setVolume(e.target.value / 100).catch(err => console.error('Error setting volume:', err));
    };

    return (
        <div className='h-[calc(100vh_-_100px)] max-w-[30%] w-[30%] flex flex-col bg-[#18181d] rounded-lg text-[#d2d2d2] border 
        border-[#303036] mx-7 overflow-hidden'>
            <div className='flex justify-between items-center p-7'>
                {isConnected ? (
                    <Tooltip title={`Player connected with device ID: ${deviceId}`} arrow>
                        <Speaker size={20} className='inline-block text-[#1DB954]' />
                    </Tooltip>
                ) : (
                    <Tooltip title={`Player disconnected`} arrow>
                        <Speaker size={20} className='inline-block text-[#b91d1d]' />
                    </Tooltip>
                )}
                <Playlist03Icon size={20} className='inline-block text-[#d2d2d2]' />
            </div>
            <div className='flex flex-col items-center justify-center h-full flex-grow p-7 pt-0'>
                {currentTrack ? (
                    <div className='flex flex-col items-center max-w-full w-[100%]'>
                        <img src={currentTrack?.album?.images?.[0]?.url} alt={currentTrack?.name} className='w-[100%] rounded-md' />
                        <p className='text-[#d2d2d2] text-center mt-7 w-[100%] truncate'>{currentTrack?.name}</p>
                        <p className='text-[#a5a5a5] text-center mt-1 w-[90%] truncate'>{currentTrack?.artists?.map(artist => artist.name).join(', ')}</p>
                        <p className='text-[#757575] text-center mt-1 w-[80%] truncate'>{currentTrack?.album?.name}</p>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center w-[100%] h-[70%]'>
                        <div className='flex items-center justify-center bg-[#0d0d0f] p-5 rounded-md w-[100%] h-[70%]'>
                            <MusicNote03Icon className='text-[#757575]' size={100} />
                        </div>
                        <p className='text-[#d2d2d2] mt-7'>No current track is playing</p>
                    </div>
                )}
                {duration > 0 && (
                    <div className="w-[100%] mt-5">
                        <Slider
                            size='small'
                            value={progress}
                            onChange={handleSeek}
                            min={0}
                            max={duration}
                            step={1}
                            sx={{
                                color: '#1DB954',
                                '& .MuiSlider-thumb': {
                                    backgroundColor: '#1DB954',
                                },
                                '& .MuiSlider-rail': {
                                    backgroundColor: '#3b3b42',
                                },
                            }}
                        />
                        <div className='flex items-center justify-between'>
                            <span className='text-xs'>{formatTime(progress)}</span>
                            <span className='text-xs'>{formatTime(duration)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Section - Player controls */}
            <div className='flex flex-col items-center justify-center p-7 pt-0'>
                <div className='flex flex-row items-center'>
                    <Button onClick={handlePreviousTrack} className="p-0 w-0 text-xl hover:bg-transparent">
                        <FontAwesomeIcon icon={faBackwardStep} size='xl' color='#d2d2d2'/>
                    </Button>
                    {globalIsTrackPlaying ? (
                        <Button onClick={handlePlayPause} className="p-0 w-0 text-2xl hover:bg-transparent">
                            <FontAwesomeIcon icon={faPauseCircle} size='xl' color='#d2d2d2'/>
                        </Button> ) : (
                        <Button onClick={handlePlayPause} className="p-0 w-0 text-2xl hover:bg-transparent">
                            <FontAwesomeIcon icon={faPlayCircle} size='xl' color='#d2d2d2'/>
                        </Button>
                    )}
                    <Button onClick={handleNextTrack} className="p-0 w-0 text-xl hover:bg-transparent">
                        <FontAwesomeIcon icon={faForwardStep} size='xl' color='#d2d2d2'/>
                    </Button>
                </div>
                <div className='flex flex-row items-center w-[75%] justify-between mt-7'>
                    <VolumeLowIcon className='text-[#d2d2d2]' size={20} />
                    <Slider
                        size='small'
                        value={volume}
                        onChange={handleVolumeChange}
                        min={0}
                        max={100}
                        step={1}
                        sx={{
                            color: '#1DB954',
                            width: '60%',
                            '& .MuiSlider-thumb': {
                                backgroundColor: '#1DB954',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: '#3b3b42',
                            },
                        }}
                    />
                    <VolumeHighIcon className='text-[#d2d2d2]' size={20} />
                </div>
            </div>
        </div>
    );
}

export default Player;