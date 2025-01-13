"use client"

import useUserFollowedArtists from '@/hooks/useUserFollowedArtists';
import { formatFollowers } from '@/lib/misc';
import React from 'react'

const FollowedArtists = ({ setView, setGlobalArtistId, setPreviewView }) => {
    const { userFollowedArtists, loading, error } = useUserFollowedArtists();

    function selectArtist(artist) {
        setView("artist");
        setPreviewView("artist");
        setGlobalArtistId(artist.id);
    }

    return (
        <div className='flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]'>
            <div className='flex flex-col items-start'>
                {loading && (<p className="text-[#d2d2d2] m-3">Loading followed artists...</p>)}
                {error && (<p className="text-red-400 m-3">Error fetching followed artists: {error.message}</p>)}
                {!loading && !error && userFollowedArtists.items.length > 0 && (
                    <div className="w-full">
                        {userFollowedArtists.items.map((obj, i) => (
                            <div 
                                key={`${obj.id}-${i}`}
                                className={`grid grid-cols-[35%,40%,20%] items-center gap-x-6 py-4 px-6 hover:bg-[#2e2e32] cursor-pointer
                                    ${i === 0 ? "hover:bg-[#2e2e32] rounded-t-lg" : ""}
                                    ${i === userFollowedArtists.length - 1 ? "hover:bg-[#2e2e32] rounded-b-lg" : ""}
                                    ${i !== userFollowedArtists.length - 1 ? 'border-b border-b-[#303036]' : ''}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={obj.images[0].url}
                                        alt={obj.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                                        <p className="text-[#e5e5e5] cursor-pointer hover:underline truncate" onClick={() => selectArtist(obj)}>{obj.name}</p>
                                    </div>
                                </div>
                                <div className="text-[#a5a5a5] capitalize truncate">
                                    {obj.genres && obj.genres.length > 0 ? 
                                        obj.genres.join(', ') : 
                                        "no genres available"
                                    }
                                </div>
                                <div className="text-[#a5a5a5]">{formatFollowers(obj.followers.total)} Followers</div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !error && userFollowedArtists.length === 0 && (
                    <p className="text-[#d2d2d2] m-3">No followed artists found.</p>
                )}
            </div>
        </div>
    );
};

export default FollowedArtists;