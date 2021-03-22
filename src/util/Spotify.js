

const clientID = "58eecceee1fa433c9c233dbb9618d2f3";
const queryUrl = 'https://accounts.spotify.com/authorize';
const redirectUri = 'http://localhost:3000/';
let accessToken;
const finalQ = `${queryUrl}?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;


const Spotify = {
  getAccessToken: function(){
      if(accessToken){return accessToken;}
    const accesto = window.location.href.match(/access_token=([^&]*)/);
    const expin = window.location.href.match(/expires_in=([^&]*)/);
    if(accesto && expin){
        accessToken = accesto[1];
        const expiresIn = Number(expin[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken} else {window.location = finalQ;}
    

},

search: function(term){
   let userAccessToken = Spotify.getAccessToken();
   console.log(userAccessToken)
   return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {Authorization: `Bearer ${userAccessToken}`}}).then(
           Response => {
               let searchid= Response.json();
               console.log (searchid);
               return searchid;}).then(
           jsonResponse => {
               return jsonResponse.tracks.items.map(track =>(
        {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
        }
        )
        );
    });
},

savePlaylist: function(playName,trackUri){
const userAccessToken= Spotify.getAccessToken();
if (!playName || !trackUri.length) {
    return;
  }
    let headers = {Authorization: `Bearer ${userAccessToken}`};
    let userID = '';
    return fetch('https://api.spotify.com/v1/me',{headers: headers}).then(
    Response => Response.json()).then(jsonResponse => {
    userID = jsonResponse.id;
    console.log(userID);
    return fetch('https://api.spotify.com/v1/users/'+userID+'/playlists',{
        method:'POST',
        headers: headers,
        body: JSON.stringify({name: playName})
    }).then(postPl => postPl.json()).then(playlistres =>
        {
        const playlistID = playlistres.id;
        console.log(playlistID);
        return fetch('https://api.spotify.com/v1/users/'+userID+'/playlists/'+playlistID+'/tracks',{
        method:'POST',
        headers: headers,
        body: JSON.stringify({uris: trackUri})
    });
})})
    
}
};



export default Spotify;