import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Videos from './Videos'
import { util } from 'utils'
import './index.css'

function PlaylistsMenu({
  show=false,
  handleClose=null,
  currMedia={},
  currPlaylist={},
  playlists=[],
  watchHistory=[],
}) {
  const currPlaylistId = currPlaylist.id
  const currMediaId = currMedia.id

  const [selectedPlaylist, setSelectedPlaylist] = useState({ medias: [] })

  useEffect(() => {
    if (playlists.length > 0) {
      setSelectedPlaylist(
        playlists.find( pl => pl.id === currPlaylistId) || {}
      )
      util.scrollToCenter(currPlaylistId)
    }
  }, [playlists])

  useEffect(() => {
    
  })

  const handlePlaylistClick = playlist => () => {
    setSelectedPlaylist(playlist)
  }

  return show ? (
    <div className="watch-playlists-menu">
      {/* Close Btn */}
      <button className="plain-btn watch-playlists-menu-close-btn" onClick={handleClose}>
        <i className="material-icons">close</i>
      </button>

      {/* Playlists view */}
      <div className="watch-playlists-list">
        <div className="watch-list-title"><p>Playlists</p></div>
        {playlists.map( playlistItem => (
          <button 
            id={playlistItem.id}
            key={playlistItem.id}
            className="watch-playlist-item plain-btn" 
            onClick={handlePlaylistClick(playlistItem)}
          >
            <i className="material-icons library-icon">video_library</i>
            <p className="playlist-name">
              {playlistItem.name}
              {currPlaylistId === playlistItem.id && <><br/><span>Current Playlist</span></>}
            </p>
            <i className="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>

      {/* Videos view */}
      <Videos 
        medias={selectedPlaylist.medias.slice().reverse()} 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        selectedPlaylist={selectedPlaylist}
        playlists={playlists}
      />

    </div>
  ) : null;
}

export default withRouter(PlaylistsMenu)