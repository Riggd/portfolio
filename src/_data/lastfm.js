const EleventyFetch = require("@11ty/eleventy-fetch");

const API_KEY = process.env.LASTFM_API;

module.exports = async function() {
  try {
    // https://www.last.fm/api/show/track.updateNowPlaying (Try this out)
    // https://www.last.fm/api/show/user.getRecentTracks
    let json = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ux_derek&limit=1&api_key=${API_KEY}&format=json`, {
      duration: "30m",
      type: "json", // also supports "text" or "buffer"
    });
  
    return {
      recentSong: json.recenttracks.track[0].name,
      artist: json.recenttracks.track[0].artist['#text']
    };
  } catch(e) {
    console.log( "Failed getting Last FM recently played track, returning Can't connect" );
    return {
      recentSong: "Can't connect to Last FM",
      artist: "Not playing music"
    };
  }

  // IMPLEMENTATION
  // <section>
  //   <div class="now-playing">
  //     <div class="icon">
  //         <span></span>
  //         <span></span>
  //         <span></span>
  //     </div>
  //   {{ lastfm.recentSong }} - {{ lastfm.artist }}
  //   </div>
  // </section>
};