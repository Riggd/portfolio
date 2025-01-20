import EleventyFetch from "@11ty/eleventy-fetch";

const API_KEY = process.env.LASTFM_API;
const USER = process.env.LASTFM_USER;

export default async function() {
  try {
    // https://www.last.fm/api/show/track.updateNowPlaying (Try this out)
    // https://www.last.fm/api/show/user.getRecentTracks
    let json = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&limit=2&api_key=${API_KEY}&format=json`, {
      duration: "0s",
      type: "json", // also supports "text" or "buffer"
    });
  
    return {
      recentSong: json.recenttracks.track[0].name,
      artist: json.recenttracks.track[0].artist['#text']
    };
  } catch(e) {
    console.log( "Failed getting Last FM recently played track, returning can't connect" );
    return {
      recentSong: "Can't connect to Last FM",
      artist: "Not playing music"
    };
  }
};