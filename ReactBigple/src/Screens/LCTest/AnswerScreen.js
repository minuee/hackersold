import React from 'react';
import {StyleSheet,View,Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import CommonStyle from '../../Styles/CommonStyle'

export default class AnswerScreen extends React.Component {

    constructor(props) {       
        super(props);
    
        this.state  = {
            selectTab : true,
            selectSeq : null,
            playStatus : null,
            playSeq : null,
            items : [
                { seq : 1 , 
                  mode : 'LC',
                  mp3url : 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3',
                  example : [
                        {seq2 : 'A',descript : 'accommodated'},
                        {seq2 : 'B',descript : 'accommodates'},
                        {seq2 : 'C',descript : 'accommodating'},
                        {seq2 : 'D',descript : 'accommodations'},
                  ]
                  ,keyAnswer :'A',yourAnswer : 'A',isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 2 , 
                    mode : 'LC',
                    mp3url : 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac',
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ]
                    ,keyAnswer :'A',yourAnswer : 'B',isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
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
                    ]
                    ,keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 4, 
                    mode : 'RC',
                    mp3url : null,
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ]
                    ,keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                },
                { seq : 5, 
                    mode : 'RC',
                    mp3url : null,
                    example : [
                          {seq2 : 'A',descript : 'accommodated'},
                          {seq2 : 'B',descript : 'accommodates'},
                          {seq2 : 'C',descript : 'accommodating'},
                          {seq2 : 'D',descript : 'accommodations'},
                    ]
                    ,keyAnswer :'A',yourAnswer : null,isSelect :true,descript :'Delegates attending the international trade convention were provided with overnight -------- at Hotel California' 
                }           
            ]
        }
    }


    changeTabs = async(newvalue) => {
        this.setState({ selectTab:newvalue });
    }

    onPressPlayButton = async(pstatus,seq) => {       
        console.log('onPressPlayButton',pstatus)
        if ( pstatus === null ) {
            this.setState({
                playStatus:true ,
                playSeq:seq 
            });
        }else{
            const alerttoast = Toast.show('현재 다른 파일이 재생중입니다');
            setTimeout(() => {
                Toast.hide(alerttoast)
            }, 2000)

        }
    }

    onPressPauseButton = () => {
        this.setState({
            playStatus:null,
            playSeq:null
        });
    }

    render() {   
        
        
        let items2 = this.state.selectTab === true ? this.state.items : this.state.items.filter(data => data.yourAnswer === null);

        
        return (
            <View style={styles.container}>
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
                <ScrollView style={styles.MainContainer}>
                
        <View
          style={{
            display: 'flex',
            
            justifyContent: 'center',
          }}
        >
                    {items2.map((data,index) => {
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
                                            <View style={answerList.seq2 === data.yourAnswer ? styles.textCheckAnswer : styles.textAnswer}>
                                                <Text style={[CommonStyle.font16,CommonStyle.textCenter,answerList.seq2 === data.yourAnswer && CommonStyle.textWhite,{paddingVertical:5}]}>
                                                    {answerList.seq2}
                                                </Text>
                                            </View>
                                        </View>
                                       )
                                    })}
                                </View>
                                <View style={styles.itemSeq}>
                                    { 
                                        data.mode === 'LC' ?
                                        <View style={styles.textCheckAnswer2}>
                                            {
                                                this.state.playStatus && this.state.playSeq === data.seq 
                                                ?
                                                <Icon name='pause' size={20} color="#fff" onPress={() => this.onPressPauseButton()} /> 
                                                :
                                                <Icon name='headphones' size={20} color="#fff" onPress={() => this.onPressPlayButton(this.state.playStatus,data.seq)} /> 
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
        )        
    }
   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    MainContainer : {            
        flex : 1,
        minHeight : 100,
        
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
        flexDirection : 'row'
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
        width: 30,
        height : 30,
        borderRadius : 15,
        backgroundColor : '#ebebeb'
    },
    textCheckAnswer : {
        width: 30,
        height : 30,       
        borderRadius : 15,
        backgroundColor : '#555',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textCheckAnswer2 : {
        width: 30,
        height : 30,       
        backgroundColor : '#555',
        alignItems : 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }

});
