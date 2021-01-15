import React, { memo, useState, useCallback } from 'react';
import PlayerWrapper from './PlayerWrapper';
import { isMobile } from 'react-device-detect';
import { uEvent } from '../../Utils/UserEventController';
import {
    NORMAL_MODE,
    PS_MODE,
    NESTED_MODE /** THEATRE_MODE, */,
    CTP_PLAYING,
    CTP_LOADING,
    CTP_ENDED,
    CTP_UP_NEXT,
    CTP_ERROR,
    HIDE_TRANS,
} from '../../Utils/constants.util';
const Video = React.memo((props) => {
    const { id = 1, videoRef, path, dispatch } = props;
    const isPrimary = (id == 1);
    console.log('Render - Video');
    const onDurationChange = useCallback((e) => {
        if (!isPrimary) return;
        const duration = e.target.duration;
        dispatch({ type: 'watch/setDuration', payload: duration });
        /*
        if (this.state.openRange && !this.state.range) {
            // this.setRange([0, duration]); // TODO
        }
        */
    }, [isPrimary]);
    const setCTPEvent = useCallback((a) => {
        dispatch({ type: 'watch/setCTPEvent', payload: { event: a, priVideo: isPrimary } })
    });
    let prevTime = 0;
    let prevUATime = 0;
    const onTimeUpdate = useCallback(({ target: { currentTime } }) => {
        if (!isPrimary) return;
        // Set current time
        // Throttling
        if (Math.abs(prevTime - currentTime) >= 1) {
            const nextCaption = {}; // transControl.updateTranscript(currentTime);
            dispatch({ type: 'watch/timeUpdate', payload: [currentTime, nextCaption] });
            prevTime = currentTime;
        }
        if (Math.abs(prevUATime - currentTime) >= 1) {
            // uEvent.timeupdate(this.currTime());
            // this.sendMediaHistories();
            prevUATime = currentTime;
        }
    }, [isPrimary]);
    const onProgress = useCallback((e) => {
        if (!isPrimary) return;
        const { target: { buffered, currentTime, duration } } = e;
        if (duration > 0) {
            for (let i = 0; i < buffered.length; i += 1) {
                if (buffered.start(buffered.length - 1 - i) < currentTime) {
                    document.getElementById('buffered-amount').style.width = `${(buffered.end(buffered.length - 1 - i) / duration) * 100
                        }%`;
                    break;
                }
            }
        }
    }, [isPrimary]);
    const onPause = useCallback(() => {
        if (!isPrimary) return;
        // this.pause(); check if has paused
        // make both paused
        /*
        setPause(true);
      this.PAUSED = true;
      // uEvent.pause(this.currTime());
      // this.sendMediaHistories();
      */
    }, [isPrimary]);
    const onCanPlayPri = useCallback(() => {
        dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } })
    }, [isPrimary]);
    const onLoadStartPri = useCallback(() => {
        setCTPEvent(CTP_LOADING);
    }, [isPrimary]);
    const onLoadedDataPri = useCallback(() => {
        setCTPEvent(CTP_PLAYING);
    }, [isPrimary]);
    const onWaitingPri = useCallback(() => {
        setCTPEvent(CTP_LOADING);
    }, [isPrimary]);
    const onPlayingPri = useCallback(() => {
        // if (this.PAUSED) this.play();
        setCTPEvent(CTP_PLAYING);
    }, [isPrimary]);
    const onEndedPri = useCallback(() => {
        setCTPEvent(CTP_ENDED);
        dispatch({ type: 'watch/media_pause' });
    }, [isPrimary]);
    const onSeekingPri = useCallback(() => {
        dispatch({ type: 'watch/onSeekingPri', payload: { seeked: false, priVideo: isPrimary } })
    }, [isPrimary]);
    const onSeekedPri = () => {
        dispatch({ type: 'watch/onSeekingPri', payload: { seeked: true, priVideo: isPrimary } })
    }
    const onErrorPri = () => {
        setCTPEvent(CTP_ERROR);
    }
    return (<div className="ct-video-contrainer">
        <PlayerWrapper isPrimary={isPrimary} />
        <video
            playsInline
            autoPlay={isMobile}
            className="ct-video"
            id={"ct-video-" + id}
            ref={videoRef}
            onDurationChange={onDurationChange}
            onTimeUpdate={onTimeUpdate}
            onProgress={onProgress}
            onPause={onPause}
            onCanPlay={onCanPlayPri}
            onLoadStart={onLoadStartPri}
            onLoadedData={onLoadedDataPri}
            onWaiting={onWaitingPri}
            onPlaying={onPlayingPri}
            onEnded={onEndedPri}
            onSeeking={onSeekingPri}
            onSeeked={onSeekedPri}
            onError={onErrorPri}
        >
            {path && <source src={path} type="video/mp4" />}
      Your browser does not support video tag.
    </video>
    </div>)
}, (prevProps, nextProps) => {
    return prevProps.path === nextProps.path;
});
export default Video;