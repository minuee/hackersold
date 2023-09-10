import React, { Component } from 'react';
import {Animated, Dimensions, Platform, Text, TouchableOpacity, View,StatusBar,Image, PixelRatio,StyleSheet, SafeAreaView,ScrollView,Alert} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import Sound from 'react-native-sound';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/Entypo';
Icon2.loadFont();
import Icon3 from 'react-native-vector-icons/MaterialIcons';
Icon3.loadFont();
import Icon5 from 'react-native-vector-icons/Feather';
Icon5.loadFont();

import  TextTicker from '../../Utils/TextTicker';
import LinearGradient from "react-native-linear-gradient";
import Modal from 'react-native-modal';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const AudioStatePlay = "play";
const AudioStatePause = "pause";
const AudioStateStop = "stop";
const secsDelta = 10;//10초앞으로

function getAudioTimeString(seconds){
    const h = parseInt(seconds/(60*60));
    const m = parseInt(seconds%(60*60)/60);
    const s = parseInt(seconds%60);

    return ((h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (s<10?'0'+s:s));
}

class SampleListening extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bookInfo : {
                title : this.props.screenState.baseBookInfo.title
            },
            loopingSound: undefined,
            tests: {},
            nowPlaySeq: null,
            nowPlayStatus : AudioStateStop,
            nowPlayDuration: 0,
            nowPlaySeconds : 0,
            samplemp3list : [],
            showModalPicker: false,
            selectedFilterIndex: 0,
        }
    }

    UNSAFE_componentWillMount() {        
        console.log('this.props.screenState.samplemp3list', JSON.stringify(this.props.screenState.samplemp3list))
        this.setState({ 
            samplemp3list : this.props.screenState.samplemp3list,
            nowPlayDuration : 0,
            nowPlaySeq : null ,
            nowPlaySeconds:0,
            nowPlayStatus : AudioStateStop
        });
    }  


    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    componentWillUnmount(){
        if(this.sound){
            this.sound.release();
            this.sound = null;
        }
        this.setState({ 
            nowPlayDuration : 0,
            nowPlaySeq : null ,
            nowPlaySeconds:0,
            nowPlayStatus : AudioStateStop
        });       
        if(this.timeout){
            clearInterval(this.timeout);
        }
    }


    // Special case for stopping
    stopSoundLooped = () => {
        if (!this.state.loopingSound) {
          return;
        }
  
        this.state.loopingSound.stop().release();
        this.setState({loopingSound: null, tests: {...this.state.tests, ['mp3 in bundle (looped)']: 'win'}});
    };


    selectmp3Area = async(idx) => {
        console.log('mp3 idx' , idx)
        await this.playComplete()
        this.setState({
            nowPlaySeq : idx,
        })
        if(!this.sound){
            console.log('!this.sound')
            const callback = (error, sound) => {
                if (error) {
                    this.setState({
                        nowPlaySeq : null,
                        nowPlayDuration : 0
                    })
                    Alert.alert('error', error.message);                
                    return;
                }

                this.setState({
                    nowPlayDuration : sound.getDuration()
                })            
            };

            const sound = new Sound(this.state.samplemp3list[idx-1].mp3Url, null, error => callback(error, sound));
        } else {
            console.log('this.sound')
        }
    }

    setTestState = (testInfo, component, status) => {
        component.setState({tests: {...component.state.tests, [testInfo.title]: status}});
    }
      
    // Pause the sound
    pauseSound = (idx) => {
        
        if(this.sound){            
            this.sound.pause();
        }
        
        this.setState({
            nowPlayStatus : AudioStatePause
        })
        this.setTestState(this.state.samplemp3list[idx-1], this, AudioStatePause);
    }

    resumeSound = async(idx, component) => {
        let testInfo = this.state.samplemp3list[idx-1];
        if( this.state.nowPlaySeq && this.state.nowPlaySeconds > 1  ) {
            console.log('resumeSound()', 'TRUE')
            if(this.sound){
                this.sound.play(this.playComplete);
                this.setState({nowPlayStatus:'playing'});
                this.setTestState(testInfo, component, 'playing');     
            }
        } else {
            console.log('resumeSound()', 'FALSE')
        }
    }

    jump10Second = async(idx) => {
        //console.log('jump10Second',idx)
        if(this.sound){            
            this.sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs - secsDelta;
                if(nextSecs < 0) nextSecs = 0;
                else if(nextSecs > this.state.nowPlayDuration) nextSecs = this.state.nowPlayDuration;
                this.sound.setCurrentTime(nextSecs);
                this.setState({
                    nowPlaySeconds:nextSecs
                });
            })
        }
 
    }

    playSound = (idx, component) => {
        let testInfo = this.state.samplemp3list[idx-1];
        
        if(this.state.nowPlaySeq  ) {
            if( this.sound){                
                this.sound.play(this.playComplete);
                this.setState({nowPlayStatus:'playing'});
                this.setTestState(testInfo, component, 'playing');            
                
            }else{                            
                this.setState({nowPlayStatus:'playing'});
                this.setTestState(testInfo, component, 'pending');            
                const callback = (error, sound) => {
                    if (error) {                    
                        Alert.alert('error', error.message);
                        this.setState({
                            nowPlaySeq : null,
                            nowPlayDuration : 0
                        })
                        this.setTestState(testInfo, component, 'fail');
                        return;
                    }
                    //console.log('getDuration',sound.getDuration())
                    this.setTestState(testInfo, component, 'playing');
                    testInfo.onPrepared && testInfo.onPrepared(sound, component);
            
                    this.sound.play(this.playComplete);
                    /*
                    sound.play(() => {
                        this.setTestState(testInfo, component, 'win');
                        this.setState({
                            nowPlaySeq : null,
                            nowPlayDuration:0,
                            nowPlaySeconds:0,
                            nowPlayStatus:AudioStateStop
                        })
                        sound.release();
                        if(this.timeout){
                            clearInterval(this.timeout);
                        }
                    });
                    */
                    
                    
                };
            
                this.sound = new Sound(testInfo.mp3Url, testInfo.basePath, error => callback(error, this.sound));

                this.timeout = setInterval(() => {
                    if(this.sound && this.state.nowPlayStatus === 'playing'){
                        this.sound.getCurrentTime((seconds, isPlaying) => {
                            //console.log('this.sound.getCurrentTime = ' + seconds)
                            this.setState({nowPlaySeconds:seconds});
                            
                        })
                    }
                }, 1000);
                
              
               
            }
        }
    }

    playComplete = async(success) => {
        if(this.sound){
            if (success) {
                //console.log('successfully finished playing');
            } else {
                //console.log('playback failed due to audio decoding errors');
                //Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            await this.setTestState(this.state.samplemp3list[this.state.nowPlaySeq-1], this, 'win');

            this.setState({
                nowPlayStatus : AudioStateStop,
                nowPlaySeq:null,
                nowPlaySeconds:0,
                nowPlayDuration : 0
            });
            this.sound.setCurrentTime(0);
            if(this.timeout){
                clearInterval(this.timeout);
            }
            this.sound.release();
            this.sound = null;
        }else{
            this.setState({
                nowPlayStatus : AudioStateStop,
                nowPlaySeq:null,
                nowPlaySeconds:0,
                nowPlayDuration : 0
            });

        }
    }

    _toggleModalPicker = () => {
        this.setState({
            showModalPicker: !this.state.showModalPicker,
        })
    }

    selectFilter = (filterIndex) => {
        if(filterIndex != this.state.selectedFilterIndex) {
            this.playComplete()
        }

        this.setState({
            selectedFilterIndex: filterIndex,
        }, function() {
            this._toggleModalPicker()
        })
    }

    render() {

        //샘플듣기  
        const SampleButton2 = ({status,seq,thisComponent}) => (
          
            status === 'playing' ?   
            <View style={{flexDirection:'row',flexGrow:1}}>
                <TouchableOpacity
                    style={{flex:1,alignItems:'center',justifyContent:'center'}}
                    onPress={() => this.jump10Second(seq)}>
                    <Image
                        source={require('../../../assets/icons/btn_mp_back.png')}
                        style={{width: 31,height: 36}}
                    />
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=>this.pauseSound(seq)}  style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image
                        source={require('../../../assets/icons/btn_mp_pause.png')}
                        style={{width: 31,height: 36}}
                    />
                </TouchableOpacity>
            </View>
            :
            status === 'pause' 
            ?
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>this.jump10Second(seq)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image
                        source={require('../../../assets/icons/btn_mp_back.png')}
                        style={{width: 31,height: 36}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.resumeSound(seq,thisComponent)} style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Image
                        source={require('../../../assets/icons/btn_mp_paly.png')}
                        style={{width: 31,height: 36, alignSelf: 'center',}}
                    />
                </TouchableOpacity>
            </View>
            :
            <View style={{alignItems:'flex-end',paddingRight:10}}>
                {
                    this.state.nowPlayDuration > 0 ?
                    <TouchableOpacity
                        onPress={()=> this.playSound(seq,thisComponent)}
                        style={{
                            alignItems:'center',
                            justifyContent:'center',
                        }}>
                        <Image
                            source={require('../../../assets/icons/btn_mp_paly.png')}
                            style={{width: 31,height: 36}}
                        />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center', }}>
                        <Image
                            source={require('../../../assets/icons/btn_mp_paly.png')}
                            style={{width: 31,height: 36, alignSelf: 'center',}}
                        />
                    </TouchableOpacity>
                }
                
            </View>
                    
              
        );
        const SampleButton = ({title, }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                <Image
                    source={require('../../../assets/icons/btn_mp_paly.png')}
                    style={{width: 20.3,height: 20.3, alignSelf: 'center',}}
                />
            </View>                
            );
        
        const SampleHeader = ({children, style}) =>
            <Text style={[styles.sampleheader, style]} numberOfLines={1} ellipsizeMode = 'tail'>
                {children}
            </Text>;

        const SampleFeature = ({title, onPress, seq, buttonLabel = 'PLAY', status ,thisComponent}) => (            
            seq === this.state.nowPlaySeq 
            ?

            <View style={[
                styles.samplefeature2,
                {
                    height: 75,
                    paddingHorizontal: 15,
                    backgroundColor: '#f5f7f8',
                }
            ]}>

                <View
                    style={{
                        width: this.state.nowPlaySeconds > 0
                            ? this.state.nowPlaySeconds/this.state.nowPlayDuration*100+'%'
                            : 0,
                        height: '100%',
                        position: 'absolute',
                        backgroundColor: '#e2f3f8'
                    }}/>

                <View style={{
                    flex: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 75,
                }}>
                    <Image
                        source={require('../../../assets/icons/icon_mp_volume.png')}
                        style={{width: 22,height: 16, alignSelf: 'center',}}
                    />
                </View>
                <View style={{
                    flex: (status == 'playing' || status == 'pause') ? 5.5 : 7,
                    height: 75,
                    justifyContent: 'center',
                }}>
                    <View style={{
                        justifyContent: 'center',
                    }}>
                        <CustomTextM
                            numberOfLines={1}
                            ellipsizeMode = 'tail'
                            style={{
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
                                color: DEFAULT_COLOR.lecture_base,
                                lineHeight: PixelRatio.roundToNearestPixel(18),
                                letterSpacing: -0.75,
                            }}
                        >{title}</CustomTextM>
                        <TextRobotoR
                            style={{
                                color: DEFAULT_COLOR.base_color_888,
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),
                                lineHeight: PixelRatio.roundToNearestPixel(18),
                                //letterSpacing: 0.55,
                            }}>
                            {getAudioTimeString(
                                (status == 'playing' || status == 'pause')
                                    ?
                                        this.state.nowPlaySeconds
                                    :
                                        this.state.nowPlayDuration
                            )}
                        </TextRobotoR>
                    </View>
                </View>
                {
                //status ? <Text style={{padding: 5}}>{resultIcons[status] || ''}</Text> : null
                }
                <View style={{
                    flex: (status == 'playing' || status == 'pause') ? 3.0 : 1.5,
                    alignContent: 'center',
                    justifyContent: 'center',
                    height: 75,
                }}>
                    <SampleButton2 status={status} seq={seq} thisComponent={thisComponent} />
                </View>
            </View>
            :
            <TouchableOpacity 
                onPress={()=> this.selectmp3Area(seq)}
                style={[
                    styles.samplefeature,
                    { height: 53, marginHorizontal: 20, }
                ]}
            >
                <SampleHeader style={{
                    flex: 7,
                    color: DEFAULT_COLOR.base_color_222,
                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                    lineHeight: PixelRatio.roundToNearestPixel(18),
                    letterSpacing: -0.65,
                }}>
                    {title}
                </SampleHeader>
                {
                //status ? <Text style={{padding: 5}}>{resultIcons[status] || ''}</Text> : null
                }
                <SampleButton
                    style={{ flex: 1.5, }}
                    title={buttonLabel}
                    status={status} />
            </TouchableOpacity>
        );

        return(
            <SafeAreaView style={ styles.container }>
                <View style={{
                    //paddingTop:5,
                    paddingBottom:15,
                    alignItems:'center',
                    justifyContent:'center',
                    borderBottomColor:'#ccc',
                    borderBottomWidth:1,
                    height: 45,
                    flexDirection: 'row',
                    //backgroundColor: '#FF0000',
                }}>
                    <View style={{ flex: 1.5 }}>

                    </View>

                    <View style={{
                        flex: 7,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <CustomTextR style={{
                            fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
                            color:DEFAULT_COLOR.base_color_222,
                            lineHeight: PixelRatio.roundToNearestPixel(22),
                            letterSpacing: -0.9,
                        }}>
                            샘플듣기
                        </CustomTextR>
                    </View>


                    <TouchableOpacity
                        style={{ flex: 1.5 }}
                        onPress= {()=> {
                            this.playComplete();
                            this.props.screenState._closeModal();
                        }
                        }>
                        <Image
                            source={require('../../../assets/icons/btn_close_pop.png')}
                            style={{width: 16,height: 16, alignSelf: 'center',}}
                        />
                    </TouchableOpacity>


                    {/*
                    <TouchableOpacity 
                        onPress= {()=> {
                            this.playComplete();
                            this.props.screenState._closeModal();
                            }
                        }
                        style={{position:'absolute',top:0,right:17,width:30,height:30}}
                        >
                        <Image
                            source={require('../../../assets/icons/btn_close_pop.png')}
                            style={{width: 16,height: 16, alignSelf: 'center',}}
                        />
                    </TouchableOpacity>
                    */}
                </View>
                <View
                    style={{
                        height:45,
                        backgroundColor:DEFAULT_COLOR.lecture_base,
                        justifyContent:'center',
                        //paddingTop:10,
                        //paddingHorizontal:20,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 8.5,
                        marginLeft: 25,
                        marginTop: 8,
                        justifyContent: 'center',
                    }}>
                        <TextTicker
                            //marqueeOnMount={false}
                            ref={c => this.marqueeRef = c}
                            style={{
                                justifyContent: 'center',
                                color:'#fff',
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
                                lineHeight: PixelRatio.roundToNearestPixel(30),
                                letterSpacing: -0.84,
                            }}
                            shouldAnimateTreshold={10}
                            duration={5000}
                            loop
                            bounce={false}
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                            {this.state.samplemp3list[this.state.selectedFilterIndex].title}
                        </TextTicker>
                    </View>
                    <TouchableOpacity
                        style={{
                            flex: 1.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => this._toggleModalPicker()}
                        >
                        <Image
                            source={require('../../../assets/icons/btn_list_open.png')}
                            style={{width: 12,height: 12, alignSelf: 'center',}}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1,backgroundColor:'#fff'}}>
                    {/*
                    <View style={{paddingHorizontal:0,backgroundColor:'#fff'}}>
                        {this.state.samplemp3list.map((mp3Info,index) => {
                            return (                                    
                            <SampleFeature
                                status={this.state.tests[mp3Info.title]}
                                key={index}
                                seq={index+1}
                                title={mp3Info.title}
                                onPress={() => {return this.playSound(index, this);}}
                                thisComponent={this}
                            />
                            );
                        })}                      
                    </View>
                    */}
                    <View style={{
                        paddingHorizontal:0,
                        backgroundColor:'#fff'
                    }}>
                        <SampleFeature
                            status={this.state.tests[this.state.samplemp3list[this.state.selectedFilterIndex].title]}
                            key={this.state.selectedFilterIndex+1}
                            seq={this.state.selectedFilterIndex+1}
                            title={'샘플 듣기'}
                            onPress={() => {
                                return this.playSound(this.state.selectedFilterIndex, this);
                            }}
                            thisComponent={this}
                        />
                    </View>
                    <View style={{paddingHorizontal:0,backgroundColor:'#fff'}}>
                        {this.state.samplemp3list[this.state.selectedFilterIndex].mp3Contents.title.map((title,index) => {
                            return (
                                <View style={[
                                    {
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        height: 53,
                                        marginHorizontal: 15,
                                        borderBottomColor: '#e8e8e8',
                                        borderBottomWidth: 1,
                                    }
                                ]}>
                                    <View style={{
                                        flex: 1.5,
                                        height: 53,
                                        //backgroundColor: '#FF0000',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <TextRobotoR
                                            style={{
                                                color: DEFAULT_COLOR.base_color_888,
                                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                lineHeight: PixelRatio.roundToNearestPixel(18),
                                                letterSpacing: 0,
                                            }}>
                                            {('00'+index).slice(-2)}
                                        </TextRobotoR>
                                    </View>
                                    <View style={{
                                        flex: 7,
                                        height: 53,
                                        //backgroundColor: '#00FF00',
                                        justifyContent: 'center',
                                    }}>
                                        <CustomTextR
                                            style={{
                                                color: DEFAULT_COLOR.base_color_222,
                                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                lineHeight: PixelRatio.roundToNearestPixel(18),
                                                letterSpacing: -0.65,
                                            }}
                                            numberOfLines={2}>
                                            {title}
                                        </CustomTextR>
                                    </View>
                                    <View style={{
                                        flex: 1.5,
                                        height: 53,
                                        //backgroundColor: '#0000FF',
                                    }}>

                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>

                <Modal
                    style={{flex: 1, justifyContent: 'flex-end',margin: 0}}
                    animationType="slide"
                    //transparent={true}
                    visible={this.state.showModalPicker}
                    onRequestClose={() => {
                        this.setState({showModalPicker:false})
                    }}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModalPicker}>

                    <View style={[styles.modalPickerContainer]}>
                        <View style={styles.modalPickerBackgrounder}>

                        </View>

                        <View style={styles.modalPickerWrapper}>
                            <View style={styles.modalPickerContent}>
                                <ScrollView
                                    style={styles.modalScroll}
                                    indicatorStyle='black'>
                                    {
                                        this.state.samplemp3list.map((item, index2) => {
                                            return (
                                                <View style={styles.modalPickerItem} key={index2}>
                                                    <TouchableOpacity
                                                        style={styles.modalPickerItemWrapper}
                                                        onPress={() => this.selectFilter(index2)}>
                                                        <View style={styles.modalPickerItemIconSelectedWrapperLeft}>
                                                        </View>
                                                        <View style={styles.modalPickerItemIconSelectedWrapperCenter}>
                                                        {
                                                            this.state.selectedFilterIndex == index2
                                                                ?
                                                                <CustomTextB
                                                                    style={styles.modalPickerItemTextSelected}
                                                                    numberOfLines={1}
                                                                    >
                                                                    {item.title}
                                                                </CustomTextB>
                                                                :
                                                                <CustomTextR
                                                                    style={styles.modalPickerItemText}
                                                                    numberOfLines={1}>
                                                                    {item.title}
                                                                </CustomTextR>
                                                        }
                                                        </View>
                                                        <View style={styles.modalPickerItemIconSelectedWrapperRight}>
                                                            {
                                                                this.state.selectedFilterIndex == index2
                                                                &&
                                                                <Image
                                                                    style={styles.modalPickerItemIconSelected}
                                                                    source={require('../../../assets/icons/btn_check_list.png')}/>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    <LinearGradient
                                        pointerEvents={'none'}
                                        colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.95)", "rgba(255,255,255,1.00)"]}
                                        //colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
                                        locations={[0, 0.70, 1]}
                                        style={{position: "absolute", height: this.state.heightScrollView, width: "100%", }}/>
                                </ScrollView>
                                <View style={styles.cancelButton}>
                                    <TouchableOpacity
                                        style={styles.cancelButtonWrapper}
                                        onPress={() => this._toggleModalPicker()}>
                                        <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    /**** Modal  *******/
    modalContainer: {
        marginTop:SCREEN_HEIGHT*0.3,
        paddingTop: 16, 
        backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    sampletitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 30,
        padding: 20,
        textAlign: 'center',
        backgroundColor: 'rgba(240,240,240,1)',
    },
    samplebutton: {
        fontSize: 20,
        backgroundColor: 'rgba(220,220,220,1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(80,80,80,0.5)',
        overflow: 'hidden',
        padding: 7,
    },
    sampleheader: {
        textAlign: 'left',
    },
    samplefeature: {
        flexDirection: 'row',
        padding: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
        //borderTopWidth: 1,
        //borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },
    samplefeature2: {
        flexDirection: 'row',    
        //padding:10,
        //alignSelf: 'stretch',
        //alignItems: 'center',
        //borderTopWidth: 1,
        //borderTopColor: 'rgb(180,180,180)',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
    },

    /** Picker Modal **/
    modalPickerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalPickerBackgrounder: {
        flex: 2,
        backgroundColor: '#00000055',
    },
    modalPickerWrapper: {
        flex: 3,
        backgroundColor: '#00000055',
    },
    modalPickerContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    modalPickercroll: {

    },
    modalPickerItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalPickerItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalPickerItemText: {
        textAlign: 'center',
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(45),
        letterSpacing: -0.8,
    },
    modalPickerItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(45),
        letterSpacing: -0.8,
    },
    modalPickerItemIconSelectedWrapperLeft: {
        flex: 1.5,
        alignItems: 'center',
    },
    modalPickerItemIconSelectedWrapperCenter: {
        flex: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPickerItemIconSelectedWrapperRight: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        //paddingRight: 17,
    },
    modalPickerItemIconSelected: {
        width: 15,
        height: 15,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(51),
        letterSpacing: -0.8,
    },
});

export default SampleListening;