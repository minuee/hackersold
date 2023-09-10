// TODO CUSTOMIZE https://github.com/itsnubix/react-native-video-controls/blob/master/VideoPlayer.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Dimensions, SafeAreaView, Image, TouchableOpacity, PixelRatio,} from 'react-native';
import { Slider } from 'react-native-elements';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import {CustomTextB, CustomText} from "../Style/CustomText";


import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

class SampleVideoScreenTmp extends Component {
    videoPlayer;

    constructor(props) {
        super(props);
        this.state = {
            paused: false,
            seekerPosition: 0,
            currentTime: 0,

            duration: 0,
            isFullScreen: false,
            isLoading: true,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'cover',
        };
    }

    renderTopControls = () => {
        return(
            <View style={styles.topControls}>
                <View style={styles.topControlsLeft}>
                    <TouchableOpacity
                        onPress={() => this.onPressBackPageButton()}>
                        <Image
                            style={styles.backPageButton}
                            source={require('../../assets/icons/btn_back_page.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.topControlsCenter}>

                </View>
                <View style={styles.topControlsRight}>
                    <TouchableOpacity
                        onPress={() => this.onPressVideoControllButton()}>
                        <Image
                            style={styles.videoFullButton}
                            source={require('../../assets/icons/btn_video_full.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderCenterControls = () => {
        return(
            <View style={styles.centerControls}>
                <View style={styles.centerControlsLeft}>
                    <TouchableOpacity
                        onPress={() => this.onPressVideoBack15Button()}>
                        <Image
                            style={styles.videoBack15Button}
                            source={require('../../assets/icons/btn_video_back_15_s.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.centerControlsCenter}>

                    <View style={styles.centerControlsCenterLeft}>
                        <TouchableOpacity
                            onPress={() => this.onPressVideoPrevButton()}>
                            <Image
                                style={styles.videoPrevButton}
                                source={require('../../assets/icons/btn_video_prev.png')}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centerControlsCenterCenter}>
                        {
                            this.state.paused
                                ?
                                    <TouchableOpacity
                                        onPress={() => this.onPressVideoPauseButton()}>
                                        <Image
                                            style={styles.videoPauseButton}
                                            source={require('../../assets/icons/btn_video_play.png')}/>
                                    </TouchableOpacity>
                                :
                                    <TouchableOpacity
                                        onPress={() => this.onPressVideoPauseButton()}>
                                        <Image
                                        style={styles.videoPauseButton}
                                        source={require('../../assets/icons/btn_video_pause.png')}/>
                                    </TouchableOpacity>
                        }
                    </View>

                    <View style={styles.centerControlsCenterRight}>
                        <TouchableOpacity
                            onPress={() => this.onPressVideoNextButton()}>
                            <Image
                                style={styles.videoNextButton}
                                source={require('../../assets/icons/btn_video_next.png')}/>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.centerControlsRight}>
                    <TouchableOpacity
                        onPress={() => this.onPressVideoFront15Button()}>
                        <Image
                            style={styles.videoFront15Button}
                            source={require('../../assets/icons/btn_video_next_15_s.png')}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderBottomControls = () => {
        return(
            <View style={styles.bottomControls}>
                <View style={styles.bottomControlsLeft}>
                    <CustomTextB style={styles.currentTimeTitle}>
                        15:49:00
                    </CustomTextB>
                </View>
                <View style={styles.bottomControlsCenter}>
                    <Slider
                        style={styles.slider}
                        thumbStyle={styles.sliderThumb}
                        minimumTrackTintColor={DEFAULT_COLOR.lecture_sub}
                        maximumTrackTintColor={DEFAULT_COLOR.base_color_000}
                        onSlidingComplete={value => this.onSlidingComplete()}/>
                </View>
                <View style={styles.bottomControlsRight}>
                    <CustomTextB style={styles.totalTimeTitle}>
                        30:00:00
                    </CustomTextB>
                </View>
            </View>
        )
    }

    onPressBackPageButton = () => {
        this.props.navigation.goBack();
    }

    onPressVideoControllButton = () => {
        alert('onPressVideoControllButton()');
    }

    onPressVideoBack15Button = () => {
        alert('onPressVideoBack15Button()');
    }

    onPressVideoFront15Button = () => {
        alert('onPressVideoFront15Button()');
    }

    onPressVideoPrevButton = () => {
        alert('onPressVideoPrevButton()');
    }

    onPressVideoPauseButton = () => {
        this.setState({
            paused: !this.state.paused,
        })
    }

    onPressVideoNextButton = () => {
        alert('onPressVideoNextButton()');
    }

    onSlidingComplete = () => {
        alert('onSlidingComplete()');
    }

    onProgress = () => {

    }

    // <<< 신버전 종료
    // >>> 구버전 시작

    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };

    onReplay = () => {
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };

    onLoad = data => this.setState({ duration: data.duration, isLoading: false });

    onLoadStart = data => this.setState({ isLoading: true });

    onEnd = () => this.setState({ playerState: PLAYER_STATES.ENDED });

    onError = () => alert('Oh! ', error);

    exitFullScreen = () => {};

    enterFullScreen = () => {};


    onFullScreen = () => {
        console.log('CALL onFullScreen()');

        if(!this.state.isFullScreen) {
            this.setState({isFullScreen: true});
            this.videoPlayer.presentFullscreenPlayer();
            //Android 동작 불가 / iOS 재생 불가
        } else {
            this.setState({isFullScreen: false});
            this.videoPlayer.dismissFullscreenPlayer();
        }
    };

    /*
    onFullScreen = (status) => {
        console.log('CALL onFullScreen()');
        // Set the params to pass in the fullscreen status to navigationOptions
        this.props.navigation.setParams({
            fullscreen: !status
        })
    }
    */

    renderToolbar = () => (
        <View>
            <Icon
                name='angle-left'
                color={DEFAULT_COLOR.base_color_fff}
                size={40}
                onPress={() => this.props.navigation.goBack()}/>
        </View>
    );

    onSeeking = currentTime => this.setState({ currentTime });

    render() {
        const {
            videoSource,
            videoWidth,
            videoHeight,
        } = this.props;

        return (
            <View style={[
                    styles.container,
                    { width: videoWidth, height: videoHeight, },
                ]}>
                <Video
                    style={styles.video}
                    source={videoSource}
                    autoPlay={false}
                    onEnd={this.onEnd}
                    onLoad={this.onLoad}
                    onLoadStart={this.onLoadStart}
                    onProgress={this.onProgress}
                    paused={this.state.paused}
                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                    resizeMode={this.state.screenType}

                    fullscreen={this.state.fullscreen} />

                    {
                        //this.state.paused
                        true
                            &&
                                <View style={styles.controls}>
                                    {this.renderTopControls()}
                                    {this.renderCenterControls()}
                                    {this.renderBottomControls()}
                                </View>
                    }

                {/*
                <MediaControls
                    duration={this.state.duration}
                    isLoading={this.state.isLoading}
                    mainColor="#333"
                    onFullScreen={status => this.onFullScreen(status)}
                    onPaused={this.onPaused}
                    onReplay={this.onReplay}
                    onSeek={this.onSeek}
                    onSeeking={this.onSeeking}
                    playerState={this.state.playerState}
                    progress={this.state.currentTime}
                    toolbar={this.renderToolbar()}/>
                */}




            </View>
        );
    }
}

const styles = StyleSheet.create({
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: DEFAULT_COLOR.base_color_000,
    },
    container: {
    },
    controls: {
        flex: 1,
        backgroundColor: '#000000aa',
    },

    /* 상단 영역 시작 */
    /* 상단 영역 시작 */
    /* 상단 영역 시작 */

    topControls: {
        flex: 2,
        flexDirection: 'row',
        backgroundColor: '#FF000099',
    },
    topControlsLeft: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#FF000099',
    },
    backPageButton: {
        width: 17,
        height: 17,
    },
    topControlsCenter: {
        flex: 8,
        //backgroundColor: '#00FF0099',
    },
    topControlsRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#0000FF99',
    },
    videoFullButton: {
        width: 17,
        height: 17,
    },

    /* 중앙 영역 시작 */
    /* 중앙 영역 시작 */
    /* 중앙 영역 시작 */
    centerControls: {
        flex: 6,
        flexDirection: 'row',
        backgroundColor: '#00FF0099',
    },
    centerControlsLeft: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#FF000099',
    },
    centerControlsCenter: {
        flex: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#00FF0099',
    },
    centerControlsCenterLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    centerControlsCenterCenter: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerControlsCenterRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    centerControlsRight: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#0000FF99',
    },
    videoBack15Button: {
        width: 35,
        height: 35,
    },
    videoFront15Button: {
        width: 35,
        height: 35,
    },
    videoPrevButton: {
        width: 35,
        height: 35,
    },
    videoPauseButton: {
        width: 50,
        height: 50,
    },
    videoNextButton: {
        width: 35,
        height: 35,
    },
    slider: {

    },
    sliderThumb: {
        width: 14,
        height: 14,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },

    /* 하단 영역 시작 */
    /* 하단 영역 시작 */
    /* 하단 영역 시작 */
    bottomControls: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0000FF99',
    },
    bottomControlsLeft: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#FF000099',
    },
    bottomControlsCenter: {
        flex: 6,
        justifyContent: 'center',
        //backgroundColor: '#00FF0099',
    },
    bottomControlsRight: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentTimeTitle: {
        color: DEFAULT_COLOR.lecture_sub,
        fontSize: PixelRatio.roundToNearestPixel(11),
    },
    totalTimeTitle: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(11),
    },
    containerFull: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 9 / 16,
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },

    toolbar: {
        marginTop: 10,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5
    }
});

export default SampleVideoScreenTmp;

SampleVideoScreenTmp.defaultProps = {
    videoWidth: SCREEN_WIDTH,
    videoHeight: SCREEN_WIDTH * ( 9 / 16 ),
    //backgroundSource: {uri: 'http://i.imgur.com/6Iej2c3.png'},
    //windowHeight: SCREEN_HEIGHT * DEFAULT_WINDOW_MULTIPLIER,
    //leftIconOnPress: () => console.log('Left icon pressed'),
    //rightIconOnPress: () => console.log('Right icon pressed')
};

SampleVideoScreenTmp.propTypes = {
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    videoSource: PropTypes.object, // {{uri: 'url'}} OR {require('uri')}
    //...ScrollViewPropTypes,
    //backgroundSource: PropTypes.object,
    //windowHeight: PropTypes.number,
    //navBarTitle: PropTypes.string,
    //navBarTitleColor: PropTypes.string,
    //navBarTitleComponent: PropTypes.node,
    //navBarColor: PropTypes.string,
    //markImage: PropTypes.string,
    //lectureName: PropTypes.string,
    //textbookTitle: PropTypes.string,
    //headerView: PropTypes.node,
    //leftIcon: PropTypes.object,
    //rightIcon: PropTypes.object
};

/*
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, } from 'react-native';

import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import AutoHeightImage from 'react-native-auto-height-image';

import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

class SampleVideoScreen2 extends Component {
    videoPlayer;

    constructor(props) {
        super(props)
        this.state = {
            isVideoStart: false,
            currentTime: 0,
            duration: 0,
            isFullScreen: false,
            paused: false,
            imageUrl: props.imageUrl,
            videoUrl: props.videoUrl,
            videoHeight: SCREEN_WIDTH * 9 / 16,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'contain',
        }
    }

    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };

    onPaused = playerState => {
        console.log('CALL onPaused()');
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };

    onReplay = () => {
        console.log('CALL onReplay()');
        this.setState({ playerState: PLAYER_STATES.PLAYING });
        this.videoPlayer.seek(0);
    };

    onLayout = (event) => {
        this.setState({
            videoHeight: event.nativeEvent.layout.height,
        })
    }

    onPlay = () => {
        console.log('CALL onPlay()');
        this.setState({
            isVideoStart: true,
        })
    }

    onProgress = data => {
        const { isLoading, playerState } = this.state;
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({ currentTime: data.currentTime });
        }
    };

    onLoad = (data) => {
        console.log('CALL onLoad()');
        this.setState({ duration: data.duration, isLoading: false });
    }

    onLoadStart = (data) => {
        console.log('CALL onLoadStart()');
        this.setState({ isLoading: true });
    }

    onEnd = () => {
        console.log('CALL onEnd()');
        this.setState({ playerState: PLAYER_STATES.ENDED });
    }

    onError = () => {
        alert('Oh! ', error);
    }

    exitFullScreen = () => {
        alert('Exit full screen');
    };

    enterFullScreen = () => {

    };

    onFullScreen = () => {
        if (this.state.screenType == 'contain')
            this.setState({ screenType: 'cover' });
        else
            this.setState({ screenType: 'contain' });
    };

    renderToolbar = () => (
        <View>
            <Text>  </Text>
        </View>
    );

    onSeeking = currentTime => this.setState({ currentTime });

    render() {
        return(
            <View style={styles.container}>
                {
                    !this.state.isVideoStart
                        ?
                            <View style={styles.coverWrapper}>
                                <AutoHeightImage
                                    source={{ uri: this.props.imageUrl }}
                                    onLayout={(event) => this.onLayout(event)}
                                    width={SCREEN_WIDTH}/>
                                <Icon name='play' onPress={() => this.onPlay()}/>
                            </View>
                        :
                            <View style={styles.videoContainer}>
                                <Video
                                    ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                                    style={[
                                        styles.videoWrapper,
                                        { height: this.state.videoHeight }
                                    ]}
                                    paused={this.state.paused}
                                    resizeMode={this.state.screenType}
                                    source={{ uri: this.props.videoUrl }} />
                                <MediaControls
                                    duration={this.state.duration}
                                    isLoading={this.state.isLoading}
                                    mainColor="#333"
                                    onFullScreen={this.onFullScreen}
                                    onPaused={this.onPaused}
                                    onReplay={this.onReplay}
                                    onSeek={this.onSeek}
                                    onSeeking={this.onSeeking}
                                    playerState={this.state.playerState}
                                    progress={this.state.currentTime}
                                    toolbar={this.renderToolbar()}
                                />
                            </View>
                }
            </View>
        );
    }
}

export default SampleVideoScreen2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    coverWrapper: {
    },
    videoContainer: {
        width: SCREEN_WIDTH,
    },
    videoWrapper: {
        width: SCREEN_WIDTH,
    },
});
*/