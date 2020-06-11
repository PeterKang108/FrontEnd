import React, { Component } from 'react'
import { CTLayout } from 'layout'
import { api } from 'utils';

export class InstPlaylist extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Playlist',
        icon: 'list',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    return (
      <CTLayout {...layoutProps} />
    )
  }
}
