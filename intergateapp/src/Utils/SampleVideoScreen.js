import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View ,Dimensions,StatusBar} from 'react-native';
import Video from 'react-native-video';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import Orientation from 'react-native-orientation';
class SampleVideoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      isFullScreen: false,
      isLoading: true,
      paused: true,
      playerState: PLAYER_STATES.PLAYING,
      screenType: 'contain',
      rate : 1,
      videoWidth: SCREEN_WIDTH,
      videoHeight: SCREEN_WIDTH * ( 9 / 16 ),
    };
  }

  UNSAFE_componentWillMount() {

  }

 
  onSeek = seek => {
    //Handler for change in seekbar
    this.videoPlayer.seek(seek);
  };
 
  onPaused = playerState => {
    //Handler for Video Pause
    this.setState({
      paused: !this.state.paused,
      playerState,
    });
  };
 
  onReplay = () => {
    //Handler for Replay
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
  
  exitFullScreen = () => {
    alert('Exit full screen');
  };
  
  enterFullScreen = () => {};
  
  onFullScreen = () => {
    console.log('onFullScreen')
    if ( this.state.isFullScreen === false ) {
      this.setState({
        isFullScreen : true,
        screenType : 'cover'
      })
      
      Orientation.lockToLandscapeLeft();
    }else{
      this.setState({
        isFullScreen : false,
        screenType : 'contain'
      })
      Orientation.lockToPortrait();
    }
    /*
    if (this.state.screenType == 'contain')
      this.setState({ screenType: 'cover' });
    else this.setState({ screenType: 'contain' });
    */
  };
  renderToolbar = () => (
    <View>
      <Text>  </Text>
    </View>
  );
  onSeeking = currentTime => this.setState({ currentTime });
 
  render() {
    return (
      <View style={styles.container}>
        <Video
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
          onProgress={this.onProgress}
          paused={this.state.paused}
          ref={videoPlayer => (this.videoPlayer = videoPlayer)}
          resizeMode={this.state.screenType}
          onFullScreen={this.state.isFullScreen}
          fullscreenOrientation={this.state.isFullScreen ? 'landscape' : 'portrait'}
          //source={{ uri: 'https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8' }}
          source={{uri:this.props.videoUrl}}
          //style={styles.mediaPlayer}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: '#000',
            //aspectRatio: 0.6,
            width: this.state.videoWidth,
            height :  this.state.videoHeight
          }}
          rate={this.state.rate}
          volume={10}
          poster={ this.props.poster }
        />
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
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    //aspectRatio: 0.6,
    width: SCREEN_WIDTH,
    height :  SCREEN_WIDTH * 9/16
  },
});
export default SampleVideoScreen;