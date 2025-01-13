import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useUserSavedTracks = () => {
    const [userSavedTracks, setUserSavedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchUserSavedTracks = async () => {
            if (!spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getMySavedTracks({limit: 50});
                if (res.items) {
                    setUserSavedTracks(res.items);
                }
            } catch (err) {
                console.error("Error fetching user's saved tracks", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserSavedTracks();
    }, [spotifyApi]);

    return { userSavedTracks, loading, error };
};

export default useUserSavedTracks;