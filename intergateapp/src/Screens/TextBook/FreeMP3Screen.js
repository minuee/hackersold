import React from 'react';
import { Text, PixelRatio, View, StyleSheet, Modal,Dimensions,StatusBar,Platform,TouchableOpacity,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import { NavigationEvents } from 'react-navigation';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';

class FreeMP3Screen extends React.PureComponent {

    constructor(props) {
        super(props);        
        this.state = {    
            loading : false,
            parentactiveTab : this.props.textBookFocusHeight,
            mp3list : [],
        };


        console.log('FreeMP3Screen.js > constructor()', 'this.props.screenState.bookIdx = ' + this.props.screenState.bookIdx)
    }

  
    
    UNSAFE_componentWillMount() {

        if ( this.props.screenState.bookIdx && this.props.screenState.bookIdx !== 0 ) {
            this.getBookInfo(this.props.screenState.bookIdx);
            // this.getBookInfo(371);
        }else{
            let msg = '';
            if (!CommonUtil.isEmpty(this.props.screenState.bookInfoResult) && this.props.screenState.bookInfoResult.code !== '0000') {
                msg = this.props.screenState.bookInfoResult.message || '';
            }
            this.failCallAPi(msg);
        }
        
    }    

    componentDidMount() {        
        
    }

    UNSAFE_componentWillUnmount() {
        
    }  
    
    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보
        
        
    }

    
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.forceUpdate();
        
    }

    failCallAPi = (msg) => {
        const toastMessage = msg || '데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요';
        const alerttoast = Toast.show(toastMessage);
        setTimeout(() => {
            Toast.hide(alerttoast);
            this.setState({
                mp3list : [],
                loading:false
            });
        }, 2000)
    }

    getBookInfo = async(bookIdx) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + bookIdx + '/freeMP3',{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            }).then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    
                    if ( response.code !== '0000' ) {
                        const msg = response.message || '';
                        this.failCallAPi(msg);
                    }else{                                                
                        this.setState({
                            loading : false,                            
                            mp3list:response.data.mp3
                        })
                        
                    }

                }else{                    
                    this.failCallAPi()
                }

                this.setState({loading:false})    

            
            })
            .catch(err => {
                console.log('login error => ', err);               
                this.failCallAPi()
            });

            
    }

    goDetail = async(mpCode, fileIdx) => {
        
        this.props.screenProps.navigation.navigate('FreeMP3Detail',{
            bookInfo : this.props.screenState.baseBookInfo,
            bannerurl: this.props.screenState.bannerurl,
            mpCode : mpCode,
            fileIdx : fileIdx,
        });
        StatusBar.setBackgroundColor("transparent");
        this.androidStatusSetup(true)          
        
    }
    onLayoutHeader3 = (evt ) => {
        //console.log('height freemop3',evt.nativeEvent.layout);    
        //this.props.screenState.tabsSetupHeight(1,evt.nativeEvent.layout.height)
    }

    androidStatusSetup = async(bool) => {    
        if (Platform.OS === "android") {            
            StatusBar.setTranslucent(bool);
        }
    }

    render() {

        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
    
            return (
            
                <View style={styles.container} onLayout={(e)=>this.onLayoutHeader3(e)}>   
                    { 
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                    } 
                    <NavigationEvents
                        onWillFocus={payload => {
                            if (Platform.OS === "android") {
                                this.androidStatusSetup(true)
                                StatusBar.setBackgroundColor("transparent");
                            }
                        }}                        
                    />
                    <View style={{flex:1,padding:5}}>
                        { 
                            this.state.mp3list.map((titem, index) => {     
                                return(                           
                                    <View style={styles.itemWrap} key={index}>                                
                                        <View style={{flex:10}}>
                                            <Text 
                                                numberOfLines={2} ellipsizeMode = 'tail'
                                                style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),lineHeight:20}}
                                            >{titem.title}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            onPress= {()=> this.goDetail(titem.mpCode, titem.fileIdx)}
                                            style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                            <Icon name={'right'} size={20} color={DEFAULT_COLOR.base_color_ccc} />
                                        </TouchableOpacity>
                                    
                                    </View>
                                )
                            })
                        }
                    </View>   
                    
                </View>
            )
        }
            
    
   }
}


const styles = StyleSheet.create ({
    container: {      
      flex:1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemWrap : {        
        flexDirection : 'row',
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },

 
  
})


function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}



FreeMP3Screen.propTypes = {
    selectBook: PropTypes.object,
    topFavoriteMenu: PropTypes.bool,   
    showBottomBar: PropTypes.bool,   
    textBookFocusHeight : PropTypes.number
};


export default connect(mapStateToProps, null)(FreeMP3Screen);