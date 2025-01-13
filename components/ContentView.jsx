"use client"

import React from 'react'
import SavedTracks from './SavedTracks';
import SavedAlbums from './SavedAlbums';
import FollowedArtists from './FollowedArtists';
import Playlist from './Playlist';
import Artist from './Artist';
import Album from './Album';
import Search from './Search';

const ContentView = ({ 
    view, 
    setView, 
    globalPlaylistId,
    setGlobalPlaylistId, 
    globalArtistid, 
    setGlobalArtistId, 
    globalAlbumId,
    setGlobalAlbumId, 
    globalIsTrackPlaying, 
    setGlobalIsTrackPlaying, 
    playURI, 
    setPlayURI, 
    deviceId, 
    setPreviewView, 
    searchQuery,
    trackURI, 
    setTrackURI
 }) => {
    return (
        <div className='overflow-y-auto h-[calc(100vh_-_100px)] box-border w-[80%]'>
            {view === 'saved tracks' && 
                <SavedTracks 
                    setView={setView} 
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                    setGlobalArtistId={setGlobalArtistId} 
                    setGlobalAlbumId={setGlobalAlbumId} 
                    setPlayURI={setPlayURI}
                    playURI={playURI}
                    deviceId={deviceId}
                    setPreviewView={setPreviewView}
                    trackURI={trackURI}
                    setTrackURI={setTrackURI}
                />
            }
            {view === 'saved albums' && 
                <SavedAlbums 
                    setView={setView}
                    setGlobalArtistId={setGlobalArtistId} 
                    setGlobalAlbumId={setGlobalAlbumId} 
                    setPreviewView={setPreviewView}
                    playURI={playURI}
                />
            }
            {view === 'followed artists' && 
                <FollowedArtists 
                    setView={setView}
                    setGlobalArtistId={setGlobalArtistId} 
                    setPreviewView={setPreviewView}
                />
            }
            {view === 'playlist' && 
                <Playlist 
                    setView={setView} 
                    globalPlaylistId={globalPlaylistId} 
                    setGlobalArtistId={setGlobalArtistId}
                    setGlobalAlbumId={setGlobalAlbumId}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                    playURI={playURI}
                    setPlayURI={setPlayURI}
                    deviceId={deviceId}
                    setPreviewView={setPreviewView}
                    trackURI={trackURI}
                />
            }
            {view === 'artist' && 
                <Artist 
                    setView={setView} 
                    globalArtistid={globalArtistid} 
                    setGlobalArtistId={setGlobalArtistId} 
                    setGlobalAlbumId={setGlobalAlbumId} 
                    playURI={playURI}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                    setPlayURI={setPlayURI}
                    deviceId={deviceId}
                    setPreviewView={setPreviewView}
                    trackURI={trackURI}
                />
            }
            {view === 'album' && 
                <Album 
                    setView={setView} 
                    globalAlbumId={globalAlbumId} 
                    setGlobalArtistId={setGlobalArtistId}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} 
                    playURI={playURI}
                    setPlayURI={setPlayURI} 
                    deviceId={deviceId}
                    setPreviewView={setPreviewView}
                    trackURI={trackURI}
                />
            }
            {view === 'Search' && 
                <Search  
                    searchQuery={searchQuery}
                    deviceId={deviceId}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying} 
                    setPlayURI={setPlayURI} 
                    setView={setView} 
                    setPreviewView={setPreviewView}
                    setGlobalArtistId={setGlobalArtistId}
                    setGlobalAlbumId={setGlobalAlbumId} 
                    setGlobalPlaylistId={setGlobalPlaylistId}
                    playURI={playURI}
                    trackURI={trackURI}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                />
            }
        </div>
    );
};

export default ContentView;