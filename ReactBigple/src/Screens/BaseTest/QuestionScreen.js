import React, {Component} from 'react';
import {StyleSheet,View,Text, Platform, Alert,BackHandler,StatusBar} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import CommonStyle from '../../Styles/CommonStyle'
import IntroScreen from './IntroScreen';

import PracticeScreen from './PracticeScreen';

class QuestionScreen extends Component {

    constructor(props) {
        
        super(props);        
        
        console.log('question props',this.props.navigation.state.params)
        this.state  = {               
            selectBookIndex : 1, 
            selectTheme : 'Non Subject', 
            isAnswerMode : false, 
            thisStatus : null,
            isIng : false,
            nextProblem : null,            
            exitPage: this.exitPage.bind(this),
            continuePage : this.continuePage.bind(this),
            startPage : this.startPage.bind(this),
            returnTopPage : this.returnTopPage.bind(this),
            _returnTopPage : this._returnTopPage.bind(this)
        }
    }
    /*
    static navigationOptions = {
        gesturesEnabled: false
    }
    */

    static navigationOptions = ({navigation}) => {

        //console.log('question 2',navigation)
        const params =  navigation.state.params || {};        
        return {
           
            headerTitle: params.newtitle,
            headerRight: params.newheaderRight,
            headerLeft : null,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#173f82',
                height:40
            },
            headerTintColor: '#fff'
        }
    };

    _setNavigationParams(){
        
        let newtitle = <View style={[CommonStyle.font20,{flexGrow:1,textAlign:'center',alignItems:'center'}]}><Text style={{color:'#fff'}}>{this.props.selectBook.selectTheme  ? this.props.selectBook.selectTheme : this.state.selectTheme}</Text></View>;
        let newheaderRight = (      
            this.state.thisStatus === 'ing' ?
            <View style={{flex:1,width:50}}>
                {
                
                <Icon name='th' size={25} color="#888" style={{textAlign : 'right', paddingRight:10}}
                      onPress={() => this.showAnswer()} />
                }
            </View>
            :
            null
        );

        
        this.props.navigation.setParams({
            newtitle,
            newheaderRight
        });
    }

    UNSAFE_componentWillMount() {     
        let selectBookIndex = 1;
        let selectTheme = 'Non Subject';
        try {
            if ( typeof this.props.navigation.state.params.lectureNo !== "undefined" ) {
                selectBookIndex = this.props.navigation.state.params.lectureNo;
                selectTheme = this.props.navigation.state.params.theme;            
            }
        }catch(e){

        }
        try {
            if ( typeof this.props.selectBook !== "undefined" ) {
                selectBookIndex = this.props.selectBook.selectBookIndex;
                selectTheme = this.props.selectBook.selectTheme;
            }
        }catch(e){

        }
        this.setState({ 
            selectBookIndex: selectBookIndex, 
            selectTheme: selectTheme, 
        });
        this._setNavigationParams();
        
    }    

    componentDidMount() {        
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);              
        this._navListener.remove();
    }  

    handleBackButton = () => {
        console.log('11111');
        return true;
        if (this.state.exitApp == undefined || !this.state.exitApp) {
            return true;            
        } else {            
            this.setState({ exitApp: false });
        }
        return true;
    };

    showAnswer = async() => {        
        this.setState({ isAnswerMode: !this.state.isAnswerMode});
        
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
            isAnswerMode : false
        });

        this._setNavigationParams();
    }

    refreshQuestion = (payload) => {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });
        this.setState({ 
            selectBookIndex : this.props.selectBook.selectBookIndex, 
            selectTheme : this.props.selectBook.selectTheme 
            
        });
        
    }

    onBlurQuestion = (payload) => {
        this._navListener.remove();
        this.setState({ 
            thisStatus: null,
            isIng: false,
            isAnswerMode : false,
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
                { this.state.thisStatus === 'ing' ?
                    //<AnswerScreen screenProps={this.props} screenState={this.state} />
                    <PracticeScreen screenProps={this.props} screenState={this.state} />
                    :
                    <IntroScreen screenProps={this.props} screenState={this.state} />
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

QuestionScreen.propTypes = {
    selectBook: PropTypes.object,   
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);

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