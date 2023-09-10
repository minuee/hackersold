import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    SafeAreaView,
    Modal,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import {NavigationActions,StackActions} from 'react-navigation';
import { Button } from 'react-native-elements';
const {width: SCREEN_WIDTH} = Dimensions.get("window");
//import {NavigationEvents,NavigationActions,StackActions} from 'react-navigation';


import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import CommonStyle from '../../Styles/CommonStyle'

import ResultScreen from './ResultScreen'; //그래프결과영역
import RecomandScreen from './RecomandScreen';  //맞춤영역 취약유형 + 도전유형
import EmptyResultScreen from '../../Components/EmptyResultScreen'; //아직 푼 이력이 없을경우
import SetupAnalystScreen from './SetupAnalystScreen'; //분석대상선택 모달

//무료 모의고사 풀기 클릭시 홈으로 이동 
const resetHomeAction = StackActions.reset({
    index: 0,
    key : null,    
    actions: [NavigationActions.navigate({routeName : 'MainScreen'})],
});
//교재풀이페이지를 초기로 설정
const resetQuestionAction = StackActions.reset({
    index: 0,
    key : null,    
    actions: [NavigationActions.navigate({routeName : 'QuestionScreen'})],
});

class ToeicScreen extends React.Component {

    
    constructor(props) {
        super(props);                
        
        this.state = {
            loading : false,
            thisFocus : this.props.screenState.thisFocus,
            focusTab : this.props.screenState.focusTab,   
            firstselectTab : true,    
            modalVisible : false,
            nav_home : this.nav_home.bind(this),
            nav_test : this.nav_test.bind(this),
            items : [ 
                {
                index : 1 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 100,ischecked :false
                },
                {
                    index : 2 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 200,ischecked :false
                },
                {
                    index : 3 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 333,ischecked :false
                },
                {
                    index : 4 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 444,ischecked :false
                },
                {
                    index : 5 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 555,ischecked :false
                },
                {
                    index : 6 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 666,ischecked :false
                },
                {
                    index : 7 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/middle100_champ_sub_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',point : 777,ischecked :false
                },
                {
                    index : 8 , bannerurl : 'https://gscdn.hackers.co.kr/champ/files/banner/imglib_files/banner/imglib/tosopic_300_640x400.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '11강',point : 888,ischecked :false
                }
            ],
           
        }        
       
       
    }


    UNSAFE_componentWillMount() {
        console.log('toeic UNSAFE_componentWillMount');
      
        this.setState({ 
            loading: true,   
            firstselectTab : true,              
        });
        
       
    }    

    componentDidMount() {        
        console.log('toeic componentDidMount');    
        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

    UNSAFE_componentWillUnmount() {
        console.log('toeic UNSAFE_componentWillUnmount');    
        
    }  

    changeTabs = async(newvalue) => {
        this.setState({
             firstselectTab:newvalue,
             loading: true,
        });

        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

    openModal = () => {        

        //console.log("xx : ",this.props.screenProps.navigation);
        //this.props.screenProps.navigation.navigate('SignInScreen');
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
   

    //무료 모의고사 풀기 클릭시 메인 > 홈으로 이동
    nav_home = () => {
        this.props.screenProps.navigation.dispatch(resetHomeAction);
        //this.props.screenProps.navigation.navigate('NavHomeScreen', {isVal : 1111 });
    }
    // 교잴풀기 클릭시 문제 풀이 페이지 이동
    nav_test = () => {
        //this.props.screenProps.navigation.dispatch(resetQuestionAction);
        this.props.screenProps.navigation.navigate('QuestionScreen', { lectureNo : 1 , theme :'TESTTTTT' });
    }

    render() {


        const SetupModal=()=>{            
            return (
                <View style={styles.popup}>
                    <View style={styles.popupHeader}>                                    
                        <Text style={styles.txtTitle}>분석대상 선택</Text>
                    </View>
                    <View style={styles.popupContent}>
                        <ScrollView contentContainerStyle={styles.modalInfo}>
                            <SetupAnalystScreen screenState={this.state} screenProps={this.props.screenProps}/>
                            
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
       
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return (
                <View style={styles.container}>
                    
                    <View style={styles.headerTitle}>           
                        <View style={[styles.heaerTabs,this.state.firstselectTab  && styles.seletetab]}>
                            <Text 
                                style={[CommonStyle.font16,CommonStyle.textCenter]}
                                onPress= {()=> this.changeTabs(true)}
                                >
                                RC
                            </Text>
                        </View>
                        <View style={[styles.heaerTabs,!this.state.firstselectTab && styles.seletetab]}>
                            <Text 
                                style={[CommonStyle.font16,CommonStyle.textCenter]}
                                onPress= {()=> this.changeTabs(false)}
                            >
                                LC
                            </Text>
                        </View>
                    </View>
                    <ScrollView>
                        { this.state.firstselectTab ?
                        <View style={styles.firstWrapper}>
                            <View style={styles.selectContainer}>
                                <Button                                
                                    title="분석 대상 선택"
                                    type='solid'
                                    buttonStyle={{backgroundColor : '#aaa'}}
                                    onPress= {()=> this.openModal()}
                                />                    
                            </View>
                            <ResultScreen screenProps={this.props} screenState={this.state} />
                            <RecomandScreen screenProps={this.props} screenState={this.state} />
                            
                            
                        </View> 
                        :
                        <View style={styles.firstWrapper}>
                            <EmptyResultScreen screenState={this.state} />

                        </View>
                        }
               
                    </ScrollView>
                    <View >
                        <Modal
                            animationType={'fade'}
                            transparent={true}
                            onRequestClose={() => this.setState({modalVisible :false})}
                            visible={this.state.modalVisible}>
                            <SafeAreaView style={styles.popupOverlay}>
                                <SetupModal />
                            </SafeAreaView>
                            
                        </Modal>
                        {/*
                        <Modal
                            animationType={this.state.animationType}
                            transparentType={this.state.transparentType}
                            visible={this.state.modalVisible}
                            onRequestClose={()=> {
                                Alert.alert('Modal has been close');
                                this.setState({
                                    modalVisible :false
                                })
                            }}
                        >
                            <View style={{marginTop:100}}>
                                <Text>Hello World!!!!!</Text>
                                <TouchableHighlight
                                    onPress={()=> {this.setModalVisible_slide(!this.state.modalVisible)}}
                                >
                                    <Text>Close Modal!</Text>
                                </TouchableHighlight>
                            </View>
                        </Modal>
                        */}
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        width:'100%',
        backgroundColor : "#ccc",
    },    
    backgroundImage:{        
        flex:1,
        width: '100%',        
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.7
    },
   
    selectContainer : {
        flex:1,
        width:'100%',
        padding : 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    firstWrapper : {        
        backgroundColor : "#fff",
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
        borderBottomColor : '#fff',
        borderBottomWidth : 1
    },
    seletetab : {
        backgroundColor: '#fff',
        color : '#bbb',
        
    },
    /************ modals ************/
    popup: {
        flex:1,
        backgroundColor: 'white',
        marginTop: 5,
        height : '100%',        
        //marginHorizontal: 5,
        borderRadius: 5,
    },
    popupOverlay: {
        //backgroundColor: "#555",
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
        borderBottomColor : '#173f82'
    },
    popupButtonWrapper: {
        height : 100,
        backgroundColor : '#fff',
        alignItems:'center',
        justifyContent:'center',
        borderTopWidth: 1,
        borderTopColor: "#ccc",
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


function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        remainTime: state.GlabalStatus.remainTime,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusSelectBook:(object) => {
            dispatch(ActionCreator.updateStatusSelectBook(object));

        }
    };
}

ToeicScreen.propTypes = {
    selectBook: PropTypes.object,
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(ToeicScreen);
