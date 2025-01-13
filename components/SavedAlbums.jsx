"use client"

import useUserSavedAlbums from '@/hooks/useUserSavedAlbums';
import React from 'react'

const SavedAlbums = ({ setView, setGlobalArtistId, setGlobalAlbumId, setPreviewView, playURI }) => {
    const { userSavedAlbums, loading, error } = useUserSavedAlbums();

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
                {loading && (<p className="text-[#d2d2d2] m-3">Loading saved albums...</p>)}
                {error && (<p className="text-red-400 m-3">Error fetching saved albums: {error.message}</p>)}
                {!loading && !error && userSavedAlbums.length > 0 && (
                    <div className="w-full">
                        {userSavedAlbums.map((obj, i) => (
                            <div 
                                key={`${obj.album.id}-${i}`}
                                className={`grid grid-cols-[2%,55%,15%,25%] items-center gap-x-6 py-4 px-6 hover:bg-[#2e2e32] cursor-pointer
                                    ${i === 0 ? "hover:bg-[#2e2e32] rounded-t-lg" : ""}
                                    ${i === userSavedAlbums.length - 1 ? "hover:bg-[#2e2e32] rounded-b-lg" : ""}
                                    ${i !== userSavedAlbums.length - 1 ? 'border-b border-b-[#303036]' : ''}`}
                            >
                                <div className="text-[#a5a5a5]">{i + 1}</div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={obj.album.images[0].url}
                                        alt={obj.album.name}
                                        className="w-10 h-10 rounded-md"
                                    />
                                    <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                                        <div className="text-[#e5e5e5] cursor-pointer hover:underline truncate" onClick={() => {selectAlbum(obj.album)}}>
                                            {playURI === obj.album.uri ? (
                                                <p className="text-[#1DB954] truncate">{obj.album.name}</p>
                                            ) : (
                                                <p className="text-[#e5e5e5] truncate">{obj.album.name}</p>
                                            )}
                                        </div>
                                        <div className="text-[#a5a5a5] truncate">
                                            {obj.album.artists?.map((artist, j) => {
                                                return (
                                                    <span key={`${artist.id}-${j}`}>
                                                        <span onClick={() => selectArtist(artist)} className='cursor-pointer hover:underline'>{artist.name}</span>
                                                        <span>{ j != obj.album.artists.length - 1 ? ', ' : null }</span>
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[#a5a5a5] capitalize truncate">{obj.album.album_type}</div>
                                <div className="text-[#a5a5a5]">{obj.album.release_date}</div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !error && userSavedAlbums.length === 0 && (
                    <p className="text-[#d2d2d2] m-3">No saved albums found.</p>
                )}
            </div>
        </div>
    );
};

export default SavedAlbums;