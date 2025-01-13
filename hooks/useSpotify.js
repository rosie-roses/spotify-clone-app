import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import spotifyApi, { setAccessToken } from '@/lib/spotify';

const useSpotify = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session) {
            if (session.error === 'RefreshAccessTokenError' || status === "unauthenticated") {
                signIn();
            }
            setAccessToken(session.user.accessToken);
        }
    }, [session]);

  return spotifyApi;
}

export default useSpotify;