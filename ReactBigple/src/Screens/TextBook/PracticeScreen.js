import React from 'react';
import {StyleSheet,View,Text,Dimensions,Animated, ScrollView, TouchableHighlight,Alert,ActivityIndicator} from 'react-native';
import 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements';
//import AsyncStorage from '@react-native-community/async-storage';
import SoundPlayer from 'react-native-sound-player';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';

import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle'
import TimerScreen from './TimerScreen';


const {width: SCREEN_WIDTH} = Dimensions.get("window");

const TAB_BAR_HEIGHT = 40;
const HEADER_HEIGHT = 40;

class PracticeScreen extends React.Component {

    constructor(props) {       
        super(props);
        //console.log('Practice',this.props);
        this.state  = {     
            selectTab : true,       
            isTimerRoad : false,
            remainTime : 0,
            playSeq : null,
            nowMp3Url : null,            
            nowMp3Playing: false,
            nowSeq : this.props.screenState.nextProblem ? this.props.screenState.nextProblem : 1,
            choiceSeq : null,
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
                } ,
                { seq : 6, 
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
                } ,
                { seq : 7, 
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
                },
                { seq : 8, 
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
                } ,
                { seq : 9, 
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
                } ,
                { seq : 10, 
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
                } ,
                { seq : 11, 
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
                } ,
                { seq : 12, 
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
                } ,
                { seq : 11, 
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
                } ,
                { seq : 13, 
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
                } ,
                { seq : 14, 
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
                } ,
                { seq : 15, 
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
            ],
            items2 : []
        }

        try {
            _onFinishedPlayingSubscription = null;
            _onFinishedLoadingSubscription = null;
            _onFinishedLoadingFileSubscription = null;
            _onFinishedLoadingURLSubscription = null;
        }catch(e) {
        }
    }
    
    
    UNSAFE_componentWillMount() {        
        this.getStorageData();
    }   

 
    getStorageData = async () => {
        if ( this.props.remainTime === 0 || this.props.remainTime === undefined ) {
            this.setState({remainTime: 60*75});
        }else{
            this.setState({remainTime: this.props.remainTime});
        }      
    }
    
    componentDidMount() {     
        this.setState({items2 : this.state.items});
        this.setState({ isTimerRoad : this.props.screenState.selectTimer });
        const scrollToY = this.props.screenState.selectIngParts ?  this.props.screenState.selectIngParts : 0;
        setTimeout(() => {
            this.refs.scrollView.scrollTo({x: 0, y: scrollToY*50, animated: true });
        },10)
    }

    componentWillUnmount() {
        this.setState({ nowMp3Playing : false });
        console.log('finished playing2');
        SoundPlayer.stop();        
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
        this.setState({ remainTime : time });
    }

    choiceAnswer = (data) => {        
        this.setState({ choiceSeq : data });
    }
    
    setNowSeq = (sdata) => {
        this.setState({ nowSeq : sdata })
    }

    setMyanswer = async(index,mycheck) => {
        this.state.items[index].yourAnswer = mycheck;
    }

    checkAnswer = async(index,mycheck) => {
        if ( this.state.selectTab ) {
            await this.setMyanswer(index,mycheck);
            this.setState({items2 : this.state.items});
        }
    }

    resetPlay = async() =>{
        SoundPlayer.stop();        
        try {
            _onFinishedPlayingSubscription.remove();
            _onFinishedLoadingSubscription.remove();
            _onFinishedLoadingURLSubscription.remove();
            _onFinishedLoadingFileSubscription.remove();
        }catch(e){
            //console.log(e);
        }
    }

    playLoadFile = async(mp3url) =>{

        await this.resetPlay();
        try {          
          SoundPlayer.loadUrl(mp3url);    
          this.setState({ nowMp3Playing : 'R' });      
        } catch (e) {
          alert('Cannot play the file')
          console.log('cannot play the song file', e)
        }
    }

    playSong = async() =>{
        try {
            SoundPlayer.play();

            this.setState({ nowMp3Playing : 'S' });

            _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
                this.setState({ 
                    nowMp3Playing : false ,
                    playSeq : null
                });
                console.log('finished playing', success);            
            })
            _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {            

            })
            _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener('FinishedLoadingFile', ({ success, name, type }) => {

            })
            _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {            

            }) 
          
        } catch (e) {
          alert('Cannot play the file')
          console.log('cannot play the song file', e)
        }
    }
    
 
    onPressPlayButton = async(seq, mp3url) => {
        
        this.setState({
            playSeq:seq,
            nowMp3Url : mp3url
         });
        
        await this.playLoadFile(mp3url);        
        this.playSong()
    }

    onPressStopButton = async() => {
        SoundPlayer.stop();
        this.setState({ 
            nowMp3Playing : false ,
            playSeq : null
        });
        
    }



    changeTabs = async(newvalue) => {
        await this.setState({ selectTab:newvalue });
        if ( newvalue ) {
            this.setState({items2 : this.state.items});
        }else{
            this.setState({items2 : this.state.items.filter(data => data.yourAnswer === null)});
            setTimeout(() => {
                this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true });
            },10)
        }
        
    }

    sendResult = async() => {         

        let RemainItems = this.state.items.filter(data => data.yourAnswer === null);
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

            Alert.alert(
                "답안 제출하기",
                "풀이 내역을 제출하시겠습니까?.",
                [
                    {text: '아니오', onPress: () => null},
                    {text: '제출하기', onPress: this._reportAnswer.bind(this)},
                    
                ],
                { cancelable: true }
            )

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

        

        return (
            <View style={styles.container}>
                { this.state.isTimerRoad &&
                <View style={styles.headerWrap}> 
                    {
                        this.state.isTimerRoad ?
                        <TimerScreen screenState={this.state} screenProps={this.props}/>
                        :
                        <ActivityIndicator size="large" />
                    }
                </View>   
                }
        
                <View style={styles.MainContainer}>
                    <View style={styles.headerTitle}>           
                        <View style={[styles.heaerTabs,this.state.selectTab  && styles.seletetab]}>
                            <Text 
                                style={[CommonStyle.font16,CommonStyle.textCenter]}
                                onPress= {()=> this.changeTabs(true)}
                                >
                                모든 문항
                            </Text>
                        </View>
                        <View style={[styles.heaerTabs,!this.state.selectTab && styles.seletetab]}>
                            <Text 
                                style={[CommonStyle.font16,CommonStyle.textCenter]}
                                onPress= {()=> this.changeTabs(false)}
                            >
                                미표기 문항
                            </Text>
                        </View>
                    </View>
                    <ScrollView 
                        ref="scrollView"   
                        scrollToOverflowEnabled={true}                      
                    >
                        <View style={{display: 'flex',justifyContent: 'center',}}>
                            {this.state.items2.map((data,index) => {
                                let exampleList = data.example;
                                //console.log("iexampleList", exampleList);
                                return (
                                    <View style={styles.itemWrap} key={index}>
                                        <View style={styles.itemSeq}>
                                            <Text style={[CommonStyle.font16,CommonStyle.textCenter,{paddingVertical:10}]}>{data.seq}.</Text>
                                        </View>
                                        <View style={styles.itemAnswerWrap}>
                                        {exampleList.map((answerList,index2) => {
                                            return (
                                                <View style={styles.itemAnswer} key={index2} >
                                                    <TouchableHighlight 
                                                        onPress={()=> {this.checkAnswer(index,answerList.seq2);}}
                                                    >
                                                        <View style={answerList.seq2 === data.yourAnswer ? styles.textCheckAnswer : styles.textAnswer}>
                                                            <Text style={[CommonStyle.font16,CommonStyle.textCenter,answerList.seq2 === data.yourAnswer && CommonStyle.textWhite,{paddingVertical:5}]}>
                                                                {answerList.seq2}
                                                            </Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                </View>
                                            )
                                            })}
                                        </View>
                                        <View style={styles.itemSeq}>
                                            { 
                                                data.mode === 'LC' ?
                                                <View style={styles.textCheckAnswer2}>
                                                    {
                                                        this.state.playSeq === data.seq 
                                                        ?
                                                        <Icon name='stop' size={20} color="#fff" onPress={() => this.onPressStopButton()} /> 
                                                        :
                                                        <Icon name='headphones' size={20} color="#fff" onPress={() => this.onPressPlayButton(data.seq,data.mp3url)} /> 
                                                    }
                                                </View>
                                                :
                                                <View style={styles.textCheckAnswer}>
                                                    
                                                </View>
                                            }
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>        
                <View style={styles.footerWrap}> 
                    <TouchableHighlight onPress={()=> {this.sendResult()}}>
                        <Text style={{fontSize:20}}>채점하기</Text>
                    </TouchableHighlight> 
                </View>         
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
        height: 45,
        backgroundColor: '#ebebeb',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
    },
    headerTitle: {            
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',        
        padding : 10,
        flexDirection : 'row'
    },
    heaerTabs :  {
        flex:1,
        padding:5,
        borderBottomColor : '#ccc',
        borderBottomWidth : 1
    },
    seletetab : {
        backgroundColor: '#ccc',
        color : '#fff'
    },
    itemWrap: {            
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexDirection : 'row',
        marginVertical : 5
    },
    itemSeq : {
        flex : 1,
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    itemAnswerWrap : {
        flex : 4,
        flexDirection : 'row',        
        height:30
    },
    itemAnswer : {
        flex : 1,
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
        
    },
    textAnswer : {
        width: SCREEN_WIDTH/10,
        height : SCREEN_WIDTH/10,
        borderRadius : SCREEN_WIDTH/20,
        backgroundColor : '#ebebeb',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textCheckAnswer : {
        width: SCREEN_WIDTH/10,
        height : SCREEN_WIDTH/10,       
        borderRadius : SCREEN_WIDTH/20,
        backgroundColor : '#555',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textCheckAnswer2 : {
        width: SCREEN_WIDTH/10,
        height : SCREEN_WIDTH/10,       
        backgroundColor : '#555',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    footerWrap: {       
        //position : 'absolute',
        //bottom : 0,
        //left : 0,
        width: '100%',
        height: 50,
        backgroundColor: '#ddd',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
        
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
