import spotifyApi, { LOGIN_URL } from "@/lib/spotify";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token) {
    try {
      spotifyApi.setAccessToken(token.accessToken);
      spotifyApi.setRefreshToken(token.refreshToken);

      const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
      console.log('Refreshed token is: ', refreshedToken);

      return {
        ...token,
        accessToken: refreshedToken.access_token,
        accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
        refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      };
    } catch (err) {
      console.error('Error refreshing access token: ', err);
      return {
        ...token,
        error: 'RefreshAccessTokenError'
      };
    }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        }
      }
      // Access token has not expired
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      // Access token has expired
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
};

export default NextAuth(authOptions);