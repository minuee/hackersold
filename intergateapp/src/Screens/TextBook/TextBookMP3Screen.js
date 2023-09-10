import React from 'react';
import { Text, Image, View, StyleSheet, Modal,Dimensions,Animated,TouchableOpacity,ActivityIndicator,PixelRatio,Platform,StatusBar } from 'react-native';
import {connect} from 'react-redux';
import {CheckBox,Overlay,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import { NavigationEvents } from 'react-navigation';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR, TextRobotoB} from '../../Style/CustomText';


class TextBookMP3Screen extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {    
            loading : false,
            showModal : false,         
            mp3Book : [],
            mp3list : [],
            selectedMP3List : []
        };
        
    } 

    async UNSAFE_componentWillMount() {
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
    }

    failCallAPi = (msg) => {
        const toastMessage = msg || '데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요';
        const alerttoast = Toast.show(toastMessage);
        setTimeout(() => {
            Toast.hide(alerttoast);
            this.setState({
                mp3list2 : []
            });
        }, 2000)
    }

    getBookInfo = async(bookIdx) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;
        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + bookIdx + '/paidMP3',{
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
                        if ( typeof response.data.paidMP3 !== 'undefined') {
                            this.setState({mp3Book:response.data.paidMP3})
                        }
                        if ( typeof response.data.sampleMP3 !== 'undefined') {
                            this.setState({mp3list:response.data.sampleMP3})
                        }
                        this.setState({loading : false,})
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

    setChecked = async(data,thischeck) => {
      
        let selectedFilterCodeList = this.props.screenState.selectedMP3List;   
        if ( thischeck ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.productIdx !== data.mpCode);        
        }else{ //추가
            selectedFilterCodeList.push({'productIdx' : data.mpCode,'name' : data.title,'data' : data});
        } 

        return selectedFilterCodeList;
    }
    
    checkCartList = async(idx,data,thischeck) =>{
        let returArray =  await this.setChecked(data,thischeck);        
        // 중복제거
        Array.from(new Set(returArray));
        this.setState({
            mp3Book: this.state.mp3Book,
            //selectedMP3List : selectedMP3List
        });
        this.props.screenState._buyMp3Goods(returArray);
            
    }
 
    closeModal = () => this.setState({ showModal: false });
    showModal = () => this.setState({ showModal: true });

    onLayoutHeader2 = (evt ) => {
        //console.log('height ora',evt.nativeEvent.layout);    
        //this.props.screenState.tabsSetupHeight(2,evt.nativeEvent.layout.height)

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
            <View style={styles.container} onLayout={(e)=>this.onLayoutHeader2(e)}>
                { 
                    Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={'transparent'} animated={true} hidden={false}/>
                }  
                <NavigationEvents
                    onWillFocus={payload => {                        
                    }}
                    onWillBlur={payload => {
                        if (Platform.OS === "android") {
                            this.androidStatusSetup(false)
                            StatusBar.setBackgroundColor("#ffffff");
                        }
                    }}
                />
                {this.state.mp3list.length > 0 &&
                <TouchableOpacity 
                    style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}
                    onPress= {()=> this.props.screenState._showModal(null,this.state.mp3list)}
                >
                    <Image source={require('../../../assets/icons/icon_list_sample.png')} resizeMode='contain' style={{width:18,height:14}} />
                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}}>{" "}샘플듣기</CustomTextR>
                </TouchableOpacity>
                }
                <View style={{padding:5,marginBottom:100}}>
                    { 
                        this.state.mp3Book.map((titem, index) => { 
                            let isIndexOf = this.props.screenState.selectedMP3List.findIndex(
                                info => info.productIdx === titem.mpCode
                            );  
                            
                            return(                           
                                <View style={isIndexOf !== -1 ? styles.checkedItem : styles.unCheckedItem} key={index}>
                                    <View style={{flex:0.7,paddingTop:10}}>
                                        <CheckBox 
                                            containerStyle={styles.checkboxWrap}      
                                            iconType='font-awesome'
                                            checkedIcon='check-circle'
                                            uncheckedIcon='circle-o'
                                            checkedColor={DEFAULT_COLOR.lecture_base}
                                            uncheckedColor={DEFAULT_COLOR.base_color_ccc}
                                            onPress= {()=> this.checkCartList(index,titem,isIndexOf !== -1 ? true : false)}
                                            checked={ isIndexOf !== -1 ? true : false}
                                        />         
                                    </View>
                                    <View style={{flex:4}}>
                                        <View >
                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),letterSpacing:0.7}}>                                            
                                                {titem.title}
                                            </CustomTextR>
                                        </View>
                                        <View style={{paddingTop:10,alignItems:'flex-end'}}>
                                            <TextRobotoM style={{padding:5,marginRight:10,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>
                                                {CommonFuncion.currencyFormat(parseInt(titem.price))}원
                                            </TextRobotoM>
                                        </View>
                                    </View>
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
      flex: 1,
      marginTop:20,      
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedItem : {
        flex:1,
        flexDirection : 'row',
        marginHorizontal:10,
        padding:20,
        borderRadius : 5,
        borderWidth:1,
        borderColor:DEFAULT_COLOR.lecture_base,
        marginVertical:5
    },
    unCheckedItem : {
        flex:1,
        flexDirection : 'row',
        marginHorizontal:10,
        padding:20,
        borderRadius : 5,
        borderWidth:1,
        borderColor:'#ccc',
        marginVertical:5
    },
    checkboxWrap: {
        flex: 1,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff',
    },

    /**** Modal  *******/
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
  
})



function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}



export default connect(mapStateToProps, null)(TextBookMP3Screen);
