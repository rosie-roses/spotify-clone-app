"use client"

import { Avatar, Button, IconButton, InputBase, Paper, Tooltip } from '@mui/material';
import { Logout01Icon, Search01Icon, SearchRemoveIcon } from 'hugeicons-react';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import ContentView from './ContentView';
import Player from './Player';

function MainComponent({ 
    user, 
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
    setDeviceId, 
    previewView, 
    setPreviewView,
    trackURI, 
    setTrackURI
 }) {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (searchQuery === '') {
            setView(previewView);
        } else {
            setView('Search');
        }
    }, [searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            setView('Search');
            e.preventDefault();
        }
    };

    return (
        <div className='min-h-screen max-h-screen w-full flex flex-col py-4 px-7 pr-0 box-border'>
            {/* header */}
            <div className='flex items-center w-full mb-4 box-border'>
                <Paper component={'form'} className='py-0.5 px-1 flex items-center bg-[#0f0f12] border border-[#303036] w-[50%]'>
                    <InputBase
                        id="search-input"
                        name="search-input"
                        className='ml-2 flex-1 text-[#d2d2d2]'
                        placeholder="What do you want to play?"
                        inputProps={{ 'aria-label': 'What do you want to play?' }}
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e)}
                    />
                    
                    {searchQuery ? (
                        <Tooltip title='Clear Search' arrow>
                            <IconButton 
                                type='button' 
                                aria-label='clear search' 
                                className='p-2.5' 
                                onClick={handleClearSearch}
                            >
                                <SearchRemoveIcon size={20} className='text-[#d2d2d2]' />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <IconButton type='button' aria-label='search' className='p-2.5'>
                            <Search01Icon size={20} className='text-[#d2d2d2]' />
                        </IconButton>
                    )}
                </Paper>

                <div className='flex items-center ml-auto mr-7'>
                    <Tooltip title='Log Out' arrow>
                        <Button variant="text" onClick={() => signOut()} className='text-[#d2d2d2] text-sm p-0 m-0 hover:bg-transparent'>
                            <Logout01Icon size={20} className='inline-block text-[#d2d2d2]' />
                        </Button>
                    </Tooltip>

                    <Tooltip title={user?.display_name} arrow>
                        <Paper className='p-1 bg-[#18181d] border border-[#303036] rounded-full cursor-pointer'>
                            <Avatar alt={user?.display_name} src={user?.images?.[0]?.url} className='w-8 h-8' />
                        </Paper>
                    </Tooltip>
                </div>
            </div>
            <div className='flex items-start box-border h-screen'>
                <ContentView
                    view={view}
                    setView={setView}
                    globalPlaylistId={globalPlaylistId}
                    setGlobalPlaylistId={setGlobalPlaylistId}
                    globalArtistid={globalArtistid}
                    setGlobalArtistId={setGlobalArtistId}
                    globalAlbumId={globalAlbumId}
                    setGlobalAlbumId={setGlobalAlbumId}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                    playURI={playURI}
                    setPlayURI={setPlayURI}
                    deviceId={deviceId}
                    setPreviewView={setPreviewView}
                    searchQuery={searchQuery}
                    trackURI={trackURI}
                    setTrackURI={setTrackURI}
                />
                <Player 
                    deviceId={deviceId} 
                    setDeviceId={setDeviceId}
                    globalIsTrackPlaying={globalIsTrackPlaying}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                    setTrackURI={setTrackURI}
                />
            </div>
        </div>
    );
}

export default MainComponent;