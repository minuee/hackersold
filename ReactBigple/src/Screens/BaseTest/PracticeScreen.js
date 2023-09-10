import React from 'react';
import {StyleSheet,View,Text,TextInput,Platform, ScrollView, TouchableHighlight,Alert,ActivityIndicator} from 'react-native';
import 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
//import AsyncStorage from '@react-native-community/async-storage';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import { Slider } from 'react-native-elements';
import BottomDrawer from 'rn-bottom-drawer';
import Toast from 'react-native-tiny-toast';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle'
import TimerScreen from './TimerScreen';
import AnswerScreen from './AnswerScreen';


const TAB_BAR_HEIGHT = 40;
const HEADER_HEIGHT = 40;

class PracticeScreen extends React.Component {

    constructor(props) {       
        super(props);
        //console.log('Practice',this.props);
        this.state  = {
            isAnswerMode : this.props.screenState.isAnswerMode,
            isTimerRoad : false,
            remainTime : 0,
            nowMp3Url : null,
            nowMp3CurrentTime : 0,
            nowMp3Duration : 0,
            nowMp3Playing: false,
            nowSeq : this.props.screenState.nextProblem ? this.props.screenState.nextProblem : 1,
            choiceSeq : null,
            isPrevPage : false,
            isNextPage : false,
            tempSave: this.tempSave.bind(this),
            sendAnswer: this.sendAnswer.bind(this),
            parentSaveRemainTime: this.parentSaveRemainTime.bind(this),            
            items : [
                { seq : 1 , 
                  mode : 'LC',
                  mp3url : 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3',
                  example : [
                        {seq2 : 'A',descript : 'accommodated'},
                        {seq2 : 'B',descript : 'accommodates'},
                        {seq2 : 'C',descript : 'accommodating'},
                        {seq2 : 'D',descript : 'accommodations'},
                  ],
                  AnswerType : 'multi',
                  keyAnswer :'A',yourAnswer : 'A',isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 2 , 
                    mode : 'LC',
                    mp3url : 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac',
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ],
                    AnswerType : 'multi',
                    keyAnswer :'A',yourAnswer : 'B',isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 3, 
                    mode : 'RC',
                    mp3url : null,
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                          {seq2 : 'E',descript : 'accommodationes'},
                    ],
                    AnswerType : 'multi',
                    keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 4, 
                    mode : 'RC',
                    mp3url : null,
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ],
                    AnswerType : 'short',
                    keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 5, 
                    mode : 'RC',
                    mp3url : null,
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ],
                    AnswerType : 'multi',
                    keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                }           
            ]
        }

        _onFinishedPlayingSubscription = null;
        _onFinishedLoadingSubscription = null;
        _onFinishedLoadingFileSubscription = null;
        _onFinishedLoadingURLSubscription = null;

        
    }
    
    
    UNSAFE_componentWillMount() {
        if ( (this.state.items.length+1) > this.state.nowSeq) {
            this.setState({ isNextPage : true });
        }
        if ( this.state.nowSeq > 1) {
            this.setState({ isPrevPage : true });       
         }           
         this.getStorageData();
    }   

 
    getStorageData = async () => {

        if ( this.props.remainTime === 0 || this.props.remainTime === undefined ) {
            this.setState({remainTime: 60*75});
        }else{
            this.setState({remainTime: this.props.remainTime});
        }
        /*
        try {
          const tvalue = await AsyncStorage.getItem('remainTime')
          if(tvalue !== null) {
         
            if ( tvalue === '0')  {
                this.setState({remainTime: 60*75});
            }else{
                this.setState({remainTime: tvalue});
            }
          }
        } catch(e) {
         
            this.setState({remainTime: 60*75});
        }  
        */      
        
    }
    
    componentDidMount() {     
        
        this.setState({ isTimerRoad : true });     

        _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            this.setState({ nowMp3Playing : false, nowMp3CurrentTime : 0 });
            console.log('finished playing', success);
            this._setinterval();            
          })
        _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {            
            //console.log('finished loading', success)
          })
        _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {
            
            //console.log('finished loading file', success, name, type)
          })
        _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {            
            //console.log('finished loading url', success, url)
        }) 
    }

    componentWillUnmount() {

        this.setState({ nowMp3Playing : false, nowMp3CurrentTime : 0 });
        console.log('finished playing2');
        SoundPlayer.stop();
        clearInterval(this.interval);
        try {
            _onFinishedPlayingSubscription.remove();
            _onFinishedLoadingSubscription.remove();
            _onFinishedLoadingURLSubscription.remove();
            _onFinishedLoadingFileSubscription.remove();
        }catch(e){
            //console.log(e);
        }
      }

    parentSaveRemainTime(time) {
        //console.log('parentSaveRemainTime : ', time);     
        this.setState({ remainTime : time });
    }

    choiceAnswer = (data) => {
        //console.log('choiceAnswer : ', data);        
        this.setState({ choiceSeq : data });
    }
    
    setNowSeq = (sdata) => {
        this.setState({ nowSeq : sdata })
    }

    prevPage = (data) => {
        console.log('prevtPage : ', data);        
        this.setNowSeq(data);
        if ( (this.state.items.length) > data) {
            this.setState({ isNextPage : true });
        }else{
            this.setState({ isNextPage : false });
        }
        if ( data > 1) {
            this.setState({ isPrevPage : true });
        }else{
            this.setState({ isPrevPage : false });
        }
        this.setState({ choiceSeq : null });
        

    }

    nextPage = (data) => {
        console.log('nextPage : ', data);  
        console.log('(this.state.items.length+1) : ', (this.state.items.length+1));        
        this.setNowSeq(data);    
        if ( (this.state.items.length) > data) {
            this.setState({ isNextPage : true });
        }else{
            this.setState({ isNextPage : false });
        }
        if ( data > 1) {
            this.setState({ isPrevPage : true });
        }else{
            this.setState({ isPrevPage : false });
        }
        this.setState({ choiceSeq : null });
          
    }

    tempSave = () => {
        console.log('tempSave');
        Alert.alert(
            "임시저장",
            "현재까지 풀이 내역이 저장되었습니다 \n 이후 저장한 풀이부터 이어풀기를 진행하실 수 있습니다.",
            [
                {text: 'OK', onPress: () => null}
                
            ],
            { cancelable: true }
        )
    }

    sendAnswer = () => {
        console.log('sendAnswer');

        let RemainItems = this.state.selectTab === true ? this.state.items : this.state.items.filter(data => data.yourAnswer === null);
        if ( RemainItems.length > 0 ) {

            Alert.alert(
                "미입력 답안 제출하기",
                RemainItems.length + "개의 미입력 답안이 존재합니다.\n 현재까지 풀이 내역을 제출하시겠습니까?.",
                [
                    {text: '아니오', onPress: () => null},
                    {text: '제출하기', onPress: this._reportAnswer.bind(this)},
                    
                ],
                { cancelable: true }
            )

        }else{

        }
    }
 
    _reportAnswer = () => {

        //레포터 제출 백엔드 처리후 
        const alerttoast = Toast.show('정상적으로 제출되었습니다.');
            setTimeout(() => {
                Toast.hide(alerttoast);
                this.props.screenState._returnTopPage()
            }, 2000)
        
    }
    playLoadFile = (mp3url) =>{
        try {
          //SoundPlayer.playSoundFile('engagementParty', 'm4a');
          SoundPlayer.loadUrl(mp3url);    
          this.setState({ nowMp3Playing : 'R' });      
        } catch (e) {
          alert('Cannot play the file')
          console.log('cannot play the song file', e)
        }
    }

    playSong = (mp3url) =>{
        try {
          //SoundPlayer.playSoundFile('engagementParty', 'm4a');
          //SoundPlayer.playUrl(mp3url);
          SoundPlayer.play();
          this.setState({ nowMp3Playing : 'S' });
          setTimeout(() => {
            this._setinterval();
        }, 500);
        } catch (e) {
          alert('Cannot play the file')
          console.log('cannot play the song file', e)
        }
    }
    
    getInfo = async() => { 
        try {
            const info = await SoundPlayer.getInfo() 
            console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
            this.setState({ 
                nowMp3CurrentTime : info.currentTime,
                nowMp3Duration : info.duration 
            });

            
            
        } catch (e) {
            console.log('There is no song playing', e)
        }
    }

    _setinterval= async() => {
        console.log('this.state.isload',this.state.nowMp3Playing );
        if ( this.state.nowMp3Playing == 'P' || this.state.nowMp3Playing == 'S') {
            this.interval = setInterval(() => {
                this.getInfo();
                
            },1000 );
        }else{
            clearInterval(this.interval);
        }
        
    }
    
    onPressPlayButton = async() => {       
        this.playSong()
    }

    onPressMp3LoadButton = async(mp3url) => {
        console.log('Tmp23url', mp3url)
        this.setState({ nowMp3Url : mp3url });
        this.playLoadFile(mp3url);
        this.getInfo();
    }

    onPressPlayButtonPause = async() => {
        
        if ( this.state.nowMp3Playing ) {
            SoundPlayer.pause();
            clearInterval(this.interval);
            console.log('Tmp23url pause');
            this.setState({ nowMp3Playing : 'P' });
        }else{
            
            SoundPlayer.resume();
            this.setState({ nowMp3Playing : 'S' });
            console.log('Tmp23url resume');
        }

        
    }

    renderContent = () => {
        let items2 = this.state.items.filter(data => data.seq === this.state.nowSeq);
        return (
            <View style={styles.contentContainer}>
                <View style={styles.fixedTop}>
                    <Text>===Answer===</Text>
                </View>

                {
               
                items2[0].example.map((answerList,index) => {
                    return (            
                        <View style={styles.NewAnswerWrap} key={index} >
                            <View style={styles.AnswerWrapLeft}>
                                <Text>
                                    ({answerList.seq2}) {answerList.descript}
                                </Text>
                            </View>    
                            <View style={styles.AnswerWrapRight}>
                            <CheckBox
                                    containerStyle={styles.rememberMe}                                            
                                    checkedIcon="dot-circle-o"
                                    uncheckedIcon="circle-o" 
                                    readOnly
                                    checked={this.state.choiceSeq === answerList.seq2 && true }
                                    onPress= {()=> this.choiceAnswer(answerList.seq2)}
                                />
                            </View>
                        </View>
                        )
                    })
               
                    
                } 
            </View>
        )
      }
    
    render() { 

        const NextPage=(next)=>{
            console.log('next',next);
            return (<TouchableHighlight onPress= {()=> this.nextPage(next.choice)}>
                <Text style={[CommonStyle.font16,CommonStyle.textCenter]}>다음 {">"} </Text></TouchableHighlight>
            )
        }

        const PrevPage=(prev )=>{
            return (<TouchableHighlight onPress= {()=> this.prevPage(prev.choice)}>
                <Text style={[CommonStyle.font16,CommonStyle.textCenter]}>{"<"} 이전 </Text></TouchableHighlight>
            )
        }

        let items2 = this.state.items.filter(data => data.seq === this.state.nowSeq);        
        return (
            <View style={styles.container}>
                <View style={styles.headerWrap}> 
                    {
                        this.state.isTimerRoad ?
                        <TimerScreen screenState={this.state} screenProps={this.props}/>
                        :
                        <ActivityIndicator size="large" />
                    }                    
                    
                </View>   
                {
                this.props.screenState.isAnswerMode
                ?
                <AnswerScreen />
                :
                <View style={styles.MainContainer}>
                    <View style={styles.MainContainer}>
                        <ScrollView >
                            { ( items2[0].mode == 'LC' && items2[0].mp3url  ) &&
                                <View style={[styles.QuestionHeader,{flexDirection : 'row', padding : 10, backgroundColor : '#ddd'}]}>  
                                    <View style={{flex : 1,paddingTop :5 }}>
                                        { 
                                        this.state.nowMp3Playing === 'S' ?
                                            <Icon 
                                        name='pause' size={30} color="#888" style={{textAlign : 'right', paddingRight:10}} 
                                        onPress={() => this.onPressPlayButtonPause()} />                            
                                        :
                                        this.state.nowMp3Playing === 'R' || this.state.nowMp3Playing === 'P' ?
                                            <Icon 
                                            name='play' size={30} color="#888" style={{textAlign : 'right', paddingRight:10}} 
                                            onPress={() => this.onPressPlayButton()} /> 
                                            :                                    
                                            <Icon 
                                            name='headphones' size={30} color="#888" style={{textAlign : 'right', paddingRight:10}} 
                                            onPress={() => this.onPressMp3LoadButton(items2[0].mp3url)} /> 
                                        }
                                        
                                    </View>
                                    <View style={{flex : 1 }}>
                                        <Text style={[CommonStyle.font12,CommonStyle.textCenter,{paddingTop:12}]}>
                                            {this.state.nowMp3CurrentTime.toFixed(1)}
                                        </Text>
                                    </View>
                                    <View style={{flex : 4 }}>
                                        <Slider
                                            value={this.state.nowMp3CurrentTime}
                                            onValueChange={value => this.setState({ nowMp3CurrentTime : value })}
                                            thumbStyle={{width:15,height:15}}
                                            thumbTintColor="#ccc"
                                            step={1}
                                            minimumValue={0}
                                            maximumValue={this.state.nowMp3Duration}
                                            //disabled={this.state.nowMp3Url ? true : false}
                                        />
                                    </View>
                                    <View style={{flex : 1 }}>
                                        <Text style={[CommonStyle.font12,CommonStyle.textCenter,{paddingTop:12}]}>
                                            {this.state.nowMp3Duration.toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            }
                            <View style={[styles.QuestionHeader]}>  
                                <Text 
                                    style={[CommonStyle.font16,{padding : 20}]}>
                                    Questions : {items2[0].seq}{"\n"}{"\n"}                            
                                    {items2[0].descript}{"\n"}
                                    {items2[0].descript}{"\n"}
                                    {items2[0].descript}{"\n"}
                                    {items2[0].descript}{"\n"}
                                    {items2[0].descript}{"\n"}
                                </Text>
                            </View>
                            <View style={{width:'100%', height : 50}} ></View>

                            
                        </ScrollView>
                        
                        
                    </View>
                     { items2[0].AnswerType === 'multi' &&
                    <BottomDrawer
                        //containerHeight={(items2[0].example.length)*80}
                        containerHeight={Platform.OS === 'android' ? 300 : (items2[0].example.length)*80}                        
                        offset={Platform.OS === 'android' ? 185 : 175}
                        startUp={false}              
                        backgroundColor='#fff'          
                        //onExpanded = {() => {console.log('expanded')}}
                        //onCollapsed = {() => {console.log('collapsed')}}                        
                    >
                        {this.renderContent()}
                    </BottomDrawer>
                    }
                    
                    <View style={styles.footerWrap}>  
                        <View style={styles.headerTitle}>
                            <View style={styles.itemAnswerWrap}>
                                {
                                items2[0].AnswerType === 'multi' ?
                                items2.map((data) => {
                                    let exampleList2 = data.example;                                
                                    return (                                    
                                        exampleList2.map((answerList,index2) => {
                                            return (            
                                                <View style={styles.itemWrap}>
                                                    <View key={index2} style={answerList.seq2 === data.yourAnswer || answerList.seq2 === this.state.choiceSeq ? styles.textCheckAnswer : styles.textAnswer}>
                                                        <Text 
                                                            style={[CommonStyle.font16,CommonStyle.textCenter,answerList.seq2 === data.yourAnswer || answerList.seq2 === this.state.choiceSeq && CommonStyle.textWhite,{paddingVertical:5}]}
                                                            onPress= {()=> this.choiceAnswer(answerList.seq2)}>
                                                            {answerList.seq2}
                                                        </Text>
                                                    </View>    
                                                </View>
                                                )
                                            })
                                        
                                    )
                                })
                                :
                                <View style={styles.itemWrap} >
                                    <TextInput
                                        placeholder='주관식 답안을 입력해 주세요. (띄어쓰기 유의 )'
                                        style={{ height: '100%', width : '96%',borderColor: 'gray', borderWidth: 1 ,backgroundColor : '#fff'}}
                                    />
                                </View>

                            }

                            </View>
                        </View>
                        <View style={styles.headerTitle}>
                            <View style={[{flex:1,flexDirection :'row',width:'90%',alignItems: 'center',justifyContent: 'center',textAlign: 'center',}]}> 
                                <View style={[{flex:1,height:40,alignItems: 'center',justifyContent: 'center',textAlign: 'center',}]}> 
                                    { this.state.isPrevPage && <PrevPage choice={this.state.nowSeq-1} /> }                                
                                </View>
                                <View style={[{flex:5,height:40,alignItems: 'center',justifyContent: 'center',textAlign: 'center',}]}> 
                                    <Text style={[CommonStyle.font16,CommonStyle.textCenter]}>
                                        {this.state.nowSeq} / {this.state.items.length}
                                    </Text>
                                </View>
                                <View style={[{flex:1,height:40,alignItems: 'center',justifyContent: 'center',textAlign: 'center',}]}> 
                                    { this.state.isNextPage && <NextPage choice={this.state.nowSeq+1} /> }  
                                </View>
                            </View>
                        </View>    
                    </View>
                    
                    
                </View>
            }
            </View>
        )        
    }
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    MainContainer : {            
        flex : 1,
        minHeight : 100
    },
    QuestionHeader : {
        flex : 1,
        width: '100%',
    },
    QuestionAnswer : {
        flex : 1,
        width: '100%',
    },
    
    headerWrap: {            
        width: '100%',
        height: 90,
        backgroundColor: '#ebebeb',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
    },
    headerTitle: {            
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height : 45,
        width: '100%'
    },
    ButtonWrap : {  
        flex : 1,      
        flexDirection : 'row'
    },
    itemAnswerWrap : {     
        flexDirection : 'row',
        height:50,
        borderBottomWidth : 1,
        borderBottomColor : '#bbb'
    },
    itemWrap: {    
        flex : 1,        
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        paddingVertical : 5,
    },
     textAnswer : {
        width: 30,
        height : 30,
        borderRadius : 15,
        backgroundColor : '#ebebeb'
    },
    textCheckAnswer : {
        width: 30,
        height : 30,
        borderRadius : 15,
        backgroundColor : '#888'
    },
   
    footerWrap: {       
        //position : 'absolute',
        //bottom : 0,
        //left : 0,
        width: '100%',
        height: 100,
        backgroundColor: '#ddd',
        
    },
    rememberMe: {
        flex: 1,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex : 0.6,
        alignItems: 'center',        
        backgroundColor : '#fff',
        borderTopColor : '#ccc',
        borderTopWidth : 1,
        bottom:0
    },
    fixedTop : {
        width: '100%',
        height : 30,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        backgroundColor : '#ccc'
    },
    NewAnswerWrap: {    
        flex : 1,
        flexDirection : 'row',
        paddingLeft : 30,
        paddingRight : 10,
        paddingTop : 10,
        
    }, 
    AnswerWrap: {    
        flex : 1,
        flexDirection : 'row',
        paddingLeft : 30,
        paddingRight : 10,
        paddingVertical : 10,
       
    },
    
    AnswerWrapLeft : {
        flex : 5
    },
    AnswerWrapRight : {
        flex : 1
    },

});

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        remainTime: state.GlabalStatus.remainTime,           
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusRemainTime:(num) => {
            dispatch(ActionCreator.updateStatusRemainTime(num));

        }
    };
}

PracticeScreen.propTypes = {
    selectBook: PropTypes.object,   
    remainTime: PropTypes.number,   
};

export default connect(mapStateToProps, mapDispatchToProps)(PracticeScreen);
/*
<View style={[styles.QuestionAnswer]}>  
    {items2[0].example.map((answerList,index) => {
        return (            
            <View style={styles.AnswerWrap} key={index} >
                <View style={styles.AnswerWrapLeft}>
                    <Text>
                        ({answerList.seq2}) {answerList.descript}
                    </Text>
                </View>    
                <View style={styles.AnswerWrapRight}>
                <CheckBox
                        containerStyle={styles.rememberMe}                                            
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o" 
                        readOnly
                        checked={this.state.choiceSeq === answerList.seq2 && true }
                        onPress= {()=> this.choiceAnswer(answerList.seq2)}
                    />
                </View>
            </View>
            )
        })
    }
</View>
*/