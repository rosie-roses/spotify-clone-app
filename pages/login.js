import { Button, Image } from "@chakra-ui/react";
import { getProviders, signIn } from "next-auth/react";
import React from 'react';

function Login({ providers }) {
  return (
    <div className='flex flex-col items-center justify-center w-full min-h-screen'>
        <Image className='w-60 mb-8' src='https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Green.png' />
        <Button className='text-white px-8 py-2 rounded-full font-bold' 
        onClick={() => signIn('spotify', { callbackUrl: '/' })}>Sign In with Spotify</Button>
    </div>
  )
}

export default Login;

export async function getServerSideProps(){
  const providers = await getProviders();
  return {
    props: {
      providers
    },
  };
}