import React, { useEffect } from 'react';
import "./live_test.css";
import CTPlayer, { ClassTranscribePlayer } from 'components/CTPlayer';
import { uurl } from 'utils/use-url';
import { isMobile } from 'react-device-detect';
import { CTLayout, CTScrollArea } from '../../layout';
import {
  ControlBar,
  Transcriptions,
  TransCtrlButtons,
  LivePlayerNavBar,
  LivePlayerFooter,
} from './Components';

function LiveTest(props) {
  // const {}
  const { videosrc, iframesrc = null } = uurl.useSearch();
  const { isFullscreen } = props;
  if (!videosrc) {
    return <>Need videosrc, iframesrc params</>
  }
  const media = {
    isLive: true, // if this source is live
    videos: [{
      useHls: true,
      srcPath1: videosrc
      // srcPath1: 'https://klive.kaltura.com/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8?__hdnea__=st=1618984738~exp=1619071138~acl=/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8*~hmac=f2462a504f3b020d2be1862aaab876b93a77b1f8f682a757215e6a93cea8b898'
    }]
  };
  // https://hls-js.netlify.app/demo/
  const layoutProps = CTLayout.createProps({
    transition: true,
    logoBrand: isMobile,
    headerProps: {
      show: !isFullscreen,
    },
    sidebarProps: {
      float: true
    }
  });
  return <>
    <LivePlayerNavBar />
    <CTScrollArea {...layoutProps}>
      <div id="live-player">
        <div className="watch-bg" id="watch-page">
          <CTPlayer
            fill
            defaultOpenCC
            hideWrapperOnMouseLeave
            allowTwoScreen
            allowScreenshot
            // onScreenshotCaptured={alert}
            media={media}
          />
        </div>
      </div>
    </CTScrollArea>
    <LivePlayerFooter />
  </>
}

export default LiveTest;
