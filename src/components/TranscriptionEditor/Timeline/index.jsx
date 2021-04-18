import React, { useCallback, useEffect } from 'react'
import { connect } from 'dva'
import './index.scss'
import TimelineMarker from './TimelineMarker';
import CaptionMarker from './CaptionMarker'

const MARGIN_SIDE = 24;

function Timeline({ dispatch, transcript, scalelevel, scaleLen, TLWidth, duration }) {
    const whole_length = scaleLen[scalelevel];
    const px_sec = (TLWidth - MARGIN_SIDE * 2) / whole_length;

    useEffect(() => {
        dispatch({ type: 'transeditor/initTimeline', payload: { duration } })
    }, [duration]);
    const trans2 = transcript.slice(0, 15);
    return (
        <ytve-timeline dir="ltr" className="ct-editor">
            <div id="header-container" className="ct-timeline">
                <div id="menu-offset" className="ct-timeline"></div>
                <ytve-timeline-header className="no-select ct-timeline">
                    <canvas id="canvas" className="ct-timeline-header" style={{ width: TLWidth, height: 24 }}></canvas>
                    <ytcp-icon-button id="find-left-button" aria-label="查找进度条指针" icon="image:lens" tooltip-label="跳到进度条指针处" className="ct-timeline-header" tabindex="-1" aria-disabled="false" role="button">
                        <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                            <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" className="tp-yt-iron-icon" style201="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g className="tp-yt-iron-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" className="tp-yt-iron-icon"></path>
                                </g>
                            </svg>
                        </tp-yt-iron-icon>
                    </ytcp-icon-button>
                    <ytcp-icon-button id="find-right-button" aria-label="查找进度条指针" icon="image:lens" tooltip-label="跳到进度条指针处" className="ct-timeline-header" tabindex="-1" aria-disabled="false" role="button">
                        <tp-yt-iron-icon className="remove-defaults ytcp-icon-button">
                            <svg viewbox="0 0 24 24" preserveaspectratio="xMidYMid meet" focusable="false" className="tp-yt-iron-icon" style201="pointer-events: none; display: block; width: 100%; height: 100%;">
                                <g className="tp-yt-iron-icon">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" className="tp-yt-iron-icon"></path>
                                </g>
                            </svg>
                        </tp-yt-iron-icon>
                    </ytcp-icon-button>
                </ytve-timeline-header>
            </div>
            <div id="scroll-area" className="ct-timeline">
                <div id="plugin-timeline-surface" className="ct-timeline">
                    <ytve-captions-editor-timeline id="CAPTIONS" className="ct-timeline">
                        <ytve-timeline-base icon="av:subtitles" label="字幕" className="ct-captions-editor-timeline" active="">
                            <div className="header ct-timeline-base">
                                <i className="material-icons">subtitles</i>
                                <ytcp-paper-tooltip position="bottom" type="label" className="ct-timeline-base">
                                    <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152144">
                                        <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                                        <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                            字幕
                     </div>
                                        <dom-if className="ytcp-paper-tooltip"></dom-if>
                                    </ytcp-paper-tooltip-placeholder>
                                </ytcp-paper-tooltip>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <div className="header-expanded ct-timeline-base"></div>
                            </div>
                            <div id="captions-timeline-content" slot="content" className="ct-captions-editor-timeline">
                                <div className="captions-row-container ct-captions-editor-timeline">
                                    <div id="captions-row" className="ct-captions-editor-timeline" style={{ left: 24, width: 1097 }}></div>
                                    <div id="decorations" className="no-select ct-captions-editor-timeline">
                                        {
                                            trans2.map((k) => <CaptionMarker data={k} leftoff={24} factor={px_sec} />)
                                        }
                                    </div>
                                </div>
                            </div>
                        </ytve-timeline-base>
                    </ytve-captions-editor-timeline>
                    <ytve-audio-editor-timeline id="AUDIO_WAVEFORM" className="ct-timeline">
                        <ytve-timeline-base icon="image:music-note" label="音频" className="ct-audio-editor-timeline">
                            <div className="header ct-timeline-base">
                                <i className="material-icons">audiotrack</i>
                                <ytcp-paper-tooltip position="bottom" type="label" className="ct-timeline-base">
                                    <ytcp-paper-tooltip-placeholder className="ytcp-paper-tooltip" disable-upgrade="" role="tooltip" id="goog_954152145">
                                        <div id="slot-wrapper" className="ytcp-paper-tooltip"></div>
                                        <div id="tooltip-placeholder-fake-slot" className="ytcp-paper-tooltip">
                                            音频
                     </div>
                                        <dom-if className="ytcp-paper-tooltip"></dom-if>
                                    </ytcp-paper-tooltip-placeholder>
                                </ytcp-paper-tooltip>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <dom-if restamp="" className="ct-timeline-base"></dom-if>
                                <div className="header-expanded ct-timeline-base"></div>
                            </div>
                            <div id="audio-timeline-content" slot="content" className="ct-audio-editor-timeline">
                                <paper-spinner-lite active="" className="ct-audio-editor-timeline" hidden="true">
                                    <div id="spinnerContainer" className="active  paper-spinner-lite">
                                        <div className="spinner-layer paper-spinner-lite">
                                            <div className="circle-clipper left paper-spinner-lite">
                                                <div className="circle paper-spinner-lite"></div>
                                            </div>
                                            <div className="circle-clipper right paper-spinner-lite">
                                                <div className="circle paper-spinner-lite"></div>
                                            </div>
                                        </div>
                                    </div>
                                </paper-spinner-lite>
                                <ytve-audio-waveform className="ct-audio-editor-timeline">
                                    <canvas id="audio-waveform" className="no-select ct-audio-waveform" height="48" width={TLWidth} style201="height: 48px; width: 1145px;"></canvas>
                                </ytve-audio-waveform>
                            </div>
                        </ytve-timeline-base>
                    </ytve-audio-editor-timeline>
                </div>
            </div>
            <TimelineMarker />
        </ytve-timeline>

    )
}

export default connect(({
    watch: { transcript, duration },
    transeditor: { scalelevel, TLWidth, scaleLen }
}) => ({
    transcript, scalelevel, TLWidth, duration, scaleLen
}))(Timeline);