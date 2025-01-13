import { Button } from "@mui/material";
import { Login01Icon } from "hugeicons-react";
import { signIn, getProviders } from "next-auth/react";

export default function Login({ providers }) {
  return (
    <div className="flex justify-center items-center h-screen text-center flex-col space-y-6">
      <h1 className="text-3xl font-semibold text-white">Welcome to the Spotify Clone</h1>
      <p className="text-lg text-gray-300">
        Sign in with your Spotify account to start exploring music, playlists, and more.
      </p>
      <div className="space-y-4 mt-6">
        <Button
          className="bg-[#1DB954] text-white w-full p-3 rounded-md"
          onClick={() => signIn('spotify', { callbackUrl: "/" })}
        >
          Sign in with Spotify <Login01Icon className="ml-1" size={20} />
        </Button>
      </div>
    </div>
  );
}

// Fetch providers server-side
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}