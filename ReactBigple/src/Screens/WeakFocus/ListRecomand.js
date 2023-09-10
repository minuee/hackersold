import React, {Component} from 'react';
import {StyleSheet, Text, View,Dimensions,TouchableOpacity,Modal,Alert,SafeAreaView,ScrollView} from 'react-native';

import { Button } from 'react-native-elements';
import CommonStyle from '../../Styles/CommonStyle'
const {width: SCREEN_WIDTH} = Dimensions.get("window");

import SubjectScreen from './SubjectScreen';
import SetupPremiumScreen from './SetupPremiumScreen';

export default class ResultScreen extends Component {

    constructor(props) {
        super(props);                
        
        this.state = {
            parentsecondSelectTab : this.props.screenState.secondSelectTab,
            modalVisible : false,
            loading : false,  
            childloading : false,               
            nowItem : null, 
            items : [
                { seq :1, subject: '준동사구',part: '(Part5)', },
                { seq :2, subject: '어휘',part: '(Part6)', },
                { seq :3, subject: '주제/목적 찾기',part: '(Part7)', },
               
              ],
            setupItems : [ 
                {
                    index : 1 , title : '회자/청자 및 장소 문제' , part : 'PART1' , percentage : 50,ischecked :false
                },
                {
                    index : 2 , title : '특정 세부 사항' , part : 'PART2' , percentage : 50,ischecked :false
                },
                {
                    index : 3 , title : '이유/방법/정도 문제' , part : 'PART3' , percentage : 50,ischecked :false
                },
                {
                    index : 4 , title : '기타 의문문' , part : 'PART4' , percentage : 50,ischecked :false
                },
                {
                    index : 5 , title : '요청/제안/언급 문제' , part : 'PART5' , percentage : 50,ischecked :false
                },
                {
                    index : 6 , title : '의문사 의문문' , part : 'PART6' , percentage : 50,ischecked :false
                },
                
            ],
           
        }        
       
    }

    selectItems = (sitem) => {
        console.log('sitem',sitem)
        this.setState({ 
            nowItem : sitem,
            childloading : true
         });

         setTimeout(
            () => {
                this.setState({ childloading: false});
                this.forceUpdate();
            },500)
    }

    openModal = () => {        
        this.setState({ modalVisible: true});         
    }
    
    setupData = () => {
       console.log('setupData');

       let checkedItems = this.state.items.filter(data => data.ischecked === true);
       console.log('checkedItems', checkedItems.length);
       if ( checkedItems.length === 0 ) {

        Alert.alert(
            "선택결과",
            "분석 결과를 보고자 하는 테스트를 1개이상 선택해 주세요",
            [
                {text: 'OK', onPress: () => null},
            ],
            { cancelable: true }
        )
       }else{

            Alert.alert(
                "선택결과",
                "선택하신 테스트를 설정완료하시겠습니까",
                [
                    {text: '아니오', onPress: () => null},
                    {text: '예', onPress: this._setupData.bind(this)},
                    
                ],
                { cancelable: true }
            )
       }
       
    }

    _setupData = () => {
        console.log('_setupData');

        setTimeout(
            () => {
                this.setState({ modalVisible: false});
            },100)
    }
   
    render() {

        const SetupModal=()=>{            
            return (
                <View style={styles.popup}>
                    <View style={styles.popupHeader}>                                    
                        <Text style={styles.txtTitle}>프리미엄 학습 유형 추가</Text>
                    </View>
                    <View style={styles.popupContent}>
                        <ScrollView contentContainerStyle={styles.modalInfo}>
                            <SetupPremiumScreen screenState={this.state} />
                            
                        </ScrollView>
                    </View>
                    <View style={styles.popupButtonWrapper}>
                        <View style={styles.popupButtons}>
                            <Button                                
                                title="설정완료"
                                type='outline'
                                buttonStyle={{width:SCREEN_WIDTH*0.8, backgroundColor : '#173f82' }}
                                titleStyle={{color:'#fff'}}
                                onPress= {()=> this.setupData()}
                            /> 
                        </View>
                        <View style={styles.popupButtons}>
                            <Button                                
                                title="나가기"
                                type='outline'
                                buttonStyle={{width:SCREEN_WIDTH*0.8}}
                                onPress={() => {                                    
                                    this.setState({modalVisible :false});
                                    
                                }}
                            /> 
                        </View>                                    
                    </View>
                </View>
                )
        }

        return (
            <View style={styles.container}>
                <View style={styles.firstWrapper}>       
                {
                    this.state.items.map((item, index) => {
                        return(
                            <View key={index} style={[styles.graphWrap,item.seq === this.state.nowItem && styles.selectGraphWrap,{height:60}]}>
                                <TouchableOpacity onPress= {()=> this.selectItems(item.seq)}>
                                    <Text style={[styles.title,item.seq === this.state.nowItem && CommonStyle.textWhite]}>
                                        {item.subject}{"\n"}{item.part}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }                          
                </View> 

                <View style={styles.firstWrapper}>   
                    <View style={[styles.graphWrap,{height:35,backgroundColor : '#ebebeb'}]}>
                        <TouchableOpacity 
                            onPress= {()=> this.openModal()}>
                            <Text style={styles.title2}>
                                프리미엄 서비스 신청으로 더 많은 유형학습을 경험해 보세요
                            </Text>
                        </TouchableOpacity>
                    </View>      
                </View>
                {
                    this.state.nowItem > 0 && 
                    <SubjectScreen screenState={this.state} screenProps={this.props.screenProps} />
                    
                }
                <View>
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        onRequestClose={() => this.setState({modalVisible :false})}
                        visible={this.state.modalVisible}>
                        <SafeAreaView style={styles.popupOverlay}>
                            <SetupModal />
                        </SafeAreaView>
                        
                    </Modal>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    firstWrapper : {        
        backgroundColor : "#fff",
        flex:1,
        width:'100%',        
        flexDirection : 'row',
        padding:5,        
    },
    graphWrap : {
        flex:1,            
        backgroundColor : "#fff",
        borderWidth:1,
        borderColor : '#ccc',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor : '#aaa',
        borderWidth : 1
    },
    selectGraphWrap : {        
        backgroundColor : "#aaa",        
    },
    headerTitle: {
        height:40,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        flexDirection : 'row'
    },
    heaerTabs :  {
        flex:1,
        paddingVertical:9,
        borderBottomColor : '#ccc',
        borderBottomWidth : 1
    },
    seletetab : {
        backgroundColor: '#fff',
        color : '#bbb',
        
    },
    title: {
        fontSize: 14,
        fontWeight : 'bold',
        textAlign: 'center',
        color: '#555'
    },
    title2: {
        fontSize: 11,
        textAlign: 'center',
        color: '#555'
    },
    /************ modals ************/
    popup: {
        flex:1,
        backgroundColor: 'white',
        //marginTop: 5,
        height : '100%',        
        //marginHorizontal: 5,
        borderRadius: 1,
    },
    popupOverlay: {
        backgroundColor: "#555",
        flex: 1,
        /*marginTop: Platform.select({
            ios : deviceName === 'iPhone X' ? 50 : 0,
            android : 0
        }),
        */
    },
    popupContent: {
        //alignItems: 'center',
        flex :1,
        margin: 5,        
    },
    popupHeader: {
        height : 50,        
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
        backgroundColor : '#173f82',        
        borderBottomWidth :1,
        borderBottomColor : '#bbb'
    },
    popupButtonWrapper: {
        height : 100,
        backgroundColor : '#fff',
        alignItems:'center',
        justifyContent:'center',
        borderTopWidth: 1,
        borderTopColor: "#bbb",
        marginBottom :10
    },

    popupButtons : {
        flex:1,
        width:'100%',        
        justifyContent: 'space-around',
        alignItems: 'center',        
    },
    popupButton: {
        flex: 1,
        marginVertical: 16
    },
    btnClose:{
        height:20,
        backgroundColor:'#20b2aa',
        padding:20
    },
    modalInfo:{
        alignItems:'center',
        justifyContent:'center',
    },
    txtTitle : {
        color:'#fff',
        fontSize: 17
    }
   
});
