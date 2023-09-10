// https://github.com/itsnubix/react-native-video-controls/blob/master/VideoPlayer.js

import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    TouchableWithoutFeedback,
    TouchableHighlight,
    ImageBackground,
    PanResponder,
    StyleSheet,
    Animated,
    SafeAreaView,
    Easing,
    Image,
    View,
    Text,
    Dimensions,
    PixelRatio,
    StatusBar,
    BackHandler, Platform,
} from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import _ from 'lodash';
import Orientation from 'react-native-orientation';
import {CustomTextB, CustomTextR, TextRobotoR} from "../Style/CustomText";

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
/*
const SCREEN_WIDTH =  Dimensions.get("window").width;
getScreenHeight = () => {
    const status = getStatusBarHeight();

    if(Platform.OS == 'android') {
        return Dimensions.get("window").height;
    } else {
        if (isIphoneX()) {
            return Dimensions.get("window").height - status;
        } else {

            return Dimensions.get("window").height - status;
        }
    }
}
const SCREEN_HEIGHT = getScreenHeight();
*/

// 문제 2) hide 되어 있는 경우 항목에 이벤트가 아무런 작동을 하지 않음
// : onScreenTouch 이벤트가 실행되지 않음
// 문제 1) 컨트롤러 영역이 hide 되어 있더라도 항목에 클릭이 됨

// 3월 16일
// DONE 최상위 음영 처리
// DONE iOS 타이머 텍스트 노출되지 않는 문제(timer, totalTimer에 강제 높이값 부여)
// DONE maximum call stack size exceed
// DONE 컨트롤러 보이지 않는 경우 컨트롤러 내부 항목 이벤트 전파
//      ㄴ 1차 컨트롤러 항목별 함수 내부에서 컨트롤러 노출 여부에 따라서 이벤트 분기 처리
// DONE 전체 화면 시 스크롤 방지 혹은 하단 영역 숨김 처리

// 3월 17일
// DONE 일반 화면 전환 시 Video 높이 초기값과 상이함
// DONE 전체 화면 전환 시 오토로딩(_orientationDidChange에서 강제 paused false 처리)
// DONE iOS 재생 중단으로 인한 스크롤 애니메이션(Bounce Effect) 강제 해제
//      ㄴ <ScrollView bounces={false} />
// DONE 다른 영상 재생 시 오토로딩
// DONE 씨커 조정 혹은 15초 전후 이동 시 버그 수정
//      ㄴ 1차 재생 시간 이후로 조정하려는 경우 자동으로 재생 종료 처리
//      ㄴ 2차 재생 시간 종료 후에 시간 초기화(onPanResponderRelease)
// NONE 씨커 이동 시 재생 시간 노출되도록 적용(onPanResponderMove)
//      ㄴ 썸네일 노출 부분과 동일한 작업 발생으로 인한 보류
//          : const time = this.calculateTimeFromSeekerPosition();
//          : this.seekTo( time );
// DONE poster(로드중 노출 이미지) 적용
// DONE iOS SafeAreaView 영향 크기 조정
//      ㄴ 1차 전체 화면 여부(isFullscreen)에 따라서 컨테이너 컴포넌트를 View - SafeAreaView로 교체???
//          : 컴포넌트 초기화로 인한 이어듣기 불가
//      ㄴ 2차 컨텐츠를 변수에 담아서 컨테이너만 교체하는 방식으로 진행
//      ㄴ 3차 부모 및 컴포넌트의 크기를 Fullscreen인 경우에 조정(_orientationDidChange)
//          : 단 다중 디바이스에서 테스트 필요함
//          : ㄴ https://medium.com/@hckcksrl/react-native%EC%97%90%EC%84%9C-safeareaview%EC%9D%98-height-%EA%B5%AC%ED%95%98%EA%B8%B0-3f04c06597be
//          : 추가로 SafeAreaView에 대한 배경색 지정 처리
//          : 컨테이너가 SafeAreaView를 초과하는 경우 상단 배경화면이 오버랩되는 현상 수정
//      ㄴ 4차 비디오 영역이 풀스크린인 경우(간혹 아닐때도) 상하단이 축소되는 오류(시뮬레이터 기준) 수정
// DONE iOS SafeAreaView 상단 색상 변경 불가 현상 수정
// DONE iOS landscap Lock 상태에서 스마트폰 회전 시 _orientationDidChange이 호출되는 현상 예외 처리(_orientationDidChange)

// TODO 필수 과정!

    // TODO 일반 화면 및 전체 화면 레이아웃 교체
    //      ㄴ (완료) 1차 CenterControls을 좌측 - 중앙 - 우측으로 분리하고 컨테이너에 space-between으로 지정
    //      ㄴ (완료) 2차 isFullscreen 상태에 따라서 render 위치를 변경
    //      ㄴ (진행) 3차 전체 화면 모드에서 BottomControls 내 항목들에 대한 레이아웃 조정
    //          : 전체 화면 - 비디오 영역 간격 만큼 컨텐츠 마진 추가

    // TODO Android Seeker Maximum 깜빡임
    // TODO Anroid 진행 시간 텍스트 크기 조정

// TODO 심화 과정!

    // TODO orientation 변경 시 애니메이션 교정
    // ㄴ 1차 _orientationDidChanged에서 orientation 관련 parent - child 함수 호출 시점을 변경
    //      : 완벽하지는 않음

    // TODO 하드웨어 백 버튼 고려 작업
    // ㄴ 1차 _onBack에서 임시 처리 함
    // ㄴ 2차 Orientation Listener를 고려하여 통합 관리가 필요함

    // TODO 로딩 여부 체크 및 재생 원활하도록 수정
    // ㄴ 1차 loading state를 사용한 로더 활성화
    // ㄴ 2차 UNSAFE_componentWillReceiveProps(nextProps) 원리 분석을 통한 정교화?
    // : https://ko.reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops

    // TODO 일반 화면 탐색바에 대한 스냅샷 노출
    //      ㄴ 1차 https://github.com/souvik-ghosh/react-native-create-thumbnail (Android freeze 현상 보고)
    //      ㄴ 2차 https://github.com/shahen94/react-native-video-processing#usage (의존성 강제 업데이트)

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export default class SampleVideoScreen3 extends Component {

    static defaultProps = {
        toggleResizeModeOnFullscreen:   false,
        playInBackground:               false,
        playWhenInactive:               false,
        showOnStart:                    true,
        resizeMode:                     'contain',
        paused:                         true,
        repeat:                         false,
        volume:                         1,
        muted:                          false,
        title:                          '',
        rate:                           1,
        isFullscreen:                   false,
        videoWidth: SCREEN_WIDTH,
        videoHeight: SCREEN_WIDTH * ( 9 / 16 ),
        previewWidth: 140,
        previewHeight: 70,
        posterResizeMode:               'contain',
    };

    constructor( props ) {
        super( props );

        /**
         * All of our values that are updated by the
         * methods and listeners in this class
         */
        this.state = {
            // Video
            resizeMode: this.props.resizeMode,
            paused: this.props.paused,
            muted: this.props.muted,
            volume: this.props.volume,
            rate: this.props.rate,
            videoWidth: this.props.videoWidth,
            videoHeight: this.props.videoHeight,
            // Controls
            previewWidth: this.props.previewWidth,
            previewHeight: this.props.previewHeight,
            previewBottom: 0,
            previewImage: require('../../assets/images/alien.jpg'),
            isPreview: false,
            poster: this.props.poster,
            posterResizeMode: this.props.posterResizeMode,

            isFullscreen: this.props.isFullScreen || this.props.resizeMode === 'cover' || false,
            showTimeRemaining: false,
            volumeTrackWidth: 0,
            lastScreenPress: 0,
            volumeFillWidth: 0,
            seekerFillWidth: 0,
            showControls: this.props.showOnStart,
            volumePosition: 0,
            seekerPosition: 0,
            volumeOffset: 0,
            seekerOffset: 0,
            seeking: false,
            loading: true,
            currentTime: 0,
            error: false,
            duration: 0,
        };

        /**
         * Any options that can be set at init.
         */
        this.opts = {
            playWhenInactive: this.props.playWhenInactive,
            playInBackground: this.props.playInBackground,
            repeat: this.props.repeat,
            title: this.props.title,
        };

        /**
         * Our app listeners and associated methods
         */
        this.events = {
            onError: this.props.onError || this._onError.bind( this ),
            onBack: this.props.onBack || this._onBack.bind( this ),
            onEnd: this.props.onEnd || this._onEnd.bind( this ),
            onScreenTouch: this._onScreenTouch.bind( this ),
            onEnterFullscreen: this.props.onEnterFullscreen,
            onExitFullscreen: this.props.onExitFullscreen,
            onLoadStart: this._onLoadStart.bind( this ),
            onProgress: this._onProgress.bind( this ),
            onLoad: this._onLoad.bind( this ),
            onPause: this.props.onPause,
            onPlay: this.props.onPlay,
        };

        /**
         * Functions used throughout the application
         */
        this.methods = {
            toggleFullscreen: this._toggleFullscreen.bind( this ),
            playBack: this._playBack.bind( this ),
            playVideoPrev: this._playVideoPrev.bind( this ),
            togglePlayPause: this._togglePlayPause.bind( this ),
            playVideoNext: this._playVideoNext.bind( this ),
            playFront: this._playFront.bind( this ),
            toggleControls: this._toggleControls.bind( this ),
            toggleTimer: this._toggleTimer.bind( this ),
        };

        /**
         * Player information
         */
        this.player = {
            controlTimeoutDelay: this.props.controlTimeout || 10000,
            volumePanResponder: PanResponder,
            seekPanResponder: PanResponder,
            controlTimeout: null,
            volumeWidth: 150,
            iconOffset: 0,
            seekerWidth: 0,
            ref: Video,
        };

        /**
         * Various animations
         */
        const initialValue = this.props.showOnStart ? 1 : 0;
        this.animations = {
            bottomControl: {
                marginBottom: new Animated.Value( 0 ),
                opacity: new Animated.Value( initialValue ),
            },
            centerControl: {
                marginBottom: new Animated.Value( 0 ),
                opacity: new Animated.Value( initialValue ),
            },
            topControl: {
                marginTop: new Animated.Value( 0 ),
                opacity: new Animated.Value( initialValue ),
            },
            video: {
                opacity: new Animated.Value( 1 ),
            },
            loader: {
                rotate: new Animated.Value( 0 ),
                MAX_VALUE: 360,
            }
        };

        /**
         * Various styles that be added...
         */
        this.styles = {
            videoStyle: this.props.videoStyle || {},
            containerStyle: this.props.style || {}
        };

        //console.log('#########' + this.state.previewHeight)
    }



    /**
     | -------------------------------------------------------
     | Events
     | -------------------------------------------------------
     |
     | These are the events that the <Video> component uses
     | and can be overridden by assigning it as a prop.
     | It is suggested that you override onEnd.
     |
     */

    /**
     * When load starts we display a loading icon
     * and show the controls.
     */
    _onLoadStart() {
        //console.log('_onLoadStart()');

        let state = this.state;
        state.loading = true;
        this.loadAnimation();
        this.setState( state );

        if ( typeof this.props.onLoadStart === 'function' ) {
            this.props.onLoadStart(...arguments);
        }
    }

    /**
     * When load is finished we hide the load icon
     * and hide the controls. We also set the
     * video duration.
     *
     * @param {object} data The video meta data
     */
    _onLoad( data = {} ) {
        //console.log('_onLoad()');

        let state = this.state;

        state.duration = data.duration;
        state.loading = false;
        this.setState( state );

        if ( state.showControls ) {
            this.setControlTimeout();
        }

        if ( typeof this.props.onLoad === 'function' ) {
            this.props.onLoad(...arguments);
        }
    }

    /**
     * For onprogress we fire listeners that
     * update our seekbar and timer.
     *
     * @param {object} data The video meta data
     */
    _onProgress( data = {} ) {
        //console.log('_onProgress()')
        //console.log('   > data.currentTime = ' + data.currentTime)

        let state = this.state;
        state.currentTime = data.currentTime;

        if ( ! state.seeking ) {
            const position = this.calculateSeekerPosition();
            this.setSeekerPosition( position );
        }

        if ( typeof this.props.onProgress === 'function' ) {
            this.props.onProgress(...arguments);
        }

        this.setState( state );
    }

    /**
     * It is suggested that you override this
     * command so your app knows what to do.
     * Either close the video or go to a
     * new page.
     */
    _onEnd() {
        //console.log('_onEnd()')
        //this.setSeekerPosition(this.state.duration);
        this.setSeekerPosition();
        //this.seekTo(this.state.duration);
        this.seekTo();
        this.setState({
            paused: true,
        })
    }

    /**
     * Set the error state to true which then
     * changes our renderError function
     *
     * @param {object} err  Err obj returned from <Video> component
     */
    _onError( err ) {
        //console.log('_onError()')
        console.log('   > err ' + err)
        let state = this.state;
        state.error = true;
        state.loading = false;

        this.setState( state );
    }

    /**
     * This is a single and double tap listener
     * when the user taps the screen anywhere.
     * One tap toggles controls, two toggles
     * fullscreen mode.
     */
    _onScreenTouch(e) {
        let state = this.state;
        const time = new Date().getTime();
        const delta =  time - state.lastScreenPress;

        if ( delta < 300 ) {
            //this.methods.toggleFullscreen();
        }

        this.methods.toggleControls();
        state.lastScreenPress = time;

        this.setState( state );
    }



    /**
     | -------------------------------------------------------
     | Methods
     | -------------------------------------------------------
     |
     | These are all of our functions that interact with
     | various parts of the class. Anything from
     | calculating time remaining in a video
     | to handling control operations.
     |
     */

    /**
     * Set a timeout when the controls are shown
     * that hides them after a length of time.
     * Default is 15s
     */
    setControlTimeout() {
        //console.log('setControlTimeout()', 'CALL')
        this.player.controlTimeout = setTimeout( ()=> {
            this._hideControls();
        }, this.player.controlTimeoutDelay );
    }

    /**
     * Clear the hide controls timeout.
     */
    clearControlTimeout() {
        //console.log('clearControlTimeout()', 'CALL')
        clearTimeout( this.player.controlTimeout );
    }

    /**
     * Reset the timer completely
     */
    resetControlTimeout() {
        //console.log('resetControlTimeout()', 'CALL')
        this.clearControlTimeout();
        this.setControlTimeout();
    }

    /**
     * Animation to hide controls. We fade the
     * display to 0 then move them off the
     * screen so they're not interactable
     */
    hideControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 0 }
            ),
            /*
            Animated.timing(
                this.animations.topControl.marginTop,
                { toValue: -100 }
            ),
            */
            Animated.timing(
                this.animations.centerControl.opacity,
                { toValue: 0 }
            ),
            /*
            Animated.timing(
                this.animations.centerControl.marginTop,
                { toValue: -100 }
            ),
            */
            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 0 }
            ),
            /*
            Animated.timing(
                this.animations.bottomControl.marginBottom,
                { toValue: -100 }
            ),
            */
        ]).start();
    }

    /**
     * Animation to show controls...opposite of
     * above...move onto the screen and then
     * fade in.
     */
    showControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 1 }
            ),
            /*
            Animated.timing(
                this.animations.topControl.marginTop,
                { toValue: 0 }
            ),
            */
            Animated.timing(
                this.animations.centerControl.opacity,
                { toValue: 1 }
            ),
            /*
            Animated.timing(
                this.animations.centerControl.marginBottom,
                { toValue: 0 }
            ),
            */
            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 1 }
            ),
            /*
            Animated.timing(
                this.animations.bottomControl.marginBottom,
                { toValue: 0 }
            ),
            */
        ]).start();
    }

    /**
     * Loop animation to spin loader icon. If not loading then stop loop.
     */
    loadAnimation() {
        if ( this.state.loading ) {
            Animated.sequence([
                Animated.timing(
                    this.animations.loader.rotate,
                    {
                        toValue: this.animations.loader.MAX_VALUE,
                        duration: 1500,
                        easing: Easing.linear,
                    }
                ),
                Animated.timing(
                    this.animations.loader.rotate,
                    {
                        toValue: 0,
                        duration: 0,
                        easing: Easing.linear,
                    }
                ),
            ]).start( this.loadAnimation.bind( this ) );
        }
    }

    /**
     * Function to hide the controls. Sets our
     * state then calls the animation.
     */
    _hideControls() {
        if(this.mounted) {
            //console.log('_hideControls()', 'this.mounted == ' + this.mounted)
            let state = this.state;
            state.showControls = false;
            this.hideControlAnimation();

            this.setState( state );
        } else {
            //console.log('_hideControls()', 'this.mounted == ' + this.mounted)
        }
    }

    /**
     * Function to toggle controls based on
     * current state.
     */
    _toggleControls() {
        let state = this.state;
        state.showControls = ! state.showControls;

        if ( state.showControls ) {
            this.showControlAnimation();
            this.setControlTimeout();
        }
        else {
            this.hideControlAnimation();
            this.clearControlTimeout();
        }

        this.setState( state );
    }

    /**
     * Toggle fullscreen changes resizeMode on
     * the <Video> component then updates the
     * isFullscreen state.
     */
    _toggleFullscreen() {
        let state = this.state;

        state.isFullscreen = ! state.isFullscreen;

        // 커스터마이즈 부분
        state.isFullscreen
            ? Orientation.lockToLandscapeLeft()
            : Orientation.lockToPortrait();


        if (this.props.toggleResizeModeOnFullscreen) {
            state.resizeMode = state.isFullscreen === true ? 'cover' : 'contain';
        }

        this.setState( state );

        if (state.isFullscreen) {
            typeof this.events.onEnterFullscreen === 'function' && this.events.onEnterFullscreen();
        }
        else {
            typeof this.events.onExitFullscreen === 'function' && this.events.onExitFullscreen();
        }
    }

    /*
    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }
     */

    calculateSeekerPositionFromTime= (time) => {
        return ( time * this.player.seekerWidth ) / this.state.duration;
    }

    /**
     * play back 15 seconds video on <Video> component
     */
    _playBack() {
        if(this.state.showControls) {
            /* 1단계
            onPanResponderGrant: ( evt, gestureState ) => {
                let state = this.state;
                this.clearControlTimeout();
                state.seeking = true;
                this.setState( state );
            },
             */
            this.clearControlTimeout();
            this.setState({ seeking: true })

            /* 2단계
            onPanResponderMove: ( evt, gestureState ) => {
                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition( position );
            },
            */
            const position = this.state.seekerOffset - this.calculateSeekerPositionFromTime(15);
            this.setSeekerPosition( position );

            /* 3단계
            onPanResponderRelease: ( evt, gestureState ) => {
                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                if ( time >= state.duration && ! state.loading ) {
                    state.paused = true;
                    this.events.onEnd();
                } else {
                    this.seekTo( time );
                    this.setControlTimeout();
                    state.seeking = false;
                }
                this.setState( state );
            }
            */

            const time = this.calculateTimeFromSeekerPosition();
            this.seekTo( time );
            this.setState({ seeking: false })
        } else {
            this.events.onScreenTouch()
        }
    }

    /**
     * play prev video on <Video> component
     */
    _playVideoPrev() {
        if(this.state.showControls) {
            this.props.screenState.moveLectureItem(false)
        } else {
            this.events.onScreenTouch()
        }
    }

    /**
     * Toggle playing state on <Video> component
     */
    _togglePlayPause() {
        //console.log('_togglePlayPause()');

        if(this.state.showControls) {
            //console.log('   > this.state.showControls == true')
            let state = this.state;
            state.paused = !state.paused;

            if (state.paused) {
                typeof this.events.onPause === 'function' && this.events.onPause();
            }
            else {
                typeof this.events.onPlay === 'function' && this.events.onPlay();
            }

            this.setState( state );
        } else {
            //console.log('   > this.state.showControls == false')
            this.events.onScreenTouch()
        }
    }

    /**
     * play next video on <Video> component
     */
    _playVideoNext() {
        if(this.state.showControls) {
            this.props.screenState.moveLectureItem(true)
        } else {
            this.events.onScreenTouch()
        }
    }

    /**
     * play front 15 seconds video on <Video> component
     */
    _playFront() {
        if(this.state.showControls) {
            // 자세한 프로세스는 함수 _playBack() 주석 참고
            this.clearControlTimeout();
            this.setState({ seeking: true })

            const position = this.state.seekerOffset + this.calculateSeekerPositionFromTime(15);
            this.setSeekerPosition( position );

            const time = this.calculateTimeFromSeekerPosition();
            this.seekTo( time );
            this.setState({ seeking: false })
        } else {
            this.events.onScreenTouch()
        }
    }

    /**
     * Toggle between showing time remaining or
     * video duration in the timer control
     */
    _toggleTimer() {
        if(this.state.showControls) {
            //let state = this.state;
            //state.showTimeRemaining = ! state.showTimeRemaining;
            //this.setState( state );
        } else {
            this.events.onScreenTouch()
        }
    }

    /**
     * The default 'onBack' function pops the navigator
     * and as such the video player requires a
     * navigator prop by default.
     */
    _onBack(isHardware = false) {
        if(!isHardware) {
            if(!this.state.isFullscreen) {
                if (this.state.showControls) {
                    /*
                        if ( this.props.navigator && this.props.navigator.pop ) {
                            this.props.navigator.pop();
                        }
                        else {
                            console.warn( 'Warning: _onBack requires navigator property to function. Either modify the onBack prop or pass a navigator prop' );
                        }
                    */
                    Orientation.lockToPortrait();
                    this.props.navigation.goBack();
                } else {
                    this.events.onScreenTouch()
                }
            } else {
                if (this.state.showControls) {
                    this._toggleFullscreen();
                } else {
                    this.events.onScreenTouch()
                }
            }
        } else {
            if (this.state.isFullscreen) {
                this._toggleFullscreen();
            } else {
                this.props.navigation.goBack();
            }
        }
    }

    /**
     * Calculate the time to show in the timer area
     * based on if they want to see time remaining
     * or duration. Formatted to look as 00:00.
     */
    calculateTime() {
        if ( this.state.showTimeRemaining ) {
            //console.log('calculateTime() CASE ONE')
            const time = this.state.duration - this.state.currentTime;
            return `-${ this.formatTime( time ) }`;
        } else {
            //console.log('calculateTime() CASE TWO')
        }

        return this.formatTime( this.state.currentTime );
    }

    calculateTotalTime() {
        return this.formatTime( this.state.duration );
    }

    /**
     * Format a time string as mm:ss
     *
     * @param {int} time time in milliseconds
     * @return {string} formatted time string in mm:ss format
     */
    formatTime( time = 0 ) {
        const symbol = this.state.showRemainingTime ? '-' : '';
        time = Math.min(
            Math.max( time, 0 ),
            this.state.duration
        );

        const formattedHours = _.padStart( Math.floor( time / ( 60 * 60 ) ).toFixed( 0 ), 2, 0 );
        const formattedMinutes = _.padStart( Math.floor( time / 60 ).toFixed( 0 ), 2, 0 );
        const formattedSeconds = _.padStart( Math.floor( time % 60 ).toFixed( 0 ), 2 , 0 );

        return `${ symbol }${ formattedHours }:${ formattedMinutes }:${ formattedSeconds }`;
    }

    /**
     * Set the position of the seekbar's components
     * (both fill and handle) according to the
     * position supplied.
     *
     * @param {float} position position in px of seeker handle}
     */
    setSeekerPosition( position = 0 ) {
        let state = this.state;
        position = this.constrainToSeekerMinMax( position );

        state.seekerFillWidth = position;
        state.seekerPosition = position;

        if ( ! state.seeking ) {
            state.seekerOffset = position
        };

        this.setState( state );
    }

    /**
     * Contrain the location of the seeker to the
     * min/max value based on how big the
     * seeker is.
     *
     * @param {float} val position of seeker handle in px
     * @return {float} contrained position of seeker handle in px
     */
    constrainToSeekerMinMax( val = 0 ) {
        if ( val <= 0 ) {
            return 0;
        }
        else if ( val >= this.player.seekerWidth ) {
            return this.player.seekerWidth;
        }
        return val;
    }

    /**
     * Calculate the position that the seeker should be
     * at along its track.
     *
     * @return {float} position of seeker handle in px based on currentTime
     */
    calculateSeekerPosition() {
        const percent = this.state.currentTime / this.state.duration;
        return this.player.seekerWidth * percent;
    }

    /**
     * Return the time that the video should be at
     * based on where the seeker handle is.
     *
     * @return {float} time in ms based on seekerPosition.
     */
    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }

    /**
     * Seek to a time in the video.
     *
     * @param {float} time time to seek to in ms
     */
    seekTo( time = 0 ) {
        let state = this.state;
        state.currentTime = time;
        this.player.ref.seek( time );
        this.setState( state );
    }

    /**
     * Set the position of the volume slider
     *
     * @param {float} position position of the volume handle in px
     */
    setVolumePosition( position = 0 ) {
        let state = this.state;
        position = this.constrainToVolumeMinMax( position );
        state.volumePosition = position + this.player.iconOffset;
        state.volumeFillWidth = position;

        state.volumeTrackWidth = this.player.volumeWidth - state.volumeFillWidth;

        if ( state.volumeFillWidth < 0 ) {
            state.volumeFillWidth = 0;
        }

        if ( state.volumeTrackWidth > 150 ) {
            state.volumeTrackWidth = 150;
        }

        this.setState( state );
    }

    /**
     * Constrain the volume bar to the min/max of
     * its track's width.
     *
     * @param {float} val position of the volume handle in px
     * @return {float} contrained position of the volume handle in px
     */
    constrainToVolumeMinMax( val = 0 ) {
        if ( val <= 0 ) {
            return 0;
        }
        else if ( val >= this.player.volumeWidth + 9 ) {
            return this.player.volumeWidth + 9;
        }
        return val;
    }

    /**
     * Get the volume based on the position of the
     * volume object.
     *
     * @return {float} volume level based on volume handle position
     */
    calculateVolumeFromVolumePosition() {
        return this.state.volumePosition / this.player.volumeWidth;
    }

    /**
     * Get the position of the volume handle based
     * on the volume
     *
     * @return {float} volume handle position in px based on volume
     */
    calculateVolumePositionFromVolume() {
        return this.player.volumeWidth * this.state.volume;
    }



    /**
     | -------------------------------------------------------
     | React Component functions
     | -------------------------------------------------------
     |
     | Here we're initializing our listeners and getting
     | the component ready using the built-in React
     | Component methods
     |
     */

    handleBackButton = () => {
        this._onBack(true);
        return true;
    };

    /**
     * Before mounting, init our seekbar and volume bar
     * pan responders.
     */
    UNSAFE_componentWillMount() {
        this.initSeekPanResponder();
        this.initVolumePanResponder();
    }

    /**
     * To allow basic playback management from the outside
     * we have to handle possible props changes to state changes
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log('UNSAFE_componentWillReceiveProps()')

        if ( this.state.paused !== nextProps.paused ) {
            //console.log('   > this.state.paused(' + this.state.paused + ') !== nextProps.paused(' + nextProps.paused + ')')
            //this.setState({
            //    paused: nextProps.paused
            //})
        } else {
            //console.log('   > this.state.paused(' + this.state.paused + ') == nextProps.paused(' + nextProps.paused + ')')
        }

        if(this.styles.videoStyle !== nextProps.videoStyle){
            this.styles.videoStyle = nextProps.videoStyle;
        }

        if(this.styles.containerStyle !== nextProps.style){
            this.styles.containerStyle = nextProps.style;
        }
    }

    /**
     * Upon mounting, calculate the position of the volume
     * bar based on the volume property supplied to it.
     */
    componentDidMount() {
        const position = this.calculateVolumePositionFromVolume();
        let state = this.state;
        this.setVolumePosition( position );
        state.volumeOffset = position;
        this.mounted = true;

        this.setState( state );

        Orientation.addOrientationListener(this._orientationDidChange);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

        /*
        // Print component dimensions to console
        this.bottomControls.measure( (fx, fy, width, height, px, py) => {
            console.log('Component width is: ' + width)
            console.log('Component height is: ' + height)
            console.log('X offset to frame: ' + fx)
            console.log('Y offset to frame: ' + fy)
            console.log('X offset to page: ' + px)
            console.log('Y offset to page: ' + py)
        })
        */
    }

    _orientationDidChange = (orientation) => {
        //console.log('_orientationDidChange');

        if (orientation === 'LANDSCAPE') {
            // do something with landscape layout

            // 1단계) 전체화면 스크롤 방지
            this.setState({
                videoWidth: SCREEN_HEIGHT
                                - (isIphoneX() ? getStatusBarHeight() : 0)
                                - (isIphoneX() ? getBottomSpace() : 0)
                                + (isIphoneX() ? 0 : 0)
                                //- (isIphoneX() ? 10 : 0) // 원인 확인 필요!!!
                , videoHeight: SCREEN_WIDTH
                                - (isIphoneX() ? getBottomSpace() : 0)
                                + (isIphoneX() ? 13 : 0) // 원인 확인 필요!!!
                //, paused: false,
            })

            StatusBar.setHidden(true)
        } else {

            if(Platform.OS === 'ios' && this.state.isFullscreen) {

            } else {
                // do something with portrait layout
                this.setState({
                    videoWidth: this.props.videoWidth,
                    videoHeight: this.props.videoHeight,
                    //paused: false,
                })
                StatusBar.setHidden(false)
            }
        }
    }

    /**
     * When the component is about to unmount kill the
     * timeout less it fire in the prev/next scene
     */
    componentWillUnmount() {
        this.mounted = false;
        this.clearControlTimeout();

        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    /**
     * Get our seekbar responder going
     */
    initSeekPanResponder() {
        console.log('initSeekPanResponder()', 'CALL')

        this.player.seekPanResponder = PanResponder.create({

            // Ask to be the responder.
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,

            //여기 이벤트 기반 로직 분석 필요

            /**
             * When we start the pan tell the machine that we're
             * seeking. This stops it from updating the seekbar
             * position in the onProgress listener.
             * Slider Thumb 클릭
             */
            onPanResponderGrant: ( evt, gestureState ) => {
                console.log('onPanResponderGrant()', 'CALL')

                let state = this.state;
                this.clearControlTimeout();
                state.seeking = true;
                this.setState( state );
            },

            /**
             * When panning, update the seekbar position, duh.
             * Slider Thumb 이동
             * TODO time >>> gestureState.dx Converting 필요
             */
            onPanResponderMove: ( evt, gestureState ) => {
                console.log('onPanResponderMove()', 'CALL')

                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition( position );

                //const time = this.calculateTimeFromSeekerPosition();
                //this.seekTo( time );
            },

            /**
             * On release we update the time and seek to it in the video.
             * If you seek to the end of the video we fire the
             * onEnd callback
             * Slider Thumb 릴리즈
             */
            onPanResponderRelease: ( evt, gestureState ) => {
                console.log('onPanResponderRelease()', 'CALL')

                //DONE ㄴㅡ (공통) 플레이어 SeekBar 끝으로 이동 시 현재 재생 위치 마지막으로 고정

                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                if ( time >= state.duration && ! state.loading ) {
                    //console.log('onPanResponderRelease()', 'CASE ONE')
                    state.paused = true;
                    state.seekerOffset = 0;
                    this.events.onEnd();
                } else {
                    //console.log('onPanResponderRelease()', 'CASE TWO')
                    this.seekTo( time );
                    this.setControlTimeout();
                    state.seeking = false;
                }
                this.setState( state );
            }
        });
    }

    /**
     * Initialize the volume pan responder.
     */
    initVolumePanResponder() {
        this.player.volumePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,
            onPanResponderGrant: ( evt, gestureState ) => {
                this.clearControlTimeout();
            },

            /**
             * Update the volume as we change the position.
             * If we go to 0 then turn on the mute prop
             * to avoid that weird static-y sound.
             */
            onPanResponderMove: ( evt, gestureState ) => {
                let state = this.state;
                const position = this.state.volumeOffset + gestureState.dx;

                this.setVolumePosition( position );
                state.volume = this.calculateVolumeFromVolumePosition();

                if ( state.volume <= 0 ) {
                    state.muted = true;
                }
                else {
                    state.muted = false;
                }

                this.setState( state );
            },

            /**
             * Update the offset...
             */
            onPanResponderRelease: ( evt, gestureState ) => {
                let state = this.state;
                state.volumeOffset = state.volumePosition;
                this.setControlTimeout();
                this.setState( state );
            }
        });
    }


    /**
     | -------------------------------------------------------
     | Rendering
     | -------------------------------------------------------
     |
     | This section contains all of our render methods.
     | In addition to the typical React render func
     | we also have all the render methods for
     | the controls.
     |
     */

    /**
     * Standard render control function that handles
     * everything except the sliders. Adds a
     * consistent <TouchableHighlight>
     * wrapper and styling.
     */
    renderControl( children, callback, style = {} ) {
        return (
            <TouchableHighlight
                underlayColor="transparent"
                activeOpacity={ 0.3 }
                onPress={()=>{
                    this.resetControlTimeout();
                    callback();
                }}
                style={[
                    styles.controls.control,
                    style
                ]}
            >
                { children }
            </TouchableHighlight>
        );
    }

    /**
     * Renders an empty control, used to disable a control without breaking the view layout.
     */
    renderNullControl() {
        return (
            <View style={[ styles.controls.control ]} />
        );
    }

    /**
     * Groups the top bar controls together in an animated
     * view and spaces them out.
     * volumeControl은 기획안에 포함되어 있지 않은 관계로 임시 주석 처리
     */
    renderTopControls() {

        const backControl = this.props.disableBack ? this.renderNullControl() : this.renderBack();
        const volumeControl = this.props.disableVolume ? this.renderNullControl() : this.renderVolume();
        //const titleControl = this.props.disableTitle ? this.renderNullControl() : this.render
        const fullscreenControl = this.props.disableFullscreen ? this.renderNullControl() : this.renderFullscreen();

        return(
            <Animated.View style={[
                styles.controls.top,
                {
                    opacity: this.animations.topControl.opacity,
                    marginTop: this.animations.topControl.marginTop,
                }
            ]}>
                <ImageBackground
                    //source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/top-vignette.png' }}
                    style={[ styles.controls.column ]}
                    imageStyle={[ styles.controls.vignette ]}>
                    {/*
                    <SafeAreaView style={styles.controls.topControlGroup}>
                        {backControl}
                        <View style={styles.controls.pullRight}>
                            {volumeControl}
                            {fullscreenControl}
                        </View>
                    </SafeAreaView>
                    */}
                    <View style={styles.controls.topControlGroup}>
                        {backControl}
                        {this.renderTopTitle()}
                        {fullscreenControl}
                    </View>
                </ImageBackground>
            </Animated.View>
        );
    }

    /**
     * Back button control
     */
    renderBack() {

        return this.renderControl(
            <Image
                //source={{ uri: 'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/back.png' }}
                source={ require('../../assets/icons/btn_back_page.png') }
                style={ styles.controls.back }
            />,
            this.events.onBack,
            styles.controls.back
        );
    }

    /**
     * Render the volume slider and attach the pan handlers
     */
    renderVolume() {

        return (
            <View style={ styles.volume.container }>
                <View style={[
                    styles.volume.fill,
                    { width: this.state.volumeFillWidth }
                ]}/>
                <View style={[
                    styles.volume.track,
                    { width: this.state.volumeTrackWidth }
                ]}/>
                <View
                    style={[
                        styles.volume.handle,
                        { left: this.state.volumePosition }
                    ]}
                    { ...this.player.volumePanResponder.panHandlers }
                >
                    <Image
                        style={ styles.volume.icon }
                        source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/volume.png' }} />
                </View>
            </View>
        );
    }

    /**
     * Render fullscreen toggle and set icon based on the fullscreen state.
     */
    renderFullscreen() {
        /*
        let source = this.state.isFullscreen === true
                ? { uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/shrink.png' }
                : { uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/expand.png' }
        */
        let source = this.state.isFullscreen === true
            ? require('../../assets/icons/btn_video_min.png')
            : require('../../assets/icons/btn_video_full.png')
        return this.renderControl(
            <Image
                style={styles.controls.resize}
                source={ source } />,
            this.methods.toggleFullscreen,
            styles.controls.fullscreen
        );
    }

    /**
     * Render center control group and wrap it in a holder
     */
    renderCenterControls() {

        const playBackControl = this.props.disablePlayBack ? this.renderNullControl() : this.renderPlayBack();
        const playVideoPrevControl = this.props.disablePlayVideoPrev ? this.renderNullControl() : this.renderPlayVideoPrev();
        const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
        const playVideoNextControl = this.props.disablePlayVideoNext ? this.renderNullControl() : this.renderPlayVideoNext();
        const playFrontControl = this.props.disablePlayFront ? this.renderNullControl() : this.renderPlayFront();

        return(
            <Animated.View style={[
                    this.state.isFullscreen ? styles.controls.center : styles.controls.centerFullscreen,
                    {
                        opacity: this.animations.centerControl.opacity,
                        marginBottom: this.animations.centerControl.marginBottom,
                    }
                ]}>
                {
                    this.state.isFullscreen
                        ?
                            <View style={styles.controls.centerControlGroupFullscreen}>
                            </View>
                        :
                            <View style={styles.controls.centerControlGroup}>
                                {playBackControl}
                                <View style={styles.controls.centerControlGroupCenter}>
                                    {playVideoPrevControl}
                                    {playPauseControl}
                                    {playVideoNextControl}
                                </View>
                                {playFrontControl}
                            </View>
                }
            </Animated.View>
        )
    }

    onLayoutBottomControls = (event) => {
        /*
        onLayout={evt => {
        let width = evt.nativeEvent.layout.width;
        let height = evt.nativeEvent.layout.height;
        this._runAfterMeasurements(width, height);
         */

        /*
        console.log('height:', layout.height);
        console.log('width:', layout.width);
        console.log('x:', layout.x);
        console.log('y:', layout.y);
        */
        const layout = event.nativeEvent.layout;
        this.setState({
            previewBottom: layout.height
        });
    }

    /**
     * Render bottom control group and wrap it in a holder
     * volumeControl은 디자인 시안에 포함되어 있지 않은 관계로 renderCenterControls로 이동 및 임시 주석 처리
     * playPauseControl은 디자인 시안에 따라서 renderCenterControls로 이동
     * ImageBackground가 불필요한 관계로 제거
     */
    renderBottomControls() {

        const timerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTimer();
        const seekbarControl = this.props.disableSeekbar ? this.renderNullControl() : this.renderSeekbar();
        const totalTimerControl = this.props.disableTimer ? this.renderNullControl() : this.renderTotalTimer();

        const playBackControl = this.props.disablePlayBack ? this.renderNullControl() : this.renderPlayBack();
        const playVideoPrevControl = this.props.disablePlayVideoPrev ? this.renderNullControl() : this.renderPlayVideoPrev();
        const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
        const playVideoNextControl = this.props.disablePlayVideoNext ? this.renderNullControl() : this.renderPlayVideoNext();
        const playFrontControl = this.props.disablePlayFront ? this.renderNullControl() : this.renderPlayFront();

        return(
            <Animated.View style={[
                    this.state.isFullscreen ? styles.controls.bottomFullscreen : styles.controls.bottom,
                    {
                        opacity: this.animations.bottomControl.opacity,
                        marginBottom: this.animations.bottomControl.marginBottom,
                    }
                ]}
                onLayout={( evt ) => this.onLayoutBottomControls(evt)}
                ref={(ref) => this.bottomControls = ref}>
                {/*
                <ImageBackground
                    source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/bottom-vignette.png' }}
                    style={[ styles.controls.column ]}
                    imageStyle={[ styles.controls.vignette ]}>
                    { seekbarControl }
                    <SafeAreaView
                        style={[styles.controls.row, styles.controls.bottomControlGroup]}>
                        {playPauseControl}
                        {this.renderBottomTitle()}
                        {timerControl}
                    </SafeAreaView>
                </ImageBackground>
                */}

                {/*
                <ImageBackground
                    source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/bottom-vignette.png' }}
                    style={[ styles.controls.column ]}
                    imageStyle={[ styles.controls.vignette ]}>
                    { seekbarControl }
                    <SafeAreaView
                        style={[styles.controls.row, styles.controls.bottomControlGroup]}>
                        {timerControl}
                    </SafeAreaView>
                </ImageBackground>
                */}

                {
                    this.state.isFullscreen
                        &&
                            <View style={{
                                flexDirection: 'row',
                                alignItem: 'center',
                            }}>
                                { timerControl }
                                { seekbarControl }
                                { totalTimerControl }
                            </View>
                        ||
                            <View style={styles.controls.bottomControlGroup}>
                                { timerControl }
                                { seekbarControl }
                                { totalTimerControl }
                            </View>
                }
                {   //쪼기
                    // centerControlGroup > bottomControlGroup
                    // centerControlGroupCenter > bottomControlGroupCenter
                    this.state.isFullscreen
                        &&
                            <View style={[
                                        styles.controls.bottomControlGroupFullscreen,
                                        {marginBottom: 20, padding: 0}
                                    ]}>
                                {playBackControl}
                                <View style={styles.controls.bottomControlGroupCenter}>
                                    {playVideoPrevControl}
                                    {playPauseControl}
                                    {playVideoNextControl}
                                </View>
                                {playFrontControl}
                            </View>
                }
            </Animated.View>
        );
    }

    /**
     * Render the seekbar and attach its handlers
     */
    renderSeekbar() {

        return (
            <View style={
                this.state.isFullscreen
                    ? styles.seekbar.containerFullscreen
                    : styles.seekbar.container
            }>
                <View
                    style={ styles.seekbar.track }
                    onLayout={ event => this.player.seekerWidth = event.nativeEvent.layout.width }
                >
                    <View style={[
                        styles.seekbar.fill,
                        {
                            width: this.state.seekerFillWidth,
                            backgroundColor: this.props.seekBarFillColor || '#FFF'
                        }
                    ]}/>
                </View>
                <View
                    style={[
                        this.state.isFullscreen
                            ? styles.seekbar.handleFullscreen
                            : styles.seekbar.handle,
                        { left: this.state.seekerPosition }
                    ]}
                    { ...this.player.seekPanResponder.panHandlers }
                >
                    <View style={[
                        styles.seekbar.circle,
                        { backgroundColor: this.props.seekBarCircleColor || '#FFF' } ]}
                    />
                </View>
            </View>
        );
    }

    /**
     * Render the play back 15 seconds button and show the respective icon
     */
    renderPlayBack() {
        return this.renderControl(
            <Image
                style={styles.controls.playBackIcon}
                source={ require('../../assets/icons/btn_video_back_15_s.png') } />,
            this.methods.playBack,
            this.state.isFullscreen ? styles.controls.playBackFullscreen : styles.controls.playBack
        );
    }

    /**
     * Render the play prev video button and show the respective icon
     */
    renderPlayVideoPrev() {
        return this.renderControl(
            <Image
                style={styles.controls.playVideoPrevIcon}
                source={ require('../../assets/icons/btn_video_prev.png') } />,
            this.methods.playVideoPrev,
            this.state.isFullscreen ? styles.controls.playVideoPrevFullscreen : styles.controls.playVideoPrev
        );
    }

    /**
     * Render the play/pause button and show the respective icon
     */
    renderPlayPause() {
        /*
        let source = this.state.paused === true
                ? { uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/play.png' }
                : { uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/pause.png' }
        */
        let source = this.state.paused === true
            ? require('../../assets/icons/btn_video_play.png')
            : require('../../assets/icons/btn_video_pause.png')
        return this.renderControl(
            <Image
                style={styles.controls.playPauseButton}
                source={ source } />,
            this.methods.togglePlayPause,
            this.state.isFullscreen ? styles.controls.playPauseFullscreen : styles.controls.playPause
        );
    }

    /**
     * Render the play next video button and show the respective icon
     */
    renderPlayVideoNext() {
        return this.renderControl(
            <Image
                style={styles.controls.playVideoNextIcon}
                source={ require('../../assets/icons/btn_video_next.png') } />,
            this.methods.playVideoNext,
            this.state.isFullscreen ? styles.controls.playVideoNextFullscreen : styles.controls.playVideoNext
        );
    }

    /**
     * Render the play front 15 seconds button and show the respective icon
     */
    renderPlayFront() {
        return this.renderControl(
            <Image
                style={styles.controls.playFrontIcon}
                source={ require('../../assets/icons/btn_video_next_15_s.png') } />,
            this.methods.playFront,
            this.state.isFullscreen ? styles.controls.playFrontFullscreen : styles.controls.playFront
        );
    }

    /**
     * Render our title...if supplied.
     */
    renderTopTitle() {

        if ( this.opts.title && this.state.isFullscreen ) {
            return (
                <View style={[
                    styles.controls.control,
                    styles.controls.title
                ]}>
                    <CustomTextR style={[
                        styles.controls.text,
                        styles.controls.titleText
                    ]} numberOfLines={ 1 }>
                        { this.opts.title || '' }
                    </CustomTextR>
                </View>
            );
        }

        return null;
    }

    /**
     * Render our title...if supplied.
     */
    renderBottomTitle() {

        if ( this.opts.title ) {
            return (
                <View style={[
                    styles.controls.control,
                    styles.controls.title,
                ]}>
                    <Text style={[
                        styles.controls.text,
                        styles.controls.titleText
                    ]} numberOfLines={ 1 }>
                        { this.opts.title || '' }
                    </Text>
                </View>
            );
        }

        return null;
    }

    /**
     * Show our timer. (Progress)
     */
    renderTimer() {

        return this.renderControl(
            <TextRobotoR style={
                this.state.isFullscreen
                    ? styles.controls.timerTextFullscreen
                    : styles.controls.timerText
            }>
                { this.calculateTime() }
            </TextRobotoR>,
            this.methods.toggleTimer,
            this.state.isFullscreen ? styles.controls.timerFullscreen : styles.controls.timer
        );
    }

    /**
     * Show our timer. (Total)
     */
    renderTotalTimer() {

        return this.renderControl(
            <CustomTextB style={
                this.state.isFullscreen
                    ? styles.controls.totalTimerTextFullscreen
                    : styles.controls.totalTimerText
            }>
                { this.calculateTotalTime() }
            </CustomTextB>,
            this.methods.toggleTimer,
            this.state.isFullscreen ? styles.controls.totalTimerFullscreen : styles.controls.totalTimer
        );
    }

    /**
     * Show loading icon
     */
    renderLoader() {
        if ( this.state.loading ) {
            return (
                <View style={ styles.loader.container }>
                    <Animated.Image
                        //source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/loader-icon.png' }}
                        source={ require('../../assets/icons/loader-icon.png') }
                        style={[
                            styles.loader.icon,
                            {
                                transform: [
                                    { rotate: this.animations.loader.rotate.interpolate({
                                        inputRange: [ 0, 360 ],
                                        outputRange: [ '0deg', '360deg' ]
                                    })}
                                ]
                            }
                        ]} />
                </View>
            );
        }
        return null;
    }

    renderError() {
        if ( this.state.error ) {
            return (
                <View style={ styles.error.container }>
                    <Image source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/error-icon.png' }} style={ styles.error.icon } />
                    <Text style={ styles.error.text }>
                        Video unavailable
                    </Text>
                </View>
            );
        }
        return null;
    }

    /**
     * Provide all of our options and render the whole component.
     */
    render() {
        return (
            <TouchableWithoutFeedback
                onPress={ this.events.onScreenTouch }
                style={[
                    styles.player.container,
                    this.styles.containerStyle,
                    {
                        width: this.state.videoWidth,
                        height: this.state.videoHeight,
                    }
                ]}>
                <View style={[
                    styles.player.container,
                    this.styles.containerStyle,
                    {
                        width: this.state.isFullscreen
                            ? this.state.videoWidth
                                - (isIphoneX() ? getStatusBarHeight() : 0)
                                - (isIphoneX() ? getBottomSpace() : 0)
                                - (isIphoneX() ? ( getStatusBarHeight() + getBottomSpace()) / 2 : 0)
                            : this.state.videoWidth
                        , height: this.state.videoHeight,
                    }
                ]}>
                    <Video
                        { ...this.props }
                        ref={ videoPlayer => this.player.ref = videoPlayer }

                        resizeMode={ this.state.resizeMode }
                        volume={ this.state.volume }
                        paused={ this.state.paused }
                        muted={ this.state.muted }
                        rate={ this.state.rate }
                        poster={ this.props.poster }
                        posterResizeMode={ this.props.posterResizeMode }

                        onLoadStart={ this.events.onLoadStart }
                        onProgress={ this.events.onProgress }
                        onError={ this.events.onError }
                        onLoad={ this.events.onLoad }
                        onEnd={ this.events.onEnd }

                        style={[ styles.player.video, this.styles.videoStyle ]}

                        source={ this.props.source }
                    />
                    { this.renderError() }
                    { this.state.loading || this.renderTopControls() }
                    { this.renderLoader() }
                    { this.state.loading || this.renderCenterControls() }
                    { this.state.loading || this.renderBottomControls() }

                    {/*
                    <View style={[
                            styles.preview.container,
                            {
                                width: this.state.previewWidth,
                                height: this.state.previewHeight,
                                bottom: this.state.previewBottom,
                            }
                        ]}>

                        <Image
                            style={styles.preview.content}
                            source={this.state.previewImage} />
                    </View>
                    */}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

/**
 * This object houses our styles. There's player
 * specific styles and control specific ones.
 * And then there's volume/seeker styles.
 */
const styles = {
    player: StyleSheet.create({
        container: {
            backgroundColor: '#000',
            flex: 1,
            //alignSelf: 'stretch',
            alignSelf: 'center',
            justifyContent: 'space-between',
        },
        video: {
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    }),
    error: StyleSheet.create({
        container: {
            backgroundColor: 'rgba( 0, 0, 0, 0.5 )',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            marginBottom: 16,
        },
        text: {
            backgroundColor: 'transparent',
            color: '#f27474'
        },
    }),
    loader: StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000bb',
        },
    }),
    controls: StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: null,
            width: null,
        },
        column: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: null,
            width: null,
        },
        vignette: {
            resizeMode: 'stretch'
        },
        control: {
            padding: 16,
        },
        text: {
            backgroundColor: 'transparent',
            color: '#FFF',
            textAlign: 'center',
        },
        pullRight: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        top: {
            flex: 2,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            backgroundColor: '#000000bb',
            //backgroundColor: '#FF0000bb',
        },
        center: {
            flex: 6,
            //flexDirection: 'row',
            //alignItems: 'stretch',
            //justifyContent: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#000000bb',
            //backgroundColor: '#00FF00bb',
        },
        centerFullscreen: {
            flex: 4,
            //flexDirection: 'row',
            //alignItems: 'stretch',
            //justifyContent: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#000000bb',
            //backgroundColor: '#00FF00bb',
        },
        bottom: {
            flex: 1,
            //flexDirection: 'row',
            //alignItems: 'stretch',
            alignItems: 'center',
            //justifyContent: 'flex-end',
            justifyContent: 'center',
            backgroundColor: '#000000bb',
            //backgroundColor: '#0000FFbb',
        },
        bottomFullscreen: {
            flex: 2,
            //flexDirection: 'row',
            //alignItems: 'stretch',
            //alignItems: 'center',
            //justifyContent: 'flex-end',
            justifyContent: 'center',
            backgroundColor: '#000000bb',
            //backgroundColor: '#0000FFbb',
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: null,
            //margin: 12,
            //marginBottom: 18,
        },
        centerControlGroup: {
            //alignSelf: 'stretch',
            alignItems: 'center',
            //justifyContent: 'space-between',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        centerControlGroupFullscreen: {
            //alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        centerControlGroupCenter: {
            //alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        bottomControlGroup: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            //alignSelf: 'stretch',
            //alignItems: 'center',
            //justifyContent: 'space-between',
            //marginLeft: 12,
            //marginRight: 12,
            //marginBottom: 0,
        },
        bottomControlGroupFullscreen: {
            flexDirection: 'row',
            //justifyContent: 'space-between',
            justifyContent: 'center',
            alignItems: 'center',
            //alignSelf: 'stretch',
            //alignItems: 'center',
            //justifyContent: 'space-between',
            //marginLeft: 12,
            //marginRight: 12,
            //marginBottom: 0,
        },
        bottomControlGroupCenter: {
            flex: 7,
            //alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
        },
        volume: {
            flexDirection: 'row',
        },
        fullscreen: {
            flexDirection: 'row',
            alignSelf: 'center',
        },
        playPause: {
            position: 'relative',
            width: 80,
            zIndex: 0
        },
        playPauseFullscreen: {
            position: 'relative',
            //width: 80,
            zIndex: 0,
            padding: 0,
            paddingLeft: 38,
            paddingRight: 38,
        },
        title: {
            //alignItems: 'center',
            flex: 0.6,
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 0,
        },
        titleText: {
            textAlign: 'center',
            //alignSelf: 'center',
            color: DEFAULT_COLOR.base_color_fff,
            fontSize: PixelRatio.roundToNearestPixel(16),
            lineHeight: 16 * 1.42,
        },
        timer: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
        },
        timerFullscreen: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 0,
        },
        timerText: {
            backgroundColor: 'transparent',
            color: DEFAULT_COLOR.lecture_sub,
            fontSize: PixelRatio.roundToNearestPixel(11),
            lineHeight: 11 * 1.42,
            textAlign: 'center',
        },
        timerTextFullscreen: {
            backgroundColor: 'transparent',
            color: DEFAULT_COLOR.lecture_sub,
            textAlign: 'center',
            fontSize: PixelRatio.roundToNearestPixel(11),
            lineHeight: 11 * 1.42,
        },
        totalTimer: {
            //width: 80,
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            //backgroundColor: '#FF0000bb',
        },
        totalTimerFullscreen: {
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: 0,
        },
        totalTimerText: {
            backgroundColor: 'transparent',
            color: DEFAULT_COLOR.base_color_fff,
            fontSize: PixelRatio.roundToNearestPixel(11),
            lineHeight: 11 * 1.42,
            textAlign: 'center',
        },
        totalTimerTextFullscreen: {
            backgroundColor: 'transparent',
            color: DEFAULT_COLOR.base_color_fff,
            fontSize: PixelRatio.roundToNearestPixel(11),
            lineHeight: 11 * 1.42,
            textAlign: 'center',
        },
        back: {
            width: 17,
            height: 17,
            //alignSelf: 'center',
            flexDirection: 'row',
            alignSelf: 'center',
        },
        resize: {
            width: 17,
            height: 17,
        },
        playBack: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
            flex: 2,
            alignItems: 'center',
            //backgroundColor: '#00FF00bb',
        },
        playBackFullscreen: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
            flex: 2,
            alignItems: 'center',
            //backgroundColor: '#00FF00bb',
            padding: 0,
        },
        playBackIcon: {
            width: 35,
            height: 35,

        },
        playVideoPrev: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
        },
        playVideoPrevFullscreen: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
            padding: 0,
        },
        playVideoPrevIcon: {
            width: 35,
            height: 35,
        },
        playPauseButton: {
            width: 50,
            height: 50,
        },
        playVideoNext: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
        },
        playVideoNextFullscreen: {
            //position: 'relative',
            //width: 80,
            //zIndex: 0
            padding: 0,
        },
        playVideoNextIcon: {
            width: 35,
            height: 35,
        },
        playFront: {
            flex: 2,
            //backgroundColor: '#00FF00bb',
            alignItems: 'center',
            //position: 'relative',
            //width: 80,
            //zIndex: 0
        },
        playFrontFullscreen: {
            flex: 2,
            //backgroundColor: '#00FF00bb',
            alignItems: 'center',
            //position: 'relative',
            //width: 80,
            //zIndex: 0
            padding: 0,
        },
        playFrontIcon: {
            width: 35,
            height: 35,
        },
    }),
    volume: StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            height: 1,
            marginLeft: 20,
            marginRight: 20,
            width: 150,
            backgroundColor: '#00FF00',
        },
        track: {
            backgroundColor: '#333',
            height: 1,
            marginLeft: 7,
        },
        fill: {
            backgroundColor: '#FFF',
            height: 1,
        },
        handle: {
            position: 'absolute',
            marginTop: -24,
            marginLeft: -24,
            padding: 16,
        },
        icon: {
            marginLeft:7
        }
    }),
    seekbar: StyleSheet.create({
        container: {
            flex: 7,
            justifyContent: 'center',
            //alignSelf: 'stretch',
            height: 28,
            //marginLeft: 20,
            //marginRight: 20
            //backgroundColor: '#FF0000bb',
        },
        containerFullscreen: {
            flex: 7,
            justifyContent: 'flex-end',
            padding: 0,
            paddingBottom: 5,
            //height: 28,
        },
        track: {
            //backgroundColor: '#333',
            backgroundColor: DEFAULT_COLOR.base_color_000,
            //height: 1,
            height: 3,
            //position: 'relative',
            //top: 14,
            width: '100%'
        },

        fill: {
            backgroundColor: '#FFF',
            //height: 1,
            height: 3,
            width: '100%'
        },
        handle: {
            position: 'absolute',
            marginLeft: -7,
            height: 28,
            width: 28,
            justifyContent: 'center',
        },
        handleFullscreen: {
            position: 'absolute',
            marginLeft: -7,
            height: 28,
            width: 28,
            justifyContent: 'flex-end',
            //paddingBottom: 5,
            zIndex: 4,
        },
        circle: {
            borderRadius: 12,
            //position: 'relative',
            //top: 8,
            //left: 8,
            //height: 12,
            height: 14,
            //width: 12,
            width: 14,
        },
    }),
    preview: StyleSheet.create({
        container: {
            position: 'absolute',
            backgroundColor: DEFAULT_COLOR.base_color_000,
            borderWidth: 1,
            borderColor: DEFAULT_COLOR.base_color_fff,
        },
        content: {
            width: '100%',
            height: '100%',
        }
    })
};
