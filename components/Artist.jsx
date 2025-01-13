"use client"

import useArtist from '@/hooks/useArtist';
import useArtistDiscography from '@/hooks/useArtistDiscography';
import useArtistTopTracks from '@/hooks/useArtistTopTracks';
import { millisToMinutesAndSeconds } from '@/lib/misc';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardContent, CardMedia } from '@mui/material';
import { shuffle } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useExtractColors } from 'react-extract-colors';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import useSpotify from '@/hooks/useSpotify';

const colours = [
    'indigo',
    'blue',
    'green',
    'red',
    'yellow',
    'pink',
    'purple'
];

const Header = ({ artist, setGlobalIsTrackPlaying, setPlayURI, deviceId, globalIsTrackPlaying, playURI }) => {
    const [ headerGradient, setHeaderGradient ] = useState(shuffle(colours).pop());

    const { dominantColor } = useExtractColors(artist?.images?.[0]?.url);

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
          await spotifyApi.play({ device_id: deviceId, context_uri: artist.uri }).then(() => { 
            setGlobalIsTrackPlaying(true);
            setPlayURI(artist.uri);
          }).catch((err) => {
              console.error('Error when playing context URI: ', err);
          });
        }
    }

    return (
        <section style={{ background: headerGradient }} className='h-[35%] rounded-t-lg flex flex-col md:flex-row items-center text-left md:items-end p-6'>
            <div className='flex-shrink-0 mb-6 md:mb-0'>
                <img className='h-40 w-40 rounded-full' src={artist?.images?.[0]?.url} alt={artist?.name} />
            </div>
            <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
                <p className='text-sm font-bold hidden md:flex'>Artist</p>
                <div className="flex w-full items-center">
                    <div className="flex-grow pr-4">
                        <h1 className='text-2xl md:text-3xl lg:text-4xl font-extrabold overflow-ellipsis'>
                            {artist?.name}
                        </h1>
                    </div>
                    <Button onClick={handlePlayClick} className="flex-shrink-0 bg-[#1DB954] rounded-full p-4 h-16 w-16 flex items-center justify-center">
                        {globalIsTrackPlaying && playURI === artist?.uri ? (
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

const Artist = ({ 
    setView, 
    globalArtistid, 
    setGlobalArtistId,
    setGlobalAlbumId, 
    playURI, 
    globalIsTrackPlaying, 
    setGlobalIsTrackPlaying, 
    setPlayURI, 
    deviceId, 
    setPreviewView, 
    trackURI
 }) => {
    const { artist, loading, error } = useArtist(globalArtistid);
    const { topTracks, loadingTopTracks, errorTopTracks } = useArtistTopTracks(globalArtistid);
    const { discography, loadingDiscography, errorDiscography } = useArtistDiscography(globalArtistid);

    const [visibleTracks, setVisibleTracks] = useState(5);

    function selectArtist(artist) {
        setView("artist");
        setPreviewView("artist");
        setGlobalArtistId(artist.id);
    }

    function selectAlbum(album) {
        setView("album");
        setPreviewView("album")
        setGlobalAlbumId(album.id);
    }

    const toggleTracks = () => {
        if (visibleTracks === 5) {
          setVisibleTracks(10);
        } else {
          setVisibleTracks(5);
        }
    };

    return (
        <div className='flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]'>
            <div className='flex flex-col items-start'>
                {loading && (<p className="text-[#d2d2d2] m-3">Loading artist...</p>)}
                {error && (<p className="text-red-400 p-8">Error fetching artist: {error.message}</p>)}
                {!loading && !error && artist && (
                    <div key={artist?.id} className='h-full w-full'>
                        <Header artist={artist} setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} setPlayURI={setPlayURI} deviceId={deviceId} globalIsTrackPlaying={globalIsTrackPlaying} playURI={playURI} />
                        {loadingTopTracks && (<p className="text-[#d2d2d2] m-3">Loading {artist?.name}'s top tracks...</p>)}
                        {errorTopTracks && (<p className="text-red-400 p-8">Error fetching {artist?.name}'s top tracks: {errorTopTracks.message}</p>)}
                        {!loadingTopTracks && !errorTopTracks && topTracks && (
                            <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mt-5'>Popular</h2>
                        )}
                        {topTracks?.tracks?.length > 0 && topTracks?.tracks?.slice(0, visibleTracks).map((obj, i) => (
                            <div 
                                key={`${obj.id}-${i}`}
                                className={`grid grid-cols-[2%,45%,35%,5%] items-center gap-x-6 py-4 px-6 ${i !== topTracks?.tracks?.length - 1 ? 'border-b border-b-[#303036]' : ''}`}
                            >
                                <div className="text-[#a5a5a5]">{i + 1}</div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={obj.album.images[0].url}
                                        alt={obj.album.name}
                                        className="w-10 h-10 rounded-md"
                                    />
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
                                <div className="text-[#a5a5a5] cursor-pointer hover:underline truncate" onClick={() => {selectAlbum(obj.album)}}>{obj.album.name}</div>
                                <div className="text-[#a5a5a5]">
                                    {millisToMinutesAndSeconds(obj.duration_ms)}
                                </div>
                            </div>
                        ))}
                        {topTracks?.tracks?.length > 5 && (
                            <Button
                                onClick={toggleTracks}
                                className="text-[#a5a5a5] mt-4 mx-4 hover:bg-transparent"
                            >
                                {visibleTracks === 5 ? "See more" : "See less"}
                            </Button>
                        )}
                        {!loadingTopTracks && !errorTopTracks && !topTracks && (
                            <p className="text-[#d2d2d2] m-3">No top tracks for {artist?.name} found.</p>
                        )}
                        {loadingDiscography && (<p className="text-[#d2d2d2] m-3">Loading {artist?.name}'s discography...</p>)}
                        {errorDiscography && (<p className="text-red-400 p-8">Error fetching {artist?.name}'s discography: {errorDiscography.message}</p>)}
                        {!loadingDiscography && !errorDiscography && discography && (
                            <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mt-5'>Discography</h2>
                        )}
                        {!loadingDiscography && !errorDiscography && discography?.length > 0 && (
                            <div className="flex justify-center w-full my-5">
                                <Carousel
                                    opts={{
                                        align: "start",
                                    }}
                                    className="w-[80%]"
                                >
                                    <CarouselContent>
                                        {discography.map((obj, k) => (
                                        <CarouselItem key={`${obj?.id}-${k}`} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <Card className='bg-[#17171c] border border-[#303036] hover:bg-[#34343a] cursor-pointer' onClick={() => {selectAlbum(obj)}}>
                                                    <CardContent className="flex flex-col aspect-square items-center justify-center">
                                                        <CardMedia component="img" image={obj?.images[0]?.url} alt={obj?.name}></CardMedia>
                                                        <div className='text-base text-[#d2d2d2] truncate mt-2 w-[100%]'>{obj?.name}</div>
                                                        <div className='text-sm text-[#a5a5a5] mt-1 w-[100%] capitalize'>{new Date(obj?.release_date).getFullYear() + ' • ' + obj?.album_type }</div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="bg-[#28282f] border border-[#303036] text-[#d2d2d2] hover:bg-[#18181c] hover:text-[#d2d2d2]"/>
                                    <CarouselNext className="bg-[#28282f] border border-[#303036] text-[#d2d2d2] hover:bg-[#18181c] hover:text-[#d2d2d2]"/>
                                </Carousel>
                            </div>
                        )}
                        {!loadingDiscography && !errorDiscography && !discography && (
                            <p className="text-[#d2d2d2] m-3">No discography for {artist?.name} found.</p>
                        )}
                    </div>
                )}
                {!loading && !error && !artist && (
                    <p className="text-[#d2d2d2] m-3">No artist found.</p>
                )}
            </div>
        </div>
    );
};

export default Artist;