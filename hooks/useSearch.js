import { useState, useEffect, useCallback } from 'react';
import useSpotify from './useSpotify';
import { debounce } from 'lodash';

const useSearch = (q) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const spotifyApi = useSpotify();

    // Memoize the debounced search function using useCallback
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (!query || !spotifyApi.getAccessToken()) return;

            try {
                setLoading(true);
                const res = await spotifyApi.search(query, ["album", "artist", "playlist", "track"]);
                setResult(res);
            } catch (err) {
                console.error("Error fetching search results", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }, 500), // 500ms debounce delay
        [spotifyApi] 
    );

    useEffect(() => {
        // Call the debounced search function whenever `q` changes
        debouncedSearch(q);

        // Cleanup the debounced function when the component unmounts or when `q` changes
        return () => {
            debouncedSearch.cancel();
        };
    }, [q, debouncedSearch]);

    return { result, loading, error };
};

export default useSearch;
