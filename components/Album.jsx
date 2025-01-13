"use client"

import useAlbum from '@/hooks/useAlbum';
import useAlbumTracks from '@/hooks/useAlbumTracks';
import useSpotify from '@/hooks/useSpotify';
import { millisToMinutesAndSeconds } from '@/lib/misc';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { shuffle } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useExtractColors } from 'react-extract-colors';

const colours = [
    'indigo',
    'blue',
    'green',
    'red',
    'yellow',
    'pink',
    'purple'
];

const Header = ({ album, setGlobalIsTrackPlaying, setPlayURI, deviceId, globalIsTrackPlaying, playURI }) => {
    const [ headerGradient, setHeaderGradient ] = useState(shuffle(colours).pop());

    const { dominantColor } = useExtractColors(album?.images?.[0]?.url);

    const spotifyApi = useSpotify();

    useEffect(() => {
        if (dominantColor) {
            setHeaderGradient(
                `linear-gradient(to bottom, ${dominantColor}, #18181d)`
            );
        } else {
            const fallbackColor = shuffle(colours).pop();
            setHeaderGradient(`linear-gradient(to bottom, ${fallbackColor}, #18181d)`);
        }
    }, [dominantColor]);

    const handlePlayClick = async () => {
        if (deviceId && spotifyApi.getAccessToken()) {
          await spotifyApi.play({ device_id: deviceId, context_uri: album.uri }).then(() => { 
            setGlobalIsTrackPlaying(true);
            setPlayURI(album.uri);
          }).catch((err) => {
              console.error('Error when playing context URI: ', err);
          });
        }
    }

    return (
        <section style={{ background: headerGradient }} className='h-[35%] rounded-t-lg flex flex-col md:flex-row items-center text-left md:items-end p-6'>
            <div className='flex-shrink-0 mb-6 md:mb-0'>
                <img className='h-40 w-40 rounded-sm' src={album?.images?.[0]?.url} alt={album?.name} />
            </div>
            <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
                <p className='text-sm font-bold hidden md:flex capitalize'>{album?.album_type}</p>
                <div className="flex w-full items-center">
                    <div className="flex-grow pr-4">
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-extrabold overflow-ellipsis'>
                            {album?.name}
                        </h1>
                    </div>
                    <Button onClick={handlePlayClick} className="flex-shrink-0 bg-[#1DB954] rounded-full p-4 h-16 w-16 flex items-center justify-center">
                        {globalIsTrackPlaying && playURI === album?.uri ? (
                            <FontAwesomeIcon icon={faPause} size='xl' color='black'/>
                        ) : (
                            <FontAwesomeIcon icon={faPlay} size='xl' color='black' />
                        )}
                    </Button>
                </div>
            </div>
        </section>
    );
}

const Album = ({ 
    setView, 
    globalAlbumId, 
    setGlobalArtistId, 
    globalIsTrackPlaying, 
    setGlobalIsTrackPlaying, 
    playURI, 
    setPlayURI, 
    deviceId, 
    setPreviewView, 
    trackURI
 }) => {
    const { album, loading, error } = useAlbum(globalAlbumId);
    const { albumTracks, loadingAlbumTracks, errorAlbumTracks } = useAlbumTracks(globalAlbumId);

    function selectArtist(artist) {
        setView("artist");
        setPreviewView("artist");
        setGlobalArtistId(artist.id);
    }

    return (
        <div className='flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]'>
            <div className='flex flex-col items-start'>
                {loading && (<p className="text-[#d2d2d2] m-3">Loading album...</p>)}
                {error && (<p className="text-red-400 p-8">Error fetching album: {error.message}</p>)}
                {!loading && !error && album && (
                    <div key={album?.id} className='h-full w-full'>
                        <Header album={album} setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} setPlayURI={setPlayURI} deviceId={deviceId} globalIsTrackPlaying={globalIsTrackPlaying} playURI={playURI} />
                        {loadingAlbumTracks && (<p className="text-[#d2d2d2] m-3">Loading album's tracks...</p>)}
                        {errorAlbumTracks && (<p className="text-red-400 p-8">Error fetching album's tracks: {errorAlbumTracks.message}</p>)}
                        {albumTracks?.length > 0 && albumTracks?.map((obj, i) => (
                            <div 
                                key={`${obj.id}-${i}`}
                                className={`grid grid-cols-[2%,80%,5%] items-center gap-x-6 py-4 px-6 ${i !== albumTracks?.length - 1 ? 'border-b border-b-[#303036]' : ''}`}
                            >
                                <div className="text-[#a5a5a5]">{i + 1}</div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                                        {trackURI === obj.uri ? (
                                            <p className="text-[#1DB954] truncate">{obj.name}</p>
                                        ) : (
                                            <p className="text-[#e5e5e5] truncate">{obj.name}</p>
                                        )}
                                        <div className="text-[#a5a5a5] truncate">
                                            {obj.artists?.map((artist, j) => {
                                                return (
                                                    <span key={`${artist.id}-${j}`}>
                                                        <span onClick={() => selectArtist(artist)} className='cursor-pointer hover:underline'>{artist.name}</span>
                                                        <span>{ j != obj.artists.length - 1 ? ', ' : null }</span>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[#a5a5a5]">
                                    {millisToMinutesAndSeconds(obj.duration_ms)}
                                </div>
                            </div>
                        ))}
                        {!loadingAlbumTracks && !errorAlbumTracks && !albumTracks && (
                            <p className="text-[#d2d2d2] m-3">No album tracks found.</p>
                        )}
                        <div key={album?.id} className='text-sm px-6 my-4 text-[#a5a5a5]'>
                            {new Date(album?.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                            {
                                album?.copyrights?.map((copyright, j) => {
                                    return <p key={j} className='text-xs mt-2'>{copyright.text}</p>
                                })
                            }
                        </div>
                    </div>
                )}
                {!loading && !error && !album && (
                    <p className="text-[#d2d2d2] m-3">No album found.</p>
                )}
            </div>
        </div>
    );
}

export default Album;