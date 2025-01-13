import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useUserFollowedArtists = () => {
    const [userFollowedArtists, setUserFollowedArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchUserFollowedArtists = async () => {
            if (!spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getFollowedArtists({limit: 50});
                if (res.artists) {
                    setUserFollowedArtists(res.artists);
                }
            } catch (err) {
                console.error("Error fetching user's followed artists", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserFollowedArtists();
    }, [spotifyApi]); 

    return { userFollowedArtists, loading, error };
};

export default useUserFollowedArtists;