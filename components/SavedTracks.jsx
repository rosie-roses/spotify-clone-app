"use client";

import useSpotify from "@/hooks/useSpotify";
import useUserSavedTracks from "@/hooks/useUserSavedTracks";
import { millisToMinutesAndSeconds } from "@/lib/misc";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

const SavedTracks = ({
    setView,
    globalIsTrackPlaying,
    setGlobalIsTrackPlaying,
    setGlobalArtistId,
    setGlobalAlbumId,
    setPlayURI,
    playURI,
    deviceId,
    setPreviewView,
    trackURI,
    setTrackURI
}) => {
    const { userSavedTracks, loading, error } = useUserSavedTracks();
    const spotifyApi = useSpotify();

    const [hoveredTrack, setHoveredTrack] = useState(null);

    function selectArtist(artist) {
        setView("artist");
        setPreviewView("artist")
        setGlobalArtistId(artist.id);
    }

    function selectAlbum(album) {
        setView("album");
        setPreviewView("album")
        setGlobalAlbumId(album.id);
    }

    const handlePlayClick = async (track) => {
        if (deviceId && spotifyApi.getAccessToken()) {
            await spotifyApi.play({ device_id: deviceId, uris: [track.uri] }).then(() => { 
              setGlobalIsTrackPlaying(true);
              setPlayURI(track.uri);
              setTrackURI(track.uri);
            }).catch((err) => {
                console.error('Error when playing context URI: ', err);
            });
        }
    };

    return (
        <div className="flex flex-col bg-[#18181d] rounded-lg box-border text-[#d2d2d2] border border-[#303036]">
            <div className="flex flex-col items-start">
                {loading && <p className="text-[#d2d2d2] m-3">Loading saved tracks...</p>}
                {error && <p className="text-red-400 m-3">Error fetching saved tracks: {error.message}</p>}
                {!loading && !error && userSavedTracks.length > 0 && (
                    <div className="w-full">
                        {userSavedTracks.map((obj, i) => (
                            <div
                                key={`${obj.track.id}-${i}`}
                                className={`grid grid-cols-[2%,45%,35%,5%] items-center gap-x-6 py-4 px-6 hover:bg-[#2e2e32] cursor-pointer
                                    ${i === 0 ? "hover:bg-[#2e2e32] rounded-t-lg" : ""}
                                    ${i === userSavedTracks.length - 1 ? "hover:bg-[#2e2e32] rounded-b-lg" : ""}
                                    ${i !== userSavedTracks.length - 1 ? "border-b border-b-[#303036]" : ""}`}
                                onMouseEnter={() => setHoveredTrack(obj.track.id)}
                                onMouseLeave={() => setHoveredTrack(null)}
                            >
                                <div className="text-[#a5a5a5]" onClick={() => handlePlayClick(obj.track)}>
                                    {hoveredTrack === obj.track.id ? (
                                        globalIsTrackPlaying && trackURI === obj.track.uri ? (
                                            <FontAwesomeIcon icon={faPause} className="text-[#d2d2d2] cursor-pointer" />
                                        ) : (
                                            <FontAwesomeIcon icon={faPlay} className="text-[#d2d2d2] cursor-pointer" />
                                        )
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={obj.track.album.images[0].url}
                                        alt={obj.track.album.name}
                                        className="w-10 h-10 rounded-md"
                                    />
                                    <div className="flex flex-col justify-start w-[calc(100%_-_50px)]">
                                        {playURI === obj.track.uri ? (
                                            <p className="text-[#1DB954] truncate">{obj.track.name}</p>
                                        ) : (
                                            <p className="text-[#e5e5e5] truncate">{obj.track.name}</p>
                                        )}
                                        <div className="text-[#a5a5a5] truncate">
                                            {obj.track.artists?.map((artist, j) => {
                                                return (
                                                    <span key={`${artist.id}-${j}`}>
                                                        <span
                                                            onClick={() => selectArtist(artist)}
                                                            className="cursor-pointer hover:underline"
                                                        >
                                                            {artist.name}
                                                        </span>
                                                        <span>{j !== obj.track.artists.length - 1 ? ", " : null}</span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="text-[#a5a5a5] cursor-pointer hover:underline truncate"
                                    onClick={() => {
                                        selectAlbum(obj.track.album);
                                    }}
                                >
                                    {obj.track.album.name}
                                </div>
                                <div className="text-[#a5a5a5]">
                                    {millisToMinutesAndSeconds(obj.track.duration_ms)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!loading && !error && userSavedTracks.length === 0 && (
                    <p className="text-[#d2d2d2] m-3">No saved tracks found.</p>
                )}
            </div>
        </div>
    );
};

export default SavedTracks;
