const EleventyFetch = require("@11ty/eleventy-fetch");

const API_KEY = process.env.LASTFM_API;

module.exports = async function() {
  try {
    // https://www.last.fm/api/show/user.getRecentTracks
    let json = await EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ux_derek&limit=1&api_key=${API_KEY}&format=json`, {
      duration: "20m",
      type: "json", // also supports "text" or "buffer"
    });
  
    return {
      recentSong: json.recenttracks.track[0].name // Parse response
    };
  } catch(e) {
    console.log( "Failed getting Last FM recently played track, returning Can't connect" );
    return {
      recentSong: "Can't connect to Last FM"
    };
  }

  // Implement on page with {{ lastfm.recentSong }}

};




  

  // try {
  //   // https://developer.spotify.com/documentation/web-api/reference/get-recently-played
  //   let json = await EleventyFetch("https://api.spotify.com/v1/me/player/recently-played", {
  //     duration: "1d", // 1 day
  //     type: "json", // also supports "text" or "buffer"
  //     fetchOptions: {
	// 			headers: {
	// 				"Authorization": `Bearer ${env.SPOTIFY_ACCESSTOKEN}`
	// 			}
	// 		}
  //   });

  //   return {
  //     recentSong: json.commit.commit.committer.date // Parse response
  //   };
  // } catch(e) {
  //   console.log( "Failed getting Spotify recently played track, returning Can't connect" );
  //   return {
  //     recentSong: "Can't connect to Spotify"
  //   };
  // }

  //   try {
  //   // https://developer.spotify.com/documentation/web-api/reference/get-recently-played
  //   let json = await EleventyFetch("https://accounts.spotify.com/api/token", {
  //     type: "json", // also supports "text" or "buffer"
  //     fetchOptions: {
  //       method: "POST",
  //       body: new URLSearchParams({
  //         'grant_type': 'client_credentials',
  //       }),
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         "Authorization": `Basic ${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
  //       }
  //     }
  //   });

  //   return {
  //     accessToken: data.access_token // Store access
  //   };
  // } catch(e) {
  //   console.log(e);
  //   console.log( "Failed getting Spotify Token" );
  //   return {
  //     accessToken: "Can't connect to Spotify"
  //   };
  // }

const client_id = process.env.SPOTIFY_ID;
const client_secret = process.env.SPOTIFY_SECRET;

// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };

// request.post(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//     console.log(token);
//   }
//   else {
//     console.log(error);
//   }
// });


async function getToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),//`Basic ${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`
    },
  });

  return await response.json();
}

async function getRecentTrack(access_token) {
  const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1&after=1484811043508", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}


// getToken().then(response => {
//   getRecentTrack(response.access_token).then(profile => {
//     console.log(profile)
//   })
// });

//};


// An implementation that works... apparently
// const fetch = require('node-fetch');
// const express = require('express')
// const app = express()

// const spotifyAPIBaseUri = 'https://api.spotify.com'
// const spotifyAccountsBaseUri = 'https://accounts.spotify.com'

// const clientId = process.env['SPOTIFY_CLIENT_ID']
// const clientSecret = process.env['SPOTIFY_CLIENT_SECRET']
// const refreshToken = process.env['SPOTIFY_REFRESH_TOKEN']
// let accessToken = '';

// const refreshAccessToken = () => {
//   return fetch(`${spotifyAccountsBaseUri}/api/token`, {
//     method: 'POST',
//     body: `grant_type=refresh&refresh_token=${refreshToken}`,
//     headers: {
//       'Authorization': `Basic ${new Buffer(`${clientId}:${clientSecret}`).toString('base64')}`
//     }
//   })
// }

// const getRecentlyPlayed = () => {
//   return fetch(`${spotifyAPIBaseUri}/v1/me/player/recently-played`, {
//     headers: {
//       'Authorization': `Bearer ${accessToken}`
//     }
//   })
// }

// app.get('/my-recently-played', function (req, res) {
//   getRecentlyPlayed()
//     .then((recentlyPlayedResponse) => recentlyPlayedResponse.json())
//     .then((recentlyPlayedResponseJSON) => {
//       res.send(recentlyPlayedResponseJSON);
//     })
//     .catch(() => {
//       refreshAccessToken()
//         .then((refreshResponse) => response.json())
//         .then((refreshResponseJSON) => {
//           accessToken = refreshResponseJSON['access_token'];
//           getRecentlyPlayed()
//             .then((recentlyPlayedResponse) => recentlyPlayedResponse.json())
//             .then((recentlyPlayedResponseJSON) => {
//               res.send(recentlyPlayedResponseJSON)
//             })
//             .catch(() => {
//               res.status(500).send('Failed to get recently played tracks');
//             })
//         })
//         .catch(() => {
//           res.status(500).send('Failed to refresh Spotify token')
//         })
//     })
// })

// app.listen(3000)