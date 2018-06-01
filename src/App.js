import React, { Component } from 'react';
import './App.css';
import { setTimeout } from 'core-js';
 
const defaultStyle = {
  color: 'green',
  'text-decoration': 'underline'
};

let fakeServerData = {
  user: {
    name: 'Richard',
    playlists: [
      {
        name: 'Favourites',
        songs: [{name: 'beat it', duration: 1234}, {name: 'come on eileen', duration: 1220}, {name: 'pappas got a brand new bag', duration: 889}, {name: 'The quiet things', duration: 1889}]
      },
      {
        name: 'Weekly',
        songs: [{name: 'beat it2', duration: 1234}, {name: 'come on eileen2', duration: 1220}, {name: 'pappas got a brand new bag2', duration: 889}]
      },
      {
        name: 'Favourites3',
        songs: [{name: 'beat it3', duration: 1234}, {name: 'come on eileen3', duration: 1220}, {name: 'pappas got a brand new bag3', duration: 889}]
      },
      {
        name: 'Favourites4',
        songs: [{name: 'beat it4', duration: 1234}, {name: 'come on eileen4', duration: 1220}, {name: 'pappas got a brand new bag4', duration: 889}]
      },
    ]
  }
};


class PlaylistCounter extends Component {
  render() {
    
    return (
      <div style={{width: '40%', display: 'inline-block'}}>
        <h2 style={{...defaultStyle, 'font-size': '40px'}}>{this.props.playlists.length} playlists</h2>
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
        <h2 style={{...defaultStyle, 'font-size': '40px'}}>{Math.round(totalDuration / (60*60))} Hours</h2>
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
        <img src="" alt="playlist"/>
        <h3>{playlist.name}</h3>
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
    setTimeout(() => {
      this.setState({serverData: fakeServerData})
    }, 500);
  }
  render() {
    let playlistToRender = this.state.serverData.user ? this.state.serverData.user.playlists
      .filter(playlist => playlist.name.toLowerCase()
      .includes(this.state.filterString.toLowerCase())) : [];

      return (
      <div className="App">
        {this.state.serverData.user ? 
          <div>
            <h1>{this.state.serverData.user.name}'s Playlists</h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text => this.setState({filterString: text})}/>
            {
              playlistToRender.map(playlist => <Playlist playlist={playlist} />
              )
            }
          </div> : 'Loading...'
        }
      </div>
    );
  }
}

export default App;
