import React, {Component} from 'react';
import {StyleSheet,View,Text, Platform, Alert,BackHandler,StatusBar,ActivityIndicator} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';


import CommonStyle from '../../Styles/CommonStyle'
import IntroScreen from './IntroScreen';

import PracticeScreen from './PracticeScreen';

class ExplanationScreen extends Component {

    constructor(props) {
        
        super(props);        
        
        //console.log('explanation props',this.props.selectBook)
        this.state  = {    
            isResultReport : false,           
            selectBookIndex : null, 
            selectTheme : null,
            selectIngParts : null,             
            selectTimer : true,
            thisStatus : null,
            isIng : false,
            nextProblem : null,         
            isReady : false,
            lectureInfo : null,   
            exitPage: this.exitPage.bind(this),
            continuePage : this.continuePage.bind(this),
            startPage : this.startPage.bind(this),
            returnTopPage : this.returnTopPage.bind(this),
            _returnTopPage : this._returnTopPage.bind(this),
            refreshTextBookInfo : this.refreshTextBookInfo.bind(this)
        }
    }

    static navigationOptions = ({navigation}) => {

        //console.log('question 2',navigation)
        const params =  navigation.state.params || {};        
        return {
           
            headerTitle: params.newtitle,
            headerLeft: params.newheaderLeft,
            headerRight:  params.newheaderRight,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#173f82',
                height:40
            },
            headerTintColor: '#fff'
        }
    };

    _setNavigationParams(){
        
        let newtitle = <View style={[CommonStyle.font20,{flex:1,flexGrow :1,textAlign:'center',alignItems:'center'}]}><Text style={{color:'#fff'}}>{this.props.selectBook.selectTheme  ? this.props.selectBook.selectTheme : this.state.selectTheme}</Text></View>;
        
        let newheaderLeft = (                  
            <View>
               <Icon name='left' size={25} color="#888" style={{textAlign : 'left', paddingLeft:10}}
                      onPress={() => this.checkSave()} />
            </View>
        );
        let newheaderRight = (<View style={{flex:1,flexGrow:1}}><Text> </Text></View>)
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight
        });
    }

    UNSAFE_componentWillMount() {     

        console.log('this.propTypes.selectBook.selectIngParts',this.props.selectBook.selectIngParts);
        let selectBookIndex = 1;
        let selectTheme = 'Non Subject';
        let selectTimer = true;
        let selectIngParts = null;
        try {
            if ( typeof this.props.navigation.state.params.lectureNo !== "undefined" ) {
                selectBookIndex = this.props.navigation.state.params.lectureNo;
                selectTheme = this.props.navigation.state.params.theme;
                selectIngParts =  null;
                selectTimer =  true;
            }
        }catch(e){

        }
        try {
            if ( typeof this.props.selectBook !== "undefined" ) {
                selectBookIndex = this.props.selectBook.selectBookIndex;
                selectTheme = this.props.selectBook.selectTheme;
                selectTimer = this.props.selectBook.selectTimer;
                selectIngParts = this.props.selectBook.selectIngParts;
            }
        }catch(e){

        }

        
        this.setState({ 
            selectBookIndex: selectBookIndex, 
            selectTheme: selectTheme, 
            selectTimer: selectTimer, 
            selectIngParts: selectIngParts, 
        });
        this._setNavigationParams();
        
        
    }    

    componentDidMount() {        
        this.refreshTextBookInfo();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });


    }

    UNSAFE_componentWillUnmount() {
        this._navListener.remove();
    }  

    refreshTextBookInfo = async() => {
        const idx = this.state.selectBookIndex;
        console.log('selectBookIndex',this.state.selectBookIndex);
        fetch('https://reactserver.hackers.com:3001/getlecture?lectureidx=' + idx)
            .then(response => response.json())
            .then(responseJson => {
                console.log('responseJson',responseJson[0])
                if ( responseJson[0] === undefined ) {
                    const alerttoast = Toast.show('해당 교재는 이용이 불가한 상태입니다.');
                    setTimeout(() => {
                        Toast.hide(alerttoast);                
                    }, 2000)
                    this.props.navigation.goBack(null);
                }else {
                    this.setState({
                        lectureInfo: responseJson[0],
                        isReady : true
                    });
                }
                
            })
            .catch(error => {
                this.props.navigation.goBack(null)
                console.error(error);
            });
    }
 


    checkSave = async() => {        
        if ( !this.state.isResultReport && this.state.thisStatus === 'ing' ) {
            Alert.alert(
                "미입력 답안 제출하기",
                "채점하기 전입니다.\n 현재까지 풀이 내역을 임시저장후 나가시겠습니까?.",
                [
                    {text: '아니오', onPress: () => null},
                    {text: '네', onPress: this._exitAction.bind(this)},
                    
                ],
                { cancelable: false }
            )
        }else{
            this._exitAction();
        }
    }

    startPage = async() => {        
        Alert.alert(
            "Hackers Alert",
            "Are you sure Start? \nif you click a okay then start practice time",
            [
                {text: '시작하기', onPress: this._startPage.bind(this)},
                {text: '아니오', onPress: () => null},
            ],
            { cancelable: false }
        )        
    }

    async _startPage (){        
        await this.setState({ 
            thisStatus: 'ing',
            isIng: true
        });
        this._setNavigationParams();
    }

    continuePage = async() => {
        
        Alert.alert(
            "이어풀기",
            "이어서 푸시겠습니까?",
            [
                {text: '이어풀기', onPress: this._continuePage.bind(this)},
                {text: '아니오', onPress: () => null},
            ],
            { cancelable: false }
        )        
    }

    _continuePage(){
        this.setState({ 
            thisStatus: 'ing',
            isIng: true,
            nextProblem : 3
        });
    }

    exitPage = async() => {
       
        Alert.alert(
            "Hackers Alert",
            "Are you sure go back?",
            [
                {text: '아니오', onPress: () => null},
                {text: '나가기', onPress: this._exitAction.bind(this)},
                
            ],
            { cancelable: true }
        )        
    }

    _exitAction(){
        //this.props._updateStatusSelectBook(null);
        this.props.navigation.goBack(null)
    }

    returnTopPage = async() => {
        
        Alert.alert(
            "풀이나가기",
            "임시저장하지 않은 상태입니다만 나가려고? \n문제페이지 홈으로 이동합니다.",
            [
                {text: '아니오', onPress: () => null},
                {text: '나가기', onPress: this._returnTopPage.bind(this)},                
            ],
            { cancelable: false }
        )        
    }

    _returnTopPage(){
        
        this.setState({ 
            thisStatus: null,
            isIng: false,   
            isReady : false         
        });

        this._setNavigationParams();
        this.props.navigation.goBack(null);
    }

    refreshQuestion = (payload) => {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });

        console.log('11111',this.props.selectBook);
        this.setState({ 
            thisStatus : null,
            isReady : false,
            selectBookIndex : this.props.selectBook.selectBookIndex, 
            selectTheme : this.props.selectBook.selectTheme 
            
        });
        
    }

    onBlurQuestion = (payload) => {
        this._navListener.remove();
        this.setState({ 
            thisStatus: null,
            isIng: false,            
            selectBookIndex : null,            
        });      
    }

    
 

    render() {
        return (           
            <View style={styles.container}>                
                <NavigationEvents
                        onWillFocus={payload => {
                            this.refreshQuestion(payload)
                          
                            }
                        }
                        onDidFocus={payload => {
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);   
                            console.log('qeestion did focus');
                          
                           }
                        }
                        onWillBlur={payload => {
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
                            this.onBlurQuestion(payload)
                            this.setState({ 
                                selectBookIndex : this.state.selectBookIndex, 
                                selectTheme : this.state.selectTheme,                                
                            });
                            }
                        }
                        onDidBlur={payload => 
                            {
                                console.log('qeestion did blur')
                                //this._setNavigationParams();
                            }
                        }
                    />
                { this.state.thisStatus === 'ing' || this.state.selectIngParts ?                    
                    <PracticeScreen screenProps={this.props} screenState={this.state} />
                    :
                    this.state.isReady && this.state.lectureInfo ?
                    <IntroScreen screenProps={this.props} screenState={this.state} />
                    :
                    <ActivityIndicator size="large" />
                    
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
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
        _updateStatusSelectBook:(array) => {
            dispatch(ActionCreator.updateStatusSelectBook(array));

        }
    };
}

ExplanationScreen.propTypes = {
    selectBook: PropTypes.object,   
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(ExplanationScreen);

/*

{   "actions": 
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
    "setParams": [Function anonymous], 
    "state": 
    {   
        "key": "id-1579055444098-25", 
        "params": {"isVal": 1111, "newheaderRight": null, "newtitle": <RCTView … />}, 
        "routeName": "QuestionScreen"}, 
        "toggleDrawer": [Function anonymous]
    }
    */