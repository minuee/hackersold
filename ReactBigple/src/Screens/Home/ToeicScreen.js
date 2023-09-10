import React, { createRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableHighlight,
    Animated,
    Image,
    Modal,
    ActivityIndicator,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();


import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle';
import EmptyResultScreen from '../../Components/EmptyResultScreen'; //아직 푼 이력이 없을경우
import PremiumTest from './Contents/PremiumTest'; //import LcScreen from './Contents/LcScreen';
import ChartScreen from './Contents/ChartScreen';
import BannerScreen from '../../Components/BannerScreen';
import TextBookScreen from './Contents/TextBookScreen';
import WeakScreen from './Contents/WeakScreen';
import FooterScreen from '../../Components/FooterScreen';


import CheckCapacityModal from './Contents/CheckCapacityModal';

const NAVBAR_HEIGHT = 30;


class ToeicScreen extends React.PureComponent {

    scroll = new Animated.Value(0);
    headerY;

    constructor(props) {
        super(props);                
        //console.log('this.props',this.props.screenProps);
       
        this.state = {
            modalVisible : false,
            loading : false,
            isBanner : true,
            thisFocus : this.props.screenState.thisFocus,
            focusTab : this.props.screenState.focusTab ,    
            goBaseTestScreen : this.goBaseTestScreen.bind(this),
            firstselectTab : true,  
            labelWidth: 0,
            randomidx :  null,
            randomIndex : 
                [
                    1,
                    2,
                    3
                ],
            
        }        
        
    }


    UNSAFE_componentWillMount() {
        //console.log('toeic UNSAFE_componentWillMount');
        
        let setupRandomidx = this.state.randomIndex[Math.floor(Math.random()*this.state.randomIndex.length)]
        this.setState({ 
            loading: true,
            randomidx : setupRandomidx
        });
        
    }    

    componentDidMount() {        
        //console.log('toeic componentDidMount');
        
        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

   

    UNSAFE_componentWillUnmount() {
        //console.log('toeic UNSAFE_componentWillUnmount');    
        
    }  
  
    _refreshscreen = () => {
      
    }

    _didblur = () => {
      
    }

    _go_munje = async (title) => {
        let sendData = {            
                'selectBookIndex' : this.state.randomidx,
                'selectTheme' : 'free'
            }        
        this.props._updateStatusSelectBook(sendData);
        this.props.screenProps.navigation.navigate('NavQuestionScreen');
    }

    changeRandom = () => {
        let setupRandomidx = this.state.randomIndex[Math.floor(Math.random()*this.state.randomIndex.length)]
        this.setState({ 
            randomidx : setupRandomidx
        });
    }

    goBaseTestScreen = async(idx,theme) => {
        await this.changeRandom();
        let sendData = {            
            selectBookIndex : idx,
            selectTheme : theme//'concentration'
        }        
        this.props._updateStatusSelectBook(sendData);
        this.props.screenProps.navigation.navigate('NavQuestionScreen');
        
       
    }

    goExplanationScreen = async(idx,theme) => {
        console.log('idx',idx)        
        let sendData = {            
            selectBookIndex : idx,
            selectTheme : theme
        }        
        await this.props._updateStatusSelectBook(sendData);
        //this.props.screenProps.navigation.navigate('NavExplanationScreen');
        this.props.screenProps.navigation.navigate('ExplanationScreen');
        
       
    }

    goRCTestScreen = async(idx,theme) => {
        await this.changeRandom();
        let sendData = {            
            selectBookIndex : this.state.randomidx,
            selectTheme : theme//'concentration'
        }        
        this.props._updateStatusSelectBook(sendData);        
        this.props.screenProps.navigation.navigate('NavRCTestScreen',{}); 
       
    }

    changeTabs = async(newvalue) => {
        this.setState({
             firstselectTab:newvalue
        });
    }

    stopCutDownTimeOnChange = () => {
        this.setState({
            isResetTimer: false
       });
        
    };

    openModal = () => {        
       this.setState({ modalVisible: true});         
    }


    render() {
       

        const SetupModal=()=>{            
            return (
                <View style={styles.popup}>
                    <View style={styles.popupHeader}>                                    
                        <Text style={styles.txtTitle}>해커스 진단 테스트 리스트</Text>
                        <TouchableHighlight 
                            onPress={() => {this.setState({modalVisible :false});}}
                            style={{position:'absolute',right : 10, width:20, height:20}}>
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableHighlight>
                    </View>
                    <View style={styles.popupContent}>
                        <ScrollView contentContainerStyle={styles.modalInfo}>
                            <CheckCapacityModal screenState={this.state} screenProps={this.props.screenProps}/>
                        </ScrollView>
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
                <ScrollView style={styles.container}>
                    <NavigationEvents
                        onWillFocus={payload => console.log('toeic will focus')}
                        onDidFocus={payload => console.log('toeic did focus')}
                        onWillBlur={payload => console.log('toeic will blur')}
                        onDidBlur={payload => console.log('toeic did blur')}
                    />
                    <View style={styles.ChartWrapper}>
                        <ChartScreen screenProps={this.props.screenProps} screenState={this.state} />
                    </View>
                    { this.state.isBanner &&
                        <View style={styles.BannerWrapper}>
                            <BannerScreen screenProps={{idx : 1}}/>
                        </View>
                    }

                    {/* 해커스 진단 테스트 영역  */}
                    <View style={styles.DoctorTestWrapper} >
                        <View style={{flex:1, flexDirection:'row',paddingVertical : 10}}>
                            <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                <Text style={[CommonStyle.font15,{fontWeight:'bold',color:'#3986ef'}]}>해커스 진단 테스트</Text>
                            </View>
                            <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                <TouchableHighlight
                                     onPress= {()=> this.openModal()}>
                                    <Text style={{color:'#555'}}>더보기 {">"} </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <CheckCapacityModal screenState={this.state} screenProps={this.props.screenProps}/>
                        {/*}
                        <View style={{flex:1, flexDirection:'row',paddingVertical : 10}}>

                            <ImageBackground  
                                style= { styles.gridbackgroundImage } 
                                source={require('../../../assets/images/grid01.png')} >
                                <View style={{flex:1,justifyContent:'center',borderColor:'#ebebeb', borderWidth :1}}>
                                    <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                        <Text style={{fontSize:15,color:'#000',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                        <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.1 </Text>
                                    </View>
                                    <View style={{flex:1,backgroundColor:'#000',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',opacity:0.7}}>
                                        <Text style={{fontSize:15,color:'#fff'}}>시험응시</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                            <ImageBackground  
                                style= { styles.gridbackgroundImage } 
                                source={require('../../../assets/images/grid01.png')} >
                                <View style={{flex:1, justifyContent:'center',borderColor:'#ebebeb', borderWidth :1,backgroundColor:'#000',opacity:0.3}}>
                                    <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                        <Text style={{fontSize:15,color:'#999',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                        <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.2 </Text>
                                    </View>
                                    <View style={{flex:1,width:'100%',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',}}>
                                        <Icon name="lock" size={25} color="#fff" />
                                    </View>
                                </View>
                            </ImageBackground>
                            <ImageBackground  
                                style= { styles.gridbackgroundImage } 
                                source={require('../../../assets/images/grid01.png')} >
                                <View style={{flex:1,justifyContent:'center',borderColor:'#ebebeb', borderWidth :1,backgroundColor:'#000',opacity:0.3}}>
                                    <View style={{flex:4,alignItems:'flex-start',padding:10}}>
                                        <Text style={{fontSize:15,color:'#999',fontWeight:'bold'}}>해커스{"\n"}진단테스트 </Text>
                                        <Text style={{fontSize:35,color:'#ccc',fontWeight:'bold'}}>vol.3 </Text>
                                    </View>
                                    <View style={{flex:1,width:'100%',paddingHorizontal:5, paddingVertical : 15,alignItems:'center', justifyContent:'center',}}>
                                        <Icon name="lock" size={25} color="#fff" />
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>         
                        */}               
                    </View>

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
                    </View>

                    <View style={[styles.FooterWrapper,{marginTop :10}]}>
                        <View style={styles.TabheaderTitle}>
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
                        <View>
                            <View style={{flex:1, flexDirection:'row',padding : 10,backgroundColor : '#fff'}}>
                                <View style={{flex:3,alignItems:'flex-start',justifyContent:'center'}}>
                                    <Text style={[CommonStyle.font15,{fontWeight:'bold',color:'#3986ef'}]}>프리미엄 모의고사</Text>
                                </View>
                            </View>
                            { this.state.firstselectTab ?
                            <View style={styles.firstWrapper}>
                                <PremiumTest screenProps={this.state}/>
                            </View> 
                            :
                            <View style={styles.firstWrapper}>
                                <EmptyResultScreen screenState={this.state} />

                            </View>
                            }
                
                        </View>
                    </View>
                    <View style={[styles.FooterWrapper,{marginTop :10}]}>
                        <TextBookScreen screenProps={{...this.props.screenProps, goExplanationScreen : this.goExplanationScreen.bind(this)}} />
                        <View style={{flex:1,marginVertical:10}} >
                            <WeakScreen screenProps={{...this.state, title:'취약유형 집중공략'}} />
                        </View>
                        <WeakScreen screenProps={{...this.state,title:'한 단계 Level-up! 집중공략'}} />
                    </View> 
                    {/*
                    <View style={styles.HeaderWrapper}>
                        <Animated.ScrollView
                            scrollEventThrottle={1}
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            style={{zIndex: 0, height: "100%", elevation: -1}}
                            contentContainerStyle={{paddingTop: NAVBAR_HEIGHT}}
                            onScroll={Animated.event(
                                [{nativeEvent: {contentOffset: {y: this.scroll}}}],
                                {useNativeDriver: true},
                            )}
                            overScrollMode="never">
                            <Tabs renderTabBar={(props) => <Animated.View
                                style={[{
                                    transform: [{translateY: tabY}],
                                    zIndex: 1,
                                    width: "100%",
                                    backgroundColor: COLOR
                                }, Platform.OS === "ios" ? {paddingTop: 0} : null]}>
                                <ScrollableTab {...props} underlineStyle={{backgroundColor: "white"}}/>
                            </Animated.View>
                            }>
                                <Tab heading="RC" {...TAB_PROPS}>
                                    {tabContent}
                                </Tab>
                                <Tab heading="LC" {...TAB_PROPS}>
                                    <LcScreen screenProps={this.state}/>
                                </Tab>
                            </Tabs>
                        </Animated.ScrollView>
                    </View>
                    */}
                    <FooterScreen screenProps={this.props.screenProps} />
                    
                                       
                </ScrollView>
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
        backgroundColor : "#ccc",
        paddingTop:10
    },    
    HeaderWrapper: {
        paddingHorizontal : 10,
        
    },
    FooterWrapper : {
        paddingHorizontal : 10,
        overflow :'hidden',
    },
    headertitle: {
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 10
    },
    ChartWrapper : {
       flex :1,
       marginHorizontal : 10,
    },
    
    gridbackgroundImage:{        
        flex:1,
        margin:2
    },
    
    
    button: {
        height: 30,
        width:160,
        backgroundColor: '#3986ef',
        borderColor: '#3986ef',
        borderWidth: 1,
        borderRadius: 15,
        marginBottom: 10,
        paddingHorizontal:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    BannerWrapper : {
        marginHorizontal : 10,
        marginTop:20,
        borderColor : '#ccc',
        borderWidth : 1
    },
    DoctorTestWrapper : {
        flex:1,
        marginHorizontal : 10,
        marginTop:10,
        padding : 10,
        borderColor : '#ccc',
        borderWidth : 1,
        backgroundColor : '#fff'
    },

    TabheaderTitle: {
        height:39,
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
    firstWrapper : {        
        backgroundColor : "#fff",
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
/*
{
    "navigation": 
        {
            "actions": 
                {
                    "closeDrawer": [Function closeDrawer],
                    "dismiss": [Function dismiss],
                    "goBack": [Function goBack],
                    "navigate": [Function navigate],
                    "openDrawer": [Function openDrawer],
                    "pop": [Function pop],
                    "popToTop": [Function popToTop],
                    "push": [Function push],
                    "replace": [Function replace],
                    "reset": [Function reset],
                    "setParams": [Function setParams],
                    "toggleDrawer": [Function toggleDrawer]
                },
            "addListener": [Function addListener],
            "closeDrawer": [Function anonymous],
            "dangerouslyGetParent": [Function anonymous],
            "dismiss": [Function anonymous],
            "dispatch": [Function anonymous],
            "emit": [Function emit],
            "getChildNavigation": [Function getChildNavigation],
            "getParam": [Function anonymous],
            "getScreenProps": [Function anonymous],
            "goBack": [Function anonymous],
            "isFirstRouteInParent": [Function isFirstRouteInParent],
            "isFocused": [Function isFocused],
            "navigate": [Function anonymous],
            "openDrawer": [Function anonymous],
            "pop": [Function anonymous],
            "popToTop": [Function anonymous],
            "push": [Function anonymous],
            "replace": [Function anonymous],
            "reset": [Function anonymous],
            "router": undefined,
            "setParams":[Function anonymous],
            "state": {
                "key": "id-1578468012758-1",
                "routeName": "QuestionScreen"
                },
            "toggleDrawer": [Function anonymous]
        },
    "screenProps": {
        "LoginToken": "$2y$10$dkVMOaKWWk2L8n9e.dSZY.uMdB7CHjPi11PkRsm0tscqEat/w5l/q",
        "currentScreenIndex": 1,
        "deviceId": "5B7F2729-E891-4E1D-B34B-29563ED40540",
        "exitApp": false
    }
*/