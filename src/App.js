import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
 
const defaultStyle = {
  color: 'green',
  textDecoration: 'underline'
};

// let fakeServerData = {
//   user: {
//     name: 'Richard',
//     playlists: [
//       {
//         name: 'Favourites',
//         songs: [{name: 'beat it', duration: 1234}, {name: 'come on eileen', duration: 1220}, {name: 'pappas got a brand new bag', duration: 889}, {name: 'The quiet things', duration: 1889}]
//       }
//     ]
//   }
// };


class PlaylistCounter extends Component {
  render() {
    
    return (
      <div style={{width: '40%', display: 'inline-block'}}>
        <h2 style={{...defaultStyle, fontSize: '40px'}}>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {

    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs);
    }, []);

    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    }, 0);

    return (
      <div style={{width: '40%', display: 'inline-block'}}>
        <h2 style={{...defaultStyle, fontSize: '40px'}}>{Math.round(totalDuration / (60*60))} Hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img alt="logo"/>
        <input type="text" onKeyUp={event => this.props.onTextChange(event.target.value)}/>
      </div>
      
    );
  }
}

class Playlist extends Component {
  render() {
  let playlist = this.props.playlist;
    return (
      <div>
        <h3>{playlist.name}</h3>
        <img src={playlist.image} alt="cover art"/>
        <ul>
        {
          playlist.songs.map(song =>
          <li>{song.name}</li>)
        }
        </ul>
      </div>
    );
  }
}

class App extends Component {
    constructor() {
    super();
    
    this.state = {
      serverData: {},
      filterString: ''
    };
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me/playlists',{
        headers: {'Authorization': 'Bearer ' + accessToken}
      })
        .then(res => res.json())
        .then(playlistData => {
          let playlists = playlistData.items;
          let trackDataPromises = playlists.map(playlist => {
            let responsePromise = fetch(playlist.tracks.href,{
              headers: {'Authorization': 'Bearer ' + accessToken}
            })
            let trackDataPromise = responsePromise.then(res => res.json())
            return trackDataPromise
          })
          let allTracksDatasPromises =
          Promise.all(trackDataPromises)
            let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
              trackDatas.forEach((trackData, i) => {
                playlists[i].trackDatas = trackData.items
                  .map(item => item.track)
                  .map(trackData => ({
                    name: trackData.name,
                    duration: trackData.duration_ms / 1000
                  }))
              })
              return playlists;
            })
            return playlistsPromise;
        })

        .then(playlists => this.setState({
          user: {name: 'Richard'},
          playlists: playlists.map(item=> ({
                name: item.name,
                songs: item.trackDatas.slice(0,4),
                image: item.images[0].url
              }))
        }))
        .catch(error => console.error(error))

  }

  render() {
    let playlistToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists
          .filter(playlist => playlist.name.toLowerCase()
          .includes(this.state.filterString.toLowerCase()))
        : [];

      return (
      <div className="App">
        {this.state.playlists ? 
          <div>
            <h1>{this.state.user.name}'s Playlists</h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {
              playlistToRender.map(playlist => <Playlist playlist={playlist} />
              )
            }
          </div> : <button onClick={()=> {
            window.location = window.location.href.includes('localhost') ? 'http://localhost:8888/login' : 'https://spotify-react-backend.herokuapp.com/login'}
          }
          style={{padding: '20px', fontSize: '40px', marginTop: '40px'}}>Click to Sign In</button>
        }
      </div>
    );
  }
}

export default App;
