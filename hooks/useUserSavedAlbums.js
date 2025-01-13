import React, { useEffect, useState } from 'react'
import useSpotify from './useSpotify';

const useUserSavedAlbums = () => {
    const [userSavedAlbums, setUserSavedAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchUserSavedAlbums = async () => {
            if (!spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getMySavedAlbums({limit: 50});
                if (res.items) {
                    setUserSavedAlbums(res.items);
                }
            } catch (err) {
                console.error("Error fetching user's saved albums", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchUserSavedAlbums();
    }, [spotifyApi]);

    return { userSavedAlbums, loading, error };
};

export default useUserSavedAlbums;