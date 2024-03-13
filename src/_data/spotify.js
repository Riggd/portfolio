const EleventyFetch = require('@11ty/eleventy-fetch');
const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;

let accessToken = '';
let refreshToken = '';
let tokenExpirationTime = 0; 
let redirect_uri = 'localhost:8080/callback';

async function getAccessToken() {
    // if (Date.now() >= tokenExpirationTime) {
    //     await refreshTokenIfNecessary();
    // }
    // return accessToken;
    // Using EleventyFetch
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
      };

    try {
    const tokenResponse = await EleventyFetch(authOptions.url, {
      method: 'POST',
      bodyType: 'urlSearchParams', // Match how we create the form data
      body: new URLSearchParams(authOptions.form),
      headers: authOptions.headers
    }); 

    if (tokenResponse.status === 200) {
      const tokenData = await tokenResponse.json(); // Parse JSON response
      const access_token = tokenData.access_token;
      const refresh_token = tokenData.refresh_token;

      // ... (Rest of your logic to get user data and redirect remains the same)

    } else {
      res.redirect('/#' + querystring.stringify({ error: 'invalid_token' })); 
    }

  } catch(error) {
    console.error("Error fetching tokens:", error);
    res.redirect('/#' + querystring.stringify({ error: 'token_error' })); // Generic error handling
  }
}

// async function refreshTokenIfNecessary() {
//     const credentials = btoa(`${clientId}:${clientSecret}`);
//     const tokenEndpoint = 'https://accounts.spotify.com/api/token';

//     try {
//         const response = await EleventyFetch(tokenEndpoint, {
//             headers: {
//                 'Authorization': `Basic ${credentials}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             fetchOptions: {
//                 method: "POST",
//                 // bodyType: 'urlSearchParams', 
//                 body: new URLSearchParams({
//                     grant_type: 'refresh_token',
//                     refresh_token: refreshToken
//                 })
//             },
//         });

//         const data = await response.json(); 
//         accessToken = data.access_token; 
//         tokenExpirationTime = Date.now() + (data.expires_in * 1000); 
//         refreshToken = data.refresh_token || refreshToken; 
//     } catch (error) {
//         console.error('Error refreshing token:', error);
//     }
// }

async function getRecentlyPlayedTrack() {
    const myAccessToken = await getAccessToken();
    const endpoint = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

    try {
        const response = await EleventyFetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${myAccessToken}`
            }
        });

        const data = await response.json();
        return data.items[0]; // Return the most recently played track
    } catch (error) {
        console.error('Error fetching recent track:', error);
        return null; 
    }
}

module.exports = async function() {
    const recentTrack = await getRecentlyPlayedTrack();
    return {
      recentTrack: recentTrack
    };
};


