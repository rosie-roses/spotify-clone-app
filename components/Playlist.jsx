"use client"

import usePlaylist from '@/hooks/usePlaylist';
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

const Header = ({ playlist, setGlobalIsTrackPlaying, setPlayURI, deviceId, globalIsTrackPlaying, playURI }) => {
  const [ headerGradient, setHeaderGradient ] = useState(shuffle(colours).pop());

  const { dominantColor } = useExtractColors(playlist?.images?.[0]?.url);

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
      await spotifyApi.play({ device_id: deviceId, context_uri: playlist.uri }).then(() => { 
        setGlobalIsTrackPlaying(true);
        setPlayURI(playlist.uri);
      }).catch((err) => {
          console.error('Error when playing context URI: ', err);
      });
    }
  }

  return (
    <section style={{ background: headerGradient }} className='h-[35%] rounded-t-lg flex flex-col md:flex-row items-center text-left md:items-end p-6'>
      <div className='flex-shrink-0 mb-6 md:mb-0'>
        <img className='h-40 w-40 rounded-sm' src={playlist?.images?.[0]?.url} alt={playlist?.name} />
      </div>
      <div className='flex flex-col ml-0 md:ml-5 flex-grow'>
        <p className='text-sm font-bold hidden md:flex'>{playlist?.public ? "Public Playlist" : "Private Playlist"}</p>
        <div className="flex w-full items-center">
            <div className="flex-grow pr-4">
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-extrabold overflow-ellipsis'>
                    {playlist?.name}
                </h1>
            </div>
            <Button onClick={handlePlayClick} className="flex-shrink-0 bg-[#1DB954] rounded-full p-4 h-16 w-16 flex items-center justify-center">
              {globalIsTrackPlaying && playURI === playlist?.uri ? (
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

const Playlist = ({ 
  setView, 
  globalPlaylistId, 
  setGlobalArtistId, 
  setGlobalAlbumId, 
  globalIsTrackPlaying, 
  setGlobalIsTrackPlaying,
  playURI, 
  setPlayURI, 
  deviceId, 
  setPreviewView, 
  trackURI
 }) => {
  const { playlist, loading, error } = usePlaylist(globalPlaylistId);

  function selectArtist(artist) {
    setView("artist");
    setPreviewView("artist");
    setGlobalArtistId(artist.id);
  }

  function selectAlbum(album) {
    setView("album");
    setPreviewView("album");
    setGlobalAlbumId(album.id);
  }

  return (
    <div className='flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]'>
      <div className='flex flex-col items-start'>
        {loading && (<p className="text-[#d2d2d2] m-3">Loading playlist...</p>)}
        {error && (<p className="text-red-400 p-8">Error fetching playlist: {error.message}</p>)}
        {!loading && !error && playlist && (
          <div key={playlist?.id} className='h-full w-full'>
            <Header playlist={playlist} setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} setPlayURI={setPlayURI} deviceId={deviceId} globalIsTrackPlaying={globalIsTrackPlaying} playURI={playURI}/>
            {playlist?.tracks?.items?.length > 0 && playlist?.tracks?.items?.map((obj, i) => (
              <div 
                key={`${obj.track.id}-${i}`}
                className={`grid grid-cols-[2%,45%,35%,5%] items-center gap-x-6 py-4 px-6 ${i !== playlist?.tracks?.items?.length - 1 ? 'border-b border-b-[#303036]' : ''}`}
              >
                 <div className="text-[#a5a5a5]">{i + 1}</div>
                 <div className="flex items-center space-x-4">
                    <img
                        src={obj.track.album.images[0].url}
                        alt={obj.track.album.name}
                        className="w-10 h-10 rounded-md"
                    />
                    <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                        {trackURI === obj.track.uri ? (
                            <p className="text-[#1DB954] truncate">{obj.track.name}</p>
                        ) : (
                            <p className="text-[#e5e5e5] truncate">{obj.track.name}</p>
                        )}
                        <div className="text-[#a5a5a5] truncate">
                        {obj.track.artists?.map((artist, i) => {
                          return (
                              <span key={`${artist.id}-${i}`}>
                                  <span onClick={() => selectArtist(artist)} className='cursor-pointer hover:underline'>{artist.name}</span>
                                  <span>{ i != obj.track.artists.length - 1 ? ', ' : null }</span>
                              </span>
                          )
                        })}
                        </div>
                    </div>
                  </div>
                  <div className="text-[#a5a5a5] cursor-pointer hover:underline truncate" onClick={() => selectAlbum(obj.track.album)}>{obj.track.album.name}</div>
                  <div className="text-[#a5a5a5]">
                    {millisToMinutesAndSeconds(obj.track.duration_ms)}
                  </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && !playlist && (
          <p className="text-[#d2d2d2] m-3">No playlist found.</p>
        )}
      </div>
    </div>
  );
};

export default Playlist;