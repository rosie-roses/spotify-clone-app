"use client"

import useUserPlaylists from '@/hooks/useUserPlaylists';
import { Button } from '@mui/material';
import { FolderMusicIcon, SpotifyIcon, UserLove01Icon, Vynil02Icon } from 'hugeicons-react';
import React from 'react';

function Sidebar({ view, setView, setGlobalPlaylistId, setPreviewView, playURI }) {
    const { userPlaylists, loading, error } = useUserPlaylists();

    return (
       <div className='h-full flex flex-col bg-[#18181d] box-border text-[#e5e5e5] overflow-y-auto scrollbar-hide border border-[#303036] rounded-lg'>
            <div className='flex items-center gap-2 border-b border-b-[#303036] font-bold text-base tracking-wider uppercase p-6'>
                <SpotifyIcon size={24} color='#1DB954'/>
                <a href="/" className='cursor-pointer text-[#1DB954]'>Spotify Clone</a>
            </div>
            <div className='py-9 px-7 text-left border-b border-b-[#303036]'>
                <h5 className='text-[#a5a5a5] mb-5 uppercase text-sm font-bold tracking-wide'>Menu</h5>
                <ul>
                    <li className='mb-4'>
                        <Button 
                            onClick={() => {
                                setView('saved tracks');
                                setPreviewView('saved tracks');
                            }} 
                            variant="text" 
                            className={`capitalize flex justify-start text-left text-sm p-0 m-0 hover:bg-transparent 
                            ${view === 'saved tracks' ? 'text-[#1DB954]' : 'text-[#e5e5e5]'}`}
                            startIcon={<Vynil02Icon size={20}/>}>
                            Saved tracks
                        </Button>
                    </li>
                    <li className='mb-4'>
                        <Button 
                            onClick={() => {
                                setView('saved albums');
                                setPreviewView('saved albums');
                            }} 
                            variant="text" 
                            className={`capitalize flex justify-start text-left text-sm p-0 m-0 hover:bg-transparent
                            ${view === 'saved albums' ? 'text-[#1DB954]' : 'text-[#e5e5e5]'}`}
                            startIcon={<FolderMusicIcon size={20}/>}>
                            Saved Albums
                        </Button>
                    </li>
                    <li>
                        <Button 
                            onClick={() => {
                                setView('followed artists');
                                setPreviewView('followed artists');
                            }} 
                            variant="text" 
                            className={`capitalize flex justify-start text-left text-sm p-0 m-0 hover:bg-transparent
                            ${view === 'followed artists' ? 'text-[#1DB954]' : 'text-[#e5e5e5]'}`} 
                            startIcon={<UserLove01Icon size={20}/>}>
                            Followed Artists
                        </Button>
                    </li>
                </ul>
            </div>
            <div className='py-9 px-7 pb-5 text-left'>
                <h5 className='text-[#a5a5a5] mb-5 uppercase text-sm font-bold tracking-wide'>Playlists</h5>
                <ul className='flex flex-col items-start m-0 p-0'>
                    {loading && (<p className="text-[#e5e5e5] mt-3">Loading playlists...</p>)}
                    {error && (<p className="text-red-400">Error fetching playlists: {error.message}</p>)}
                    {!loading && !error && userPlaylists.length > 0 && (
                        userPlaylists.map((playlist, i) => (
                            <Button 
                                onClick={() => {
                                    setView('playlist');
                                    setPreviewView('playlist')
                                    setGlobalPlaylistId(playlist.id);
                                }}
                                key={`${playlist.id}-${i}`}
                                className="capitalize text-[#e5e5e5] text-sm p-0 m-0 mb-5 hover:bg-transparent flex justify-start text-left" 
                            >
                                {playURI === playlist.uri ? (
                                    <p className="text-[#1DB954] truncate">{playlist.name}</p>
                                ) : (
                                    <p className="text-[#e5e5e5] truncate">{playlist.name}</p>
                                )}
                            </Button>
                        ))
                    )}
                    {!loading && !error && userPlaylists.length === 0 && (
                        <p className="text-[#e5e5e5] mt-3">No playlists found.</p>
                    )}
                </ul>
            </div>
       </div>
    );
};

export default Sidebar;