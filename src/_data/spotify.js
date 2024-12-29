/* const EleventyFetch = require('@11ty/eleventy-fetch');
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
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    }
  };

  try {
    const tokenResponse = await EleventyFetch(authOptions.url, {
      method: 'POST',
      bodyType: 'urlSearchParams', // Match how we create the form data
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri  
      }),
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
}; */

// Testing Google Gemini implementation

const EleventyFetch = require('@11ty/eleventy-fetch');
const clientId = process.env.SPOTIFY_ID;
const clientSecret = process.env.SPOTIFY_SECRET;
const redirectUri = 'http://localhost:8080/callback'; // Use full URL

let accessToken = '';
let refreshToken = '';
let tokenExpirationTime = 0;

async function getInitialAccessToken(code) { // For initial token exchange
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  try {
    const response = await EleventyFetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      bodyType: 'urlSearchParams',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    accessToken = data.access_token;
    console.log('AccessToken' + accessToken);
    tokenExpirationTime = Date.now() + (data.expires_in * 1000);
    refreshToken = data.refresh_token; 

    return accessToken; // Return the initial access token
  } catch (error) {
    console.error('Error getting initial access token:', error);
    throw error; // Or handle the error appropriately
  }
}

async function refreshTokenIfNecessary() { 
  // ... (This function remains the same as before)
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  try {
    const response = await EleventyFetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      bodyType: 'urlSearchParams',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + (data.expires_in * 1000);
    refreshToken = data.refresh_token || refreshToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Handle the error appropriately (e.g., throw an error)
  }
}

async function getAccessToken() { 
  if (Date.now() >= tokenExpirationTime) {
    await refreshTokenIfNecessary();
  }
  console.log('Getting Access Token');
  return accessToken;
}

async function getRecentlyPlayedTrack(req = null) {
  try {
    const code = req ? req.query.code : null;
    const endpoint = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

    // Get the initial access token if it's not already available
    if (!accessToken) { 
      await getInitialAccessToken(code);
    }

    const myAccessToken = await getAccessToken(); // Use the refresh logic
    const response = await EleventyFetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${myAccessToken}`
      }
    });

    const data = await response.json();
    console.log("Recent Track:" + data.items[0]);
    return data.items[0]; 
  } catch (error) {
    // ... error handling
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
