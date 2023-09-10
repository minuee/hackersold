//Example to play music in React Native
import React, { PureComponent } from 'react';
//Import React
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
//Import basic elements we need from React Native
import Sound from 'react-native-sound';
import Toast from 'react-native-tiny-toast';
//Import library for Sound Component
 
//List of the dummy sound track
const audioList = [
  {
    title: 'Play mp3 sound from Local',
    isRequire: true,
    url: require('../../../assets/files/good.mp3'),
  },
  {
    title: 'Play mp3 sound from remote URL',
    url:
      'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3',
  },
  {
    title: 'Play aac sound from Local',
    isRequire: true,
    url: require('../../../assets/files/good.mp3'),
  },
  {
    title: 'Play aac sound from remote URL',
    url:
      'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac',
  },
  {
    title: 'Play wav sound from Local',
    isRequire: true,
    url: require('../../../assets/files/good.mp3'),
  },
  {
    title: 'Play wav sound from remote URL',
    url:
      'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/frog.wav',
  },
];


class Sample01Screen extends PureComponent {

  constructor(props) {
    super(props);
    Sound.setCategory('Playback', true); // true = mixWithOthers
    this.state = {
      tests: {},
      playing_index : null,
      selected_url : null,
      seleted_status : null
    };
    this.sound = null;
  }

  UNSAFE_componentWillUnmount() {
    this.sound.release();
  }

  playSound = async(item, index) => {    

    if ( this.state.playing_index === index ) {
        //toast 뛰운다
        const alerttoast = Toast.show('이미 동일파일로 재생중입니다');
            setTimeout(() => {
                Toast.hide(alerttoast)
            }, 3000)
    }else if ( this.state.playing_index && this.state.seleted_status === "play" ) {        
        //toast 뛰운다
        const alerttoast = Toast.show('이미 다른 파일이 재생중입니다');
        setTimeout(() => {
            Toast.hide(alerttoast)
        }, 3000)
    }else{ 
        if ( item.isRequire ) {
            this.sound = new Sound(item.url,(error, sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }   
                this.sound.play((success) => {
                  if (success) {
                    console.log('successfully 2finished playing');
                  } else {
                    console.log('playback failed due to audio decoding errors');
                  }
                    this.sound.release();
                    console.log('play finished'); 
                    this.nullSound();
                });             
            });
        }else {
            this.sound = new Sound(item.url,'', (error, sound) => {
                if (error) {
                    alert('error' + error.message);
                    return;
                }   
                this.sound.play((success) => {
                  this.sound.setCurrentTime(2.5);
                    if (success) {
                      console.log('successfully finished playing');
                    } else {
                      console.log('playback failed due to audio decoding errors');
                    }
                    this.sound.release();
                    console.log('play finished'); 
                    this.nullSound();
                });                    
                
            });
        }

        this.setState({ 
            playing_index : index,
            selected_url : item.url ,
            seleted_status : 'play'
        });
    }
  }

  pauseSound = async(item, index) => {    
    if ( this.state.playing_index && this.state.seleted_status === "play" ) {
        this.sound.pause();
        this.setState({         
            seleted_status : 'pause'
        });
    }
  }

  resumeSound = async(item, index) => {    
    if ( this.state.playing_index == index && this.state.seleted_status === "pause" ) {
        this.sound.play(() => {
            this.sound.release();
            console.log('play finished'); 
            this.nullSound();
        }); 
        this.setState({         
            seleted_status : 'play'
        });
    }
  }

  stopSound = async(item, index) => {

    console.log('this.state.playing_index', this.state.playing_index); 
    console.log('this.state.seleted_status', this.state.seleted_status); 

    if ( this.state.playing_index === index && this.state.seleted_status !== null) {  
        this.sound.stop(() => {
            console.log('Stop');
        });      
        this.sound.release();
        this.nullSound();
        
    }
  }

  nullSound = () => {
    console.log('function nullSound'); 
    this.setState({ 
        playing_index : null,
        selected_url : null ,
        seleted_status : null 
    });
  }
 
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.headerTitle}>
                        Example to Play Music in React Native
                    </Text>
                    <ScrollView style={styles.container}>
                        {audioList.map((item, index) => {
                        return (
                            <View style={styles.feature} key={item.title}>
                                <Text style={{ flex: 1, fontSize: 14, color:'#888' }}>{item.title}</Text>
                                <TouchableOpacity onPress={() => this.playSound(item, index)}>
                                    <Text style={[styles.buttonPlay,this.state.playing_index == index ? styles.playingText:styles.notplayingText]}>Play</Text>
                                </TouchableOpacity>
                                { 
                                this.state.playing_index === index && this.state.seleted_status == 'play' ?
                                <TouchableOpacity onPress={() => this.pauseSound(item, index)}>
                                    <Text style={styles.buttonStop}>pause</Text>
                                </TouchableOpacity>
                                : 
                                this.state.playing_index === index && this.state.seleted_status == 'pause' ?
                                <TouchableOpacity onPress={() => this.resumeSound(item, index)}>
                                    <Text style={styles.buttonStop}>resume</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity>
                                    <Text style={styles.buttonStop}>Wait</Text>
                                </TouchableOpacity>

                                }
                                <TouchableOpacity onPress={() => this.stopSound(item, index)}>
                                    <Text style={styles.buttonStop}>Stop</Text>
                                </TouchableOpacity>
                            </View>
                        );
                        })}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
 
export default Sample01Screen;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(00,00,80,1)',
  },
  playingText : {
    color: '#fff',
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  notplayingText : {
    color: '#888',
    backgroundColor: '#fff',
    borderColor: '#ebebeb',
  },
  buttonPlay: {
    fontSize: 16,
    color: 'white',    
    borderWidth: 1,    
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  buttonStop: {
    fontSize: 16,
    color: '#888',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  feature: {
    flexDirection: 'row',
    padding: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgb(180,180,180)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
  },
});

// 참고 https://aboutreact.com/react-native-play-music-sound/