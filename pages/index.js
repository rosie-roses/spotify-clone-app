import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import spotifyApi, { setAccessToken } from "@/lib/spotify";
import Sidebar from "@/components/Sidebar";
import MainComponent from "@/components/MainComponent";
import Link from "next/link";
import { ArrowRight03Icon } from "hugeicons-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({});
  const [view, setView] = useState('saved tracks');
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null);
  const [globalArtistid, setGlobalArtistId] = useState(null);
  const [globalAlbumId, setGlobalAlbumId] = useState(null);
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false);
  const [playURI, setPlayURI] = useState(null);
  const [trackURI, setTrackURI] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [previewView, setPreviewView] = useState(view);

  useEffect(() => {
    if (session) {
      setAccessToken(session.user.accessToken);

      spotifyApi.getMe().then((user) => {
        setUser(user);
      });
    }
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <p className="text-xl">You are not logged in</p>
          <p>Please log in to access the spotify clone.</p>
          <Link href="/login" className="mt-4 inline-flex items-center px-6 py-2 bg-[#1DB954] text-white rounded">
            Go to Login page<ArrowRight03Icon size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505]">
      <div className="w-[calc(20%_-_16px)] m-4 mr-0 ml-7">
        <Sidebar
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
          setPreviewView={setPreviewView}
          playURI={playURI}
        />
      </div>

      <div className="w-4/5">
        <MainComponent 
          user={user}
          view={view}
          setView={setView}
          globalPlaylistId={globalPlaylistId}
          setGlobalPlaylistId={setGlobalPlaylistId}
          globalArtistid={globalArtistid}
          setGlobalArtistId={setGlobalArtistId}
          globalAlbumId={globalAlbumId}
          setGlobalAlbumId={setGlobalAlbumId}
          globalIsTrackPlaying={globalIsTrackPlaying}
          setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          playURI={playURI}
          setPlayURI={setPlayURI}
          deviceId={deviceId}
          setDeviceId={setDeviceId}
          previewView={previewView}
          setPreviewView={setPreviewView}
          trackURI={trackURI}
          setTrackURI={setTrackURI}
        />
      </div>
    </div>
  );
}