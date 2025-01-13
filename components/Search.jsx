"use client"

import useSearch from '@/hooks/useSearch'
import useSpotify from '@/hooks/useSpotify';
import { millisToMinutesAndSeconds } from '@/lib/misc';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const Search = ({ 
  searchQuery, 
  deviceId, 
  setGlobalIsTrackPlaying, 
  setPlayURI, 
  setView, 
  setPreviewView, 
  setGlobalArtistId,
  setGlobalAlbumId, 
  setGlobalPlaylistId,
  playURI, 
  trackURI, 
  globalIsTrackPlaying
 }) => {
  const { result, loading, error } = useSearch(searchQuery);

  const filteredTracks = result?.tracks?.items?.filter(track => track !== null) || [];
  const filteredArtists = result?.artists?.items?.filter(artist => artist !== null) || [];
  const filteredAlbums = result?.albums?.items?.filter(album => album !== null) || [];
  const filteredPlaylists = result?.playlists?.items?.filter(playlist => playlist !== null) || [];

  const spotifyApi = useSpotify();

  const handlePlayTrackClick = async (uri) => {
    if (deviceId && spotifyApi.getAccessToken()) {
      await spotifyApi.play({ device_id: deviceId, uris: [uri] }).then(() => { 
        setGlobalIsTrackPlaying(true);
        setPlayURI(uri);
      }).catch((err) => {
          console.error('Error when playing context URI: ', err);
      });
    }
  }

  const handlePlayClick = async (uri) => {
    if (deviceId && spotifyApi.getAccessToken()) {
      await spotifyApi.play({ device_id: deviceId, context_uri: uri }).then(() => { 
        setGlobalIsTrackPlaying(true);
        setPlayURI(uri);
      }).catch((err) => {
          console.error('Error when playing context URI: ', err);
      });
    }
  }

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

  function selectPlaylist(playlist) {
    setView("playlist");
    setPreviewView("playlist");
    setGlobalPlaylistId(playlist.id);
  }

  return (
    <div className='flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]'>
      <div className='flex flex-col items-start'>
          {loading && (<p className="text-[#d2d2d2] m-3">Loading search results...</p>)}
          {error && (<p className="text-red-400 p-8">Error fetching search results: {error.message}</p>)}
          <div className='h-full w-full pb-6'>
            {!loading && !error && result && filteredTracks.length > 0 && (
              <div>
                <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mt-5 mb-2'>Songs</h2>
                {filteredTracks.slice(0, 5).map((track, i) => {
                  return (
                    <div 
                      key={`${track.id}-${i}`}
                      className={`grid relative group grid-cols-[45%,40%,5%] items-center gap-x-6 py-4 px-6 hover:bg-[#2e2e32] ${i !== filteredTracks.slice(0, 5).length - 1 ? 'border-b border-b-[#303036]' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={track.album.images[0].url}
                            alt={track.album.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />

                          <div className="absolute rounded-sm inset-0 flex items-center justify-center bg-black 
                          bg-opacity-85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          onClick={() => handlePlayTrackClick(track.uri)}>
                            {globalIsTrackPlaying && trackURI === track?.uri ? (
                              <FontAwesomeIcon icon={faPause} size='xl' className="text-[#e5e5e5] text-xl cursor-pointer"/>
                            ) : (
                                <FontAwesomeIcon icon={faPlay} size='xl' className="text-[#e5e5e5] text-xl cursor-pointer"  />
                            )}
                          </div>
                        </div>

                          <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                            {trackURI === track.uri ? (
                                <p className="text-[#1DB954] truncate">{track.name}</p>
                            ) : (
                                <p className="text-[#e5e5e5] truncate">{track.name}</p>
                            )}
                            <div className="text-[#a5a5a5] truncate">
                                {track.artists?.map((artist, j) => {
                                    return (
                                        <span key={`${artist.id}-${j}`}>
                                            <span onClick={() => selectArtist(artist)} className='cursor-pointer hover:underline'>{artist.name}</span>
                                            <span>{ j != track.artists.length - 1 ? ', ' : null }</span>
                                        </span>
                                    )
                                })}
                          </div>
                        </div>
                      </div>
                      <div className="text-[#a5a5a5] cursor-pointer hover:underline truncate" onClick={() => {selectAlbum(track.album)}}>{track.album.name}</div>
                      <div className="text-[#a5a5a5]">
                        {millisToMinutesAndSeconds(track.duration_ms)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!loading && !error && result && filteredTracks.length === 0 && (
              <p className="text-[#d2d2d2] m-3">No tracks found.</p>
            )}
            {!loading && !error && result && filteredArtists.length > 0 && (
              <div className='w-[100%] mt-10'>
                <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mb-2'>Artists</h2>
                <div className='flex flex-row space-x-5 px-5'>
                {filteredArtists.slice(0, 4).map((artist, j) => {
                  return (
                    <div key={`${artist.id}-${j}`} className='relative group w-[calc((100%_/_4)_-_16px)] rounded-md p-3 pt-0 hover:bg-[#2e2e32] cursor-pointer'
                    onClick={() => selectArtist(artist)}>
                      <div className="flex flex-col space-y-2 mt-5">
                        <div className="relative w-full h-0 pb-[100%]">
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="absolute inset-0 w-full h-full object-cover rounded-full"
                          />
                          <div className="absolute bottom-1 right-1 bg-[#1DB954] rounded-full w-[50px] h-[50px] p-2 cursor-pointer opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 flex items-center justify-center" onClick={() => handlePlayClick(artist.uri)}>
                            {globalIsTrackPlaying && playURI === artist?.uri ? (
                              <FontAwesomeIcon icon={faPause} size='xl' color='black'/>
                            ) : (
                              <FontAwesomeIcon icon={faPlay} size='xl' color='black' />
                            )}
                          </div>
                        </div>
                        <div className="text-[#d2d2d2] w-full truncate">
                          {playURI === artist.uri ? (
                              <p className="text-[#1DB954] truncate">{artist.name}</p>
                          ) : (
                              <p className="text-[#e5e5e5] truncate">{artist.name}</p>
                          )}
                        </div>
                        <div className="text-[#a5a5a5] capitalize">
                          {artist.type}
                        </div>
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            )}
            {!loading && !error && result && filteredArtists.length === 0 && (
              <p className="text-[#d2d2d2] m-3">No artists found.</p>
            )}
            {!loading && !error && result && filteredAlbums.length > 0 && (
              <div className='w-[100%] mt-10'>
                <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mb-2'>Albums</h2>
                <div className='flex flex-row space-x-5 px-5'>
                {filteredAlbums.slice(0, 4).map((album, k) => {
                  return (
                    <div 
                      key={`${album.id}-${k}`}
                      className={`relative group w-[calc((100%_/_4)_-_16px)] rounded-md p-3 pt-0 hover:bg-[#2e2e32] cursor-pointer`}
                      onClick={() => selectAlbum(album)}
                    >
                      <div className="flex flex-col space-y-2 mt-5">
                        <div className="relative w-full h-0 pb-[100%]">
                          <img
                              src={album.images[0].url}
                              alt={album.name}
                              className="absolute inset-0 w-full h-full object-cover rounded-md"
                          />
                          <div className="absolute bottom-1 right-1 bg-[#1DB954] rounded-full w-[50px] h-[50px] p-2 cursor-pointer opacity-0 group-hover:opacity-100 
                          transition-opacity duration-200 flex items-center justify-center" onClick={() => handlePlayClick(album.uri)}>
                            {globalIsTrackPlaying && playURI === album?.uri ? (
                              <FontAwesomeIcon icon={faPause} size='xl' color='black'/>
                            ) : (
                              <FontAwesomeIcon icon={faPlay} size='xl' color='black' />
                            )}
                          </div>
                        </div>
                        {playURI === album.uri ? (
                            <p className="text-[#1DB954] truncate">{album.name}</p>
                        ) : (
                            <p className="text-[#e5e5e5] truncate">{album.name}</p>
                        )}
                        <div className='text-sm text-[#a5a5a5] w-[100%] truncate capitalize'>{new Date(album?.release_date).getFullYear() + ' • ' + album?.album_type }</div>
                      </div>
                    </div>
                  )
                })}
                </div>
              </div>
            )}
            {!loading && !error && result && filteredAlbums.length === 0 && (
              <p className="text-[#d2d2d2] m-3">No albums found.</p>
            )}
            {!loading && !error && result && filteredPlaylists.length > 0 && (
              <div className='w-[100%] mt-10'>
                <h2 className='text-xl text-left font-bold text-[#d2d2d2] px-6 mb-2'>Playlists</h2>
                <div className='flex flex-row space-x-5 px-5'>
                  {filteredPlaylists.slice(0, 4).map((playlist, l) => {
                    return (
                      <div 
                        key={`${playlist?.id}-${l}`}
                        className={`relative group w-[calc((100%_/_4)_-_16px)] rounded-md p-3 pt-0 hover:bg-[#2e2e32] cursor-pointer`}
                        onClick={() => selectPlaylist(playlist)}
                      >
                        <div className="flex flex-col space-y-2 mt-5">
                          <div className="relative w-full h-0 pb-[100%]">
                            <img
                                src={playlist?.images?.[0]?.url}
                                alt={playlist?.name}
                                className="absolute inset-0 w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute bottom-1 right-1 bg-[#1DB954] rounded-full w-[50px] h-[50px] p-2 cursor-pointer opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 flex items-center justify-center" onClick={() => handlePlayClick(playlist.uri)}>
                              {globalIsTrackPlaying && playURI === playlist?.uri ? (
                                <FontAwesomeIcon icon={faPause} size='xl' color='black'/>
                              ) : (
                                <FontAwesomeIcon icon={faPlay} size='xl' color='black' />
                              )}
                            </div>
                          </div>
                          {playURI === playlist.uri ? (
                            <p className="text-[#1DB954] truncate">{playlist.name}</p>
                          ) : (
                            <p className="text-[#e5e5e5] truncate">{playlist.name}</p>
                          )}
                          <div className='text-sm text-[#a5a5a5] w-[100%] truncate capitalize'>By {playlist?.owner?.display_name}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {!loading && !error && result && filteredPlaylists.length === 0 && (
              <p className="text-[#d2d2d2] m-3">No playlists found.</p>
            )}
          </div>
          {!loading && !error && !result && (
            <p className="text-[#d2d2d2] m-3">No search results found.</p>
          )}
      </div>
    </div>
  );
};

export default Search;