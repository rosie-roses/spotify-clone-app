# Spotify Clone App

This is a Spotify Clone web application built using **Next.js** (React.js), the **Spotify Web API**, and the **Spotify Web Playback SDK**. The app allows users to log in with their Spotify account and stream music directly from the web browser.

You can try the live demo of the application here:  
[Spotify Clone App](https://spotify-clone-app-pied.vercel.app/login)

## Features

- User authentication via Spotify OAuth
- Access to Spotify Web API for fetching user data, playlists, saved tracks, saved albums, and searching
- Real-time music playback using Spotify Web Playback SDK
- Modern UI built with React.js (Next.js)

## Tech Stack

- **Frontend**: React.js (Next.js)
- **Backend**: Next.js API Routes, Next Auth
- **Spotify API**: Web API, Web Playback SDK
- **Deployment**: Vercel

## Prerequisites

Before running the app locally, make sure you have the following installed on your machine:

- **Node.js** 
- **npm** (Node Package Manager)

## Live Demo

You can try the app deployed on Vercel:

[Spotify Clone App](https://spotify-clone-app-pied.vercel.app)

## Usage Limitations

**Important**: The **Web Playback SDK** requires a **Spotify Premium** account. Users with a **free Spotify account** will not be able to use the playback feature, as the SDK is restricted to Premium users only. However, they can still log in, browse their playlists, and interact with the app.

## Running the App Locally

To run the project on your local machine, follow these steps:

### 1. Clone the repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/rosie-roses/spotify-clone-app.git
cd spotify-clone-app
```

### 2. Install dependencies

Install all necessary dependencies:

```bash
npm install
```

### 3. Set up environment variables

Create a .env.local file in the root directory of the project and add the following environment variables:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

**Getting your Spotify credentials:**

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click Create an App.
3. Set the Website to http://localhost:3000/.
4. Set the Redirect URIs to http://localhost:3000/api/auth/callback/spotify.
5. Select **Web API** and **Web Playback SDK** under "APIs" for your app.
6. Once the app is created, you'll get a Client ID and Client Secret. Use these to populate the variables SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the .env.local file.
7. You can generate the NEXTAUTH_SECRET using the following command:

    ```bash
    openssl rand -base64 32
    ```

### 4. Build the application

Now, build the app:

```bash
npm run build
```

### 5. Start the application

Start the application locally:

```bash
npm run start
```

The app will be available at http://localhost:3000.

## How to Use

1. Open the app in your browser (http://localhost:3000).
2. Click the Login with Spotify button to authenticate via your Spotify account.
3. Once logged in, you can browse your playlists, search for songs, and play music directly from the app.
