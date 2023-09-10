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

const {width: SCREEN_WIDTH} = Dimensions.get("window");
//import {NavigationEvents,NavigationActions,StackActions} from 'react-navigation';


import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import CommonStyle from '../../Styles/CommonStyle'


import RecomandScreen from './RecomandScreen';  //맞춤영역 취약유형 + 도전유형
import EmptyResultScreen from '../../Components/EmptyResultScreen'; //아직 푼 이력이 없을경우


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

class TextBookListScreen extends React.Component {

    
    constructor(props) {
        super(props);                
        
        this.state = {
            loading : false,            
            firstselectTab : true,    
            modalVisible : false,            
            focusTab : this.props.screenState.focusTab,
            nav_test : this.nav_test.bind(this),
            onPressUpdateOpen : this.onPressUpdateOpen.bind(this),
            items : [ 
                {
                index : 1 , bannerurl : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/91f67334f0020841f14f65cd17e6693a.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '11강',parts : 5,ingParts : 1, isOpened :false
                },
                {
                    index : 2 , bannerurl : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/fd7778cfa3faff9739f3df88e6bfcf64.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '13강',parts : 10,ingParts : null, isOpened :false
                },
                {
                    index : 3 , bannerurl : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/5a66e50b32a2443117a79568abe7b311.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '15강',parts : 12,ingParts : 3, isOpened :false
                },
                {
                    index : 4 , bannerurl : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/df2a7d17bb8a474f2c9c927c00e5b752.jpg', title : '해커스 신토익 Reading' , teacher : '노성남' , theme : '17강',parts : 15,ingParts : 5, isOpened :false
                },
                {
                    index : 5 , bannerurl : 'https://gscdn.hackers.co.kr/hackers/files/bookmanager/dd1e2fccae5166a1f349c48c83c40df4.jpg', title : '해커스 신토익 Reading' , teacher : '홍길동' , theme : '19강',parts : 20,ingParts : null, isOpened :false
                },
               
            ],
           
        }        
       
       
    }


    UNSAFE_componentWillMount() {
        this.setState({ 
            loading: true,   
            firstselectTab : true,              
        });
        
       
    }    

    componentDidMount() {        
        setTimeout(
            () => {
                this.setState({ loading: false});
            },500)
    }

    UNSAFE_componentWillUnmount() {       
        
    }  

    UNSAFE_componentWillReceiveProps(nextProps) {        
        this.setState({ loading : true });
        this.refresh_end();
    }

    refresh_end = () => {        
        this.setState({loading : false});
    }

    changeTabs = async(newvalue) => {
        this.setState({
            firstselectTab:newvalue,
            loading: true,
        });

        setTimeout(
            () => {
                this.setState({ loading: false});
            },500
        )
    }



    nav_test = async(lectureNo, theme,isTimer,ingParts) => {     
        let sendData = {            
            selectBookIndex : lectureNo,
            selectTheme : theme,
            selectIngParts : ingParts,
            selectTimer: isTimer
        }        
        await this.props._updateStatusSelectBook(sendData);
        
        this.props.screenProps.navigation.navigate('ExplanationScreen');
    }

    onPressUpdateOpen = async(idx, val) => {        
        this.state.items[idx].isOpened = val;

        this.setState({ items: this.state.items});
    }

    render() {
       
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
                            <RecomandScreen screenProps={this.props} screenState={this.state} />
                        </View>
                        :
                        <View style={styles.firstWrapper}>
                            <EmptyResultScreen screenState={this.state} />

                        </View>
                        }
               
                    </ScrollView>
                   
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

TextBookListScreen.propTypes = {
    selectBook: PropTypes.object,
    remainTime: PropTypes.number,   
};


export default connect(mapStateToProps, mapDispatchToProps)(TextBookListScreen);
