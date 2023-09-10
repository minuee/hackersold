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

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

export default class SampleVideoScreen extends Component {

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
            previewImage: require('../../../assets/images/alien.jpg'),
            isPreview: false,
            poster: this.props.poster,
            posterResizeMode: this.props.posterResizeMode,

            isFullscreen: this.props.screenState.isFullScreen || this.props.resizeMode === 'cover' || false,
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
            currentTime: this.props.screenState.globalCurrentTime,
            error: false,
            duration: 0,
            fromHistory : this.props.screenState.fromHistory
        };

    
        this.opts = {
            playWhenInactive: this.props.playWhenInactive,
            playInBackground: this.props.playInBackground,
            repeat: this.props.repeat,
            title: this.props.title,
        };

    
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

    
        this.player = {
            controlTimeoutDelay: this.props.controlTimeout || 15000,
            volumePanResponder: PanResponder,
            seekPanResponder: PanResponder,
            controlTimeout: null,
            volumeWidth: 150,
            iconOffset: 0,
            seekerWidth: 0,
            ref: Video,
        };

    
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

    
        this.styles = {
            videoStyle: this.props.videoStyle || {},
            containerStyle: this.props.style || {}
        };

     
    }


    _onLoadStart() {

        let state = this.state;
        state.loading = true;
        this.loadAnimation();
        this.setState( state );

        if ( typeof this.props.onLoadStart === 'function' ) {
            this.props.onLoadStart(...arguments);
        }
    }

    _onLoad( data = {} ) {
        //console.log('_onLoad', this.props.screenState.globalCurrentTime)
        let state = this.state;

        state.duration = data.duration;
        state.currentTime = this.props.screenState.globalCurrentTime;
        this.player.ref.seek( this.props.screenState.globalCurrentTime );
        state.loading = false;
        this.setState( state );

        if ( state.showControls ) {
            this.setControlTimeout();
        }

        if ( typeof this.props.onLoad === 'function' ) {
            this.props.onLoad(...arguments);
        }
    }


    _onProgress( data = {} ) {

        let state = this.state;
        state.currentTime = data.currentTime;

        this.props.screenState.setSeekerPosition(data.currentTime)

        if ( ! state.seeking ) {
            const position = this.calculateSeekerPosition();
            this.setSeekerPosition( position );
        }

        if ( typeof this.props.onProgress === 'function' ) {
            this.props.onProgress(...arguments);
        }

        this.setState( state );
    }


    _onEnd() {
        //console.log('_onEnd()')
        this.setSeekerPosition();
        this.seekTo();
        this.setState({
            paused: true,
        })
    }

    _onError( err ) {
        //console.log('_onError()')
        //console.log('   > err ' + err)
        let state = this.state;
        state.error = true;
        state.loading = false;

        this.setState( state );
    }

    _onScreenTouch(e) {
        let state = this.state;
        const time = new Date().getTime();
        const delta =  time - state.lastScreenPress;

        if ( delta < 300 ) {
            this.methods.toggleFullscreen();
        }

        this.methods.toggleControls();
        state.lastScreenPress = time;

        this.setState( state );
    }

    setControlTimeout() {
        this.player.controlTimeout = setTimeout( ()=> {
            this._hideControls();
        }, this.player.controlTimeoutDelay );
    }

    clearControlTimeout() {
        clearTimeout( this.player.controlTimeout );
    }


    resetControlTimeout() {
        this.clearControlTimeout();
        this.setControlTimeout();
    }

    hideControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 0 }
            ),
     
            Animated.timing(
                this.animations.centerControl.opacity,
                { toValue: 0 }
            ),
    
            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 0 }
            ),
   
        ]).start();
    }

    showControlAnimation() {
        Animated.parallel([
            Animated.timing(
                this.animations.topControl.opacity,
                { toValue: 1 }
            ),
   
            Animated.timing(
                this.animations.centerControl.opacity,
                { toValue: 1 }
            ),

            Animated.timing(
                this.animations.bottomControl.opacity,
                { toValue: 1 }
            ),
        ]).start();
    }

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

    _hideControls() {
        if(this.mounted) {
            let state = this.state;
            state.showControls = false;
            this.hideControlAnimation();

            this.setState( state );
        }
    }

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

    _toggleFullscreen() {
        let state = this.state;
        //console.log('toggle : ', this.props.screenState.globalCurrentTime)
        state.isFullscreen = ! this.props.screenState.isFullscreen;
        state.currentTime = this.props.screenState.globalCurrentTime;
        state.isFullscreen
            ? Orientation.lockToLandscapeLeft()
            : Orientation.lockToPortrait();


        if (this.props.toggleResizeModeOnFullscreen) {
            state.resizeMode = state.isFullscreen === true ? 'cover' : 'contain';
        }
        this.seekTo( this.props.screenState.globalCurrentTime );
        this.setState( state );

        if (state.isFullscreen) {
            typeof this.events.onEnterFullscreen === 'function' && this.events.onEnterFullscreen();
        }
        else {
            typeof this.events.onExitFullscreen === 'function' && this.events.onExitFullscreen();
        }
        
    }

    calculateSeekerPositionFromTime= (time) => {
        return ( time * this.player.seekerWidth ) / this.state.duration;
    }

    _playBack() {
        if(this.state.showControls) {

            this.clearControlTimeout();
            this.setState({ seeking: true })

            const position = this.state.seekerOffset - this.calculateSeekerPositionFromTime(15);
            this.setSeekerPosition( position );

            const time = this.calculateTimeFromSeekerPosition();
            this.seekTo( time );
            this.setState({ seeking: false })
        } else {
            this.events.onScreenTouch()
        }
    }

    _playVideoPrev() {
        if(this.state.showControls) {
            this.props.moveLectureItem(false)
        } else {
            this.events.onScreenTouch()
        }
    }

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

    _playVideoNext() {
        if(this.state.showControls) {
            this.props.moveLectureItem(true)
        } else {
            this.events.onScreenTouch()
        }
    }

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

    _toggleTimer() {
        if(this.state.showControls) {

        } else {
            this.events.onScreenTouch()
        }
    }


    _onBack(isHardware = false) {     
        console.log('this.state.isDrawerOpen',this.props.screenState.fromHistory)   
        if(!isHardware) {            
            if(!this.props.screenState.isFullscreen) {                
                if (this.state.showControls) {                    
                    Orientation.lockToPortrait();
                    if ( this.state.fromHistory ) {
                        this.props.navigation.goBack();
                        this.props.navigation.toggleDrawer()
                    }else{
                        this.props.navigation.goBack();                        
                    }
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
            
            if (this.props.screenState.isFullscreen) {                
                this._toggleFullscreen();
            } else {     
                if ( this.state.fromHistory ) {
                    this.props.navigation.goBack();
                    this.props.navigation.toggleDrawer()
                    
                }else{
                    this.props.navigation.goBack();
                }
                
            }
        }
    }

    calculateTime() {
        if ( this.state.showTimeRemaining ) {
            const time = this.state.duration - this.state.currentTime;
            return `-${ this.formatTime( time ) }`;
        }

        return this.formatTime( this.state.currentTime );
    }

    calculateTotalTime() {
        return this.formatTime( this.state.duration );
    }

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

    constrainToSeekerMinMax( val = 0 ) {
        if ( val <= 0 ) {
            return 0;
        }
        else if ( val >= this.player.seekerWidth ) {
            return this.player.seekerWidth;
        }
        return val;
    }

    calculateSeekerPosition() {
        const percent = this.state.currentTime / this.state.duration;
        return this.player.seekerWidth * percent;
    }

    calculateTimeFromSeekerPosition() {
        const percent = this.state.seekerPosition / this.player.seekerWidth;
        return this.state.duration * percent;
    }

    seekTo( time = 0 ) {
        let state = this.state;
        state.currentTime = time;
        this.player.ref.seek( time );
        this.setState( state );
    }


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

    constrainToVolumeMinMax( val = 0 ) {
        if ( val <= 0 ) {
            return 0;
        }
        else if ( val >= this.player.volumeWidth + 9 ) {
            return this.player.volumeWidth + 9;
        }
        return val;
    }

    calculateVolumeFromVolumePosition() {
        return this.state.volumePosition / this.player.volumeWidth;
    }

    calculateVolumePositionFromVolume() {
        return this.player.volumeWidth * this.state.volume;
    }

    handleBackButton = () => {
        this._onBack(true);
        return true;
    };

    UNSAFE_componentWillMount() {
        
        this.initSeekPanResponder();
        this.initVolumePanResponder();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ( this.state.paused !== nextProps.paused ) {
      
        } else {
           
        }

        if(this.styles.videoStyle !== nextProps.videoStyle){
            this.styles.videoStyle = nextProps.videoStyle;
        }

        if(this.styles.containerStyle !== nextProps.style){
            this.styles.containerStyle = nextProps.style;
        }
    }
    componentDidMount() {
        const position = this.calculateVolumePositionFromVolume();
        let state = this.state;
        this.setVolumePosition( position );
        state.volumeOffset = position;
        this.mounted = true;

        this.setState( state );

        Orientation.addOrientationListener(this._orientationDidChange);

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    }

    _orientationDidChange = (orientation) => {
        //console.log('_orientationDidChange', this.state.paused);
        let thisPause = this.state.paused;
        if (orientation === 'LANDSCAPE') {
            //console.log('LANDSCAPE', this.state.paused);
            this.setState({
                videoWidth: SCREEN_HEIGHT
                                - (isIphoneX() ? getStatusBarHeight() : 0)
                                - (isIphoneX() ? getBottomSpace() : 0)
                                + (isIphoneX() ? 0 : 0)
                                //- (isIphoneX() ? 10 : 0) // 원인 확인 필요!!!
                , videoHeight: SCREEN_WIDTH
                                - (isIphoneX() ? getBottomSpace() : 0)
                                + (isIphoneX() ? 13 : 0) // 원인 확인 필요!!!
                , paused: thisPause,
            })

            StatusBar.setHidden(true)
        } else {
            //console.log('LANDSCAPE NOt', this.state.paused);
            if(Platform.OS == 'ios' && this.state.isFullscreen) {

            } else {
                // do something with portrait layout
                this.setState({
                    videoWidth: this.props.videoWidth,
                    videoHeight: this.props.videoHeight,
                    paused: thisPause,
                })
                StatusBar.setHidden(false)
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.clearControlTimeout();
        //console.log('video componentWillUnmount ');
        // Remember to remove listener
        Orientation.removeOrientationListener(this._orientationDidChange);

        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    initSeekPanResponder() {
        this.player.seekPanResponder = PanResponder.create({

            // Ask to be the responder.
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,

            onPanResponderGrant: ( evt, gestureState ) => {
                let state = this.state;
                this.clearControlTimeout();
                state.seeking = true;
                this.setState( state );
            },

            onPanResponderMove: ( evt, gestureState ) => {
                const position = this.state.seekerOffset + gestureState.dx;
                this.setSeekerPosition( position );
            },

            onPanResponderRelease: ( evt, gestureState ) => {
                const time = this.calculateTimeFromSeekerPosition();
                let state = this.state;
                if ( time >= state.duration && ! state.loading ) {
                    //state.paused = true;
                    this.events.onEnd();
                } else {
                    this.seekTo( time );
                    this.setControlTimeout();
                    state.seeking = false;
                }
                this.setState( state );
            }
        });
    }

    initVolumePanResponder() {
        this.player.volumePanResponder = PanResponder.create({
            onStartShouldSetPanResponder: ( evt, gestureState ) => true,
            onMoveShouldSetPanResponder: ( evt, gestureState ) => true,
            onPanResponderGrant: ( evt, gestureState ) => {
                this.clearControlTimeout();
            },

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

            onPanResponderRelease: ( evt, gestureState ) => {
                let state = this.state;
                state.volumeOffset = state.volumePosition;
                this.setControlTimeout();
                this.setState( state );
            }
        });
    }

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


    renderNullControl() {
        return (
            <View style={[ styles.controls.control ]} />
        );
    }

    renderTopControls(isFullScreen) {
        const backControl = this.props.disableBack ? this.renderNullControl() : this.renderBack();
        const volumeControl = this.props.disableVolume ? this.renderNullControl() : this.renderNullControl();//this.renderVolume();
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
                    style={[ styles.controls.column ]}
                    imageStyle={[ styles.controls.vignette ]}>
                    <View style={[styles.controls.topControlGroup,isFullScreen ? {paddingTop:15} : null]}>
                        {/*backControl*/}
                        {volumeControl}
                        {this.renderTopTitle()}
                        {fullscreenControl}
                    </View>
                </ImageBackground>
            </Animated.View>
        );
    }
 
    renderBack() {

        return this.renderControl(
            <Image                
                source={ require('../../../assets/icons/btn_back_page.png') }
                style={ styles.controls.back }
            />,
            this.events.onBack,
            styles.controls.back
        );
    }

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

 
    renderFullscreen() {
        let source = this.props.screenState.isFullscreen === true
            ? require('../../../assets/icons/btn_video_min.png')
            : require('../../../assets/icons/btn_video_full.png')
        return this.renderControl(
            <Image
                style={styles.controls.resize}
                source={ source } />,
            this.methods.toggleFullscreen,
            styles.controls.fullscreen
        );
    }

    renderCenterControls() {

        const playBackControl = this.props.disablePlayBack ? this.renderNullControl() : this.renderPlayBack();
        const playVideoPrevControl = this.props.disablePlayVideoPrev ? this.renderNullControl() : this.renderPlayVideoPrev();
        const playPauseControl = this.props.disablePlayPause ? this.renderNullControl() : this.renderPlayPause();
        const playVideoNextControl = this.props.disablePlayVideoNext ? this.renderNullControl() : this.renderPlayVideoNext();
        const playFrontControl = this.props.disablePlayFront ? this.renderNullControl() : this.renderPlayFront();

        return(
            <Animated.View style={[
                    this.props.screenState.isFullscreen ? styles.controls.center : styles.controls.centerFullscreen,
                    {
                        opacity: this.animations.centerControl.opacity,
                        marginBottom: this.animations.centerControl.marginBottom,
                    }
                ]}>
                {
                    this.props.screenState.isFullscreen
                        ?
                            <View style={styles.controls.centerControlGroupFullscreen}>
                            </View>
                        :
                            <View style={styles.controls.centerControlGroup}>
                                {playBackControl}
                                <View style={styles.controls.centerControlGroupCenter}>
                                    {/*playVideoPrevControl*/}
                                    {playPauseControl}
                                    {/*playVideoNextControl*/}
                                </View>
                                {playFrontControl}
                            </View>
                }
            </Animated.View>
        )
    }

    onLayoutBottomControls = (event) => {

        const layout = event.nativeEvent.layout;
        this.setState({
            previewBottom: layout.height
        });
    }

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
                this.props.screenState.isFullscreen ? styles.controls.bottomFullscreen : styles.controls.bottom,
                    {
                        opacity: this.animations.bottomControl.opacity,
                        marginBottom: this.animations.bottomControl.marginBottom,
                    }
                ]}
                onLayout={( evt ) => this.onLayoutBottomControls(evt)}
                ref={(ref) => this.bottomControls = ref}>
                <View style={this.props.screenState.isFullscreen
                                ? styles.controls.bottomControlGroupFullscreen
                                : styles.controls.bottomControlGroup}>
                    { timerControl }
                    { seekbarControl }
                    { totalTimerControl }
                </View>
                {   //쪼기          
                    this.props.screenState.isFullscreen
                        &&
                            <View style={[
                                        styles.controls.bottomControlGroupFullscreen,
                                        {paddingBottom: 40,}
                                    ]}>
                                {playBackControl}
                                <View style={styles.controls.bottomControlGroupCenter}>
                                    {/*playVideoPrevControl*/}
                                    {playPauseControl}
                                    {/*playVideoNextControl*/}
                                </View>
                                {playFrontControl}
                            </View>
                }
            </Animated.View>
        );
    }

    renderSeekbar() {

        return (
            <View style={ styles.seekbar.container }>
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
                        styles.seekbar.handle,
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

    renderPlayBack() {
        return this.renderControl(
            <Image
                style={styles.controls.playBackIcon}
                source={ require('../../../assets/icons/btn_video_back_15_s.png') } />,
            this.methods.playBack,
            styles.controls.playBack
        );
    }

    renderPlayVideoPrev() {
        return this.renderControl(
            <Image
                style={styles.controls.playVideoPrevIcon}
                source={ require('../../../assets/icons/btn_video_prev.png') } />,
            this.methods.playVideoPrev,
            styles.controls.playVideoPrev
        );
    }

    renderPlayPause() {
  
        let source = this.state.paused === true
            ? require('../../../assets/icons/btn_video_play.png')
            : require('../../../assets/icons/btn_video_pause.png')
        return this.renderControl(
            <Image
                style={styles.controls.playPauseButton}
                source={ source } />,
            this.methods.togglePlayPause,
            styles.controls.playPause
        );
    }


    renderPlayVideoNext() {
        return this.renderControl(
            <Image
                style={styles.controls.playVideoNextIcon}
                source={ require('../../../assets/icons/btn_video_next.png') } />,
            this.methods.playVideoNext,
            styles.controls.playVideoNext
        );
    }


    renderPlayFront() {
        return this.renderControl(
            <Image
                style={styles.controls.playFrontIcon}
                source={ require('../../../assets/icons/btn_video_next_15_s.png') } />,
            this.methods.playFront,
            styles.controls.playFront
        );
    }


    renderTopTitle() {

        if ( this.opts.title && this.props.screenState.isFullscreen ) {
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

    renderTimer() {

        return this.renderControl(
            <Text style={ styles.controls.timerText }>
                { this.calculateTime() }
            </Text>,
            this.methods.toggleTimer,
            styles.controls.timer
        );
    }

 
    renderTotalTimer() {

        return this.renderControl(
            <Text style={ styles.controls.totalTimerText }>
                { this.calculateTotalTime() }
            </Text>,
            this.methods.toggleTimer,
            styles.controls.totalTimer
        );
    }

    renderLoader() {
        if ( this.state.loading ) {
            return (
                <View style={ styles.loader.container }>
                    <Animated.Image
                        //source={{ uri:  'https://raw.githubusercontent.com/itsnubix/react-native-video-controls/master/assets/img/loader-icon.png' }}
                        source={ require('../../../assets/icons/loader-icon.png') }
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
                        width: this.props.screenState.isFullscreen
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
                        //seek={this.props.screenState.globalCurrentTime > 0 ? Math.round(this.props.screenState.globalCurrentTime,1) : null}
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
                    { this.state.loading || this.renderTopControls(this.props.screenState.isFullscreen) }
                    { this.renderLoader() }
                    { this.state.loading || this.renderCenterControls() }
                    { this.state.loading || this.renderBottomControls() }

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

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
            fontSize: 14,
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
            backgroundColor: '#000000bb'
        },
        center: {
            flex: 6,
            justifyContent: 'center',
            backgroundColor: '#000000bb'
        },
        centerFullscreen: {
            flex: 4,
            justifyContent: 'center',
            backgroundColor: '#000000bb'
        },
        bottom: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000bb'
        },
        bottomFullscreen: {
            flex: 3,
            justifyContent: 'center',
            backgroundColor: '#000000bb'
        },
        topControlGroup: {
            alignSelf: 'stretch',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: null
        },
        centerControlGroup: {            
            alignItems: 'center',            
            justifyContent: 'center',
            flexDirection: 'row',
        },
        centerControlGroupFullscreen: {            
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row'            
        },
        centerControlGroupCenter: {            
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        bottomControlGroup: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        bottomControlGroupFullscreen: {
            flexDirection: 'row',            
            justifyContent: 'center',
            alignItems: 'center'
        },
        bottomControlGroupCenter: {
            flex: 7,            
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row'
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
        title: {            
            flex: 0.6,
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 0,
        },
        titleText: {
            textAlign: 'center',            
            color: DEFAULT_COLOR.base_color_fff,
            fontSize: PixelRatio.roundToNearestPixel(16),
        },
        timer: {            
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50
        },
        timerText: {
            backgroundColor: 'transparent',            
            color: DEFAULT_COLOR.lecture_sub,            
            fontSize: PixelRatio.roundToNearestPixel(11),            
            textAlign: 'center'
        },
        totalTimer: {            
            flex: 2,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50
        },
        totalTimerText: {
            backgroundColor: 'transparent',
            color: DEFAULT_COLOR.base_color_fff,
            fontSize: PixelRatio.roundToNearestPixel(11),
            textAlign: 'center'
        },
        back: {
            width: 17,
            height: 17,            
            flexDirection: 'row',
            alignSelf: 'center',
        },
        resize: {
            width: 17,
            height: 17,
        },
        playBack: {
            flex: 2,
            alignItems: 'center'
        },
        playBackIcon: {
            width: 35,
            height: 35,
        },
        playVideoPrev: {
            
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
            
        },
        playVideoNextIcon: {
            width: 35,
            height: 35,
        },
        playFront: {
            flex: 2,            
            alignItems: 'center'
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
            height: 28
        },
        track: {
            backgroundColor: DEFAULT_COLOR.base_color_000,
            height: 3,
            width: '100%'
        },
        fill: {
            backgroundColor: '#FFF',
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
        circle: {
            borderRadius: 12,
            height: 14,
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