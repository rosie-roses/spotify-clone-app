import { useEffect, useState } from 'react';
import useSpotify from './useSpotify';

const useUserPlaylists = () => {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    useEffect(() => {
        const fetchUserPlaylists = async () => {
            if (!spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.getUserPlaylists();
                if (res.items) {
                    setUserPlaylists(res.items);
                } 
            } catch(err) {
                console.error("Error fetching user's playlists", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPlaylists();
    }, [spotifyApi]);

    return { userPlaylists, loading, error };
}

export default useUserPlaylists;