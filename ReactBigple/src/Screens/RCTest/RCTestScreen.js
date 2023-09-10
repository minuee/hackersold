import React, {Component} from 'react';
import {StyleSheet,View,Text, StatusBar, Alert,BackHandler} from 'react-native';
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
        this.state  = {     
            isReplace : false,          
            selectBookIndex : 1, 
            selectTheme : 'Non Subject', 
            isAnswerMode : false, 
            thisStatus : null,
            isIng : false,
            nextProblem : null,            
            exitPage: this.exitPage.bind(this),
            replaceSetup: this.replaceSetup.bind(this),
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
            headerRight: null,
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
       
        this.props.navigation.setParams({
            newtitle
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
        return true;
        if ( this.state.isReplace ) {
            console.log('222222');
            return true;
        }else{
            console.log('3333');
            return false;
        }
        
      
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

    replaceSetup = async() => {

        this.setState({ 
            isReplace: true,
            isAnswerMode : false
        });
        console.log('replaceSetup');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
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

    returnTopPage = async(isTempSave) => {
        console.log('isTempSave',isTempSave) ;
        if ( isTempSave ) {
            Alert.alert(
                "풀이나가기",
                "현재 문제풀이를 종료하시겠습니까.",
                [
                    {text: '아니오', onPress: () => null},
                    {text: '나가기', onPress: this._returnTopPage.bind(this)},                
                ],
                { cancelable: false }
            )        
        }else{
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
        this.setState({ 
            selectBookIndex : this.props.selectBook.selectBookIndex, 
            selectTheme : this.props.selectBook.selectTheme 
            
        });
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });
        
    }

    onBlurQuestion = (payload) => {
        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
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
                        onWillFocus={payload => this.refreshQuestion(payload)}
                        onDidFocus={payload => {
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);   
                            console.log('qeestion did focus');
                            
                           }
                        }
                        onWillBlur={payload => {
                            console.log('qeestion will blur')
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
                                console.log('qeestion did blur');
                                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                                
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

