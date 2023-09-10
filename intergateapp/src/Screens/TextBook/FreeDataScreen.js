import React from 'react';
import {
    Text, PixelRatio, View, StyleSheet, Linking, Dimensions, TouchableOpacity, ActivityIndicator, Platfor, Platform,
    StatusBar, Alert, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import { NavigationEvents } from 'react-navigation';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import { ScrollView } from 'react-native-gesture-handler';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';
import LinearGradient from "react-native-linear-gradient";

const STATE_DOWNLOAD_READY = undefined;
const STATE_DOWNLOAD_PROGRESS = 'progress';
const STATE_DOWNLOAD_COMPLETE = 'complete';

class FreeDatacreen extends React.PureComponent {

    constructor(props) {
        super(props);        
        this.state = {    
            loading : false,
            isLogin: null,
            showModal: false,
            selectedFileItem: null,
            freeDataList : [ 
            ],
        };
    } 
      
    async UNSAFE_componentWillMount() {
        await this.getStorageData();
        if ( this.props.screenState.bookIdx && this.props.screenState.bookIdx !== 0) {
            // if ( CommonUtil.isLoginCheck() === true ) {
                this.getBookInfo(this.props.screenState.bookIdx);
                // this.getBookInfo(77,7015069);
            // }
        }else{
            let msg = '';
            if (!CommonUtil.isEmpty(this.props.screenState.bookInfoResult) && this.props.screenState.bookInfoResult.code !== '0000') {
                msg = this.props.screenState.bookInfoResult.message || '';
            }
            this.failCallAPi(msg);
        }
        const isLogin = await CommonUtil.isLoginCheck();
        this.setState({isLogin: isLogin});
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
                freeDataList : [],
                loading:false
            });
        }, 2000)
    }

    getBookInfo = async(bookIdx,memberIdx) => {
        //console.log('bookIdx',bookIdx)
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        console.log('FreeDataScreen > getBookInfo', 'url = ' + aPIsDomain + '/v1/book/' + bookIdx + '/freeFiles')

        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + bookIdx + '/freeFiles/'+memberIdx,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },5000
            ).then(response => {

                console.log('FreeDataScreen > getBookInfo', 'response = ' + JSON.stringify(response))

                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    
                    if ( response.code !== '0000' ) {
                        const msg = response.message || '';
                        this.failCallAPi(msg);
                    }else{                        
                        this.setState({
                            loading : false,                            
                            freeDataList:response.data.freeFiles
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

    getStorageData = async () => {
        try {
          const tvalue = await AsyncStorage.getItem('userToken')
          if(tvalue !== null) {            
            this.setState({LoginToken: tvalue});
          }
        } catch(e) {            
            this.setState({LoginToken: null});
        }
    }


    authUser = async(fileItem) => {
        if(this.state.isLogin) {
            await this.authUsage(fileItem)
        } else {
            alert('비로그인 상태')
        }
    }

    // 무료자료 인증 결과 조회
    authUsage = async(fileItem) => {
        const memberIdx = await CommonUtil.getMemberIdx();
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;

        //console.log('FreeDataScreen > authUsage()', 'url = ' + aPIsDomain + '/v1/book/' + this.props.screenState.bookIdx + '/freeFiles/' + fileItem.fileIdx + '/' + memberIdx)

        await CommonUtil.callAPI( aPIsDomain + '/v1/book/' + this.props.screenState.bookIdx + '/freeFiles/' + fileItem.fileIdx + '/' + memberIdx,{
                method: 'GET',
                headers: new Headers({
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': aPIsAuthKey
                }),
                body:null
            },5000
        ).then(response => {

            console.log('FreeDataScreen > authUsage', 'response = ' + JSON.stringify(response))

            if (response && typeof response === 'object' || Array.isArray(response) === false) {
                if ( response.code !== '0000' ) {
                    const msg = response.message || '';
                    this.failCallAPi(msg);
                }else{

                    const certResult = response.data.certResult;

                    if(certResult) {
                        this.controlDownload(fileItem)
                    } else {
                        Alert.alert('', '자료 다운로드를 위해서 인증이 필요합니다.\n' +
                            'PC 또는 모바일 웹에서 ' +
                            '인증을 진행해주세요.',
                            [
                                {text: '확인', onPress: () => {}},
                            ]);
                    }
                }
            }else{
                this.failCallAPi()
            }
        })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
            });
    }

    controlDownload = (fileItem) => {
        if(fileItem.type==='file') {
            this.fileDownload(fileItem)
        } else {
            if(fileItem.url)
                Linking.openURL(url);
        }
    }

    fileDownload = async(fileItem) => {
        this.setState({

        })
    }

    onLayoutHeader4 = (evt ) => {
        //console.log('height freedata',evt.nativeEvent.layout);    
        //this.props.screenState.tabsSetupHeight(4,evt.nativeEvent.layout.height)
    }

    androidStatusSetup = async(bool) => {    
        if (Platform.OS === "android") {            
            StatusBar.setTranslucent(bool);
        }
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={[styles.container,{paddingTop:20}]}><ActivityIndicator size="large" /></View>
            )
        }else {

            return (
            <View style={styles.container} onLayout={(e)=>this.onLayoutHeader4(e)}>  
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
                <View style={{flex:1,padding:5}}>
                    {
                        this.state.freeDataList.length > 0 ?
                        this.state.freeDataList.map((titem, index) => {     
                            return(                           
                                <View style={styles.itemWrap} key={index}>                                
                                    <View style={{flex:10}}>
                                        <CustomTextR 
                                            numberOfLines={1} ellipsizeMode = 'tail' 
                                            style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.9}}
                                        >{titem.title}
                                        </CustomTextR>
                                    </View>
                                    <TouchableOpacity 
                                        onPress= {()=> this.authUser(titem)}
                                        style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                        <Image
                                            style={{ width: 12, height: 12, }}
                                            source={require('../../../assets/icons/btn_list_detail.png')} />
                                    </TouchableOpacity>
                                
                                </View>
                            )
                        })
                        :
                        <View style={[styles.IndicatorContainer,{paddingTop:20}]}>
                            <CustomTextR style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),color:DEFAULT_COLOR.base_color_666,letterSpacing:-0.9}}>이 교재에는 무료자료를 제공하지 않습니다.</CustomTextR>
                        </View>
                    }
                </View>   
                
            </View>
            )
        }    
   }

    renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.showModal}
                onRequestClose={() => {
                    this.setState({showModal:false})
                }}
                animationInTiming={300}
                animationOutTiming={300}
                hideModalContentWhileAnimating
                isVisible={this.state.showModal}>

                <SafeAreaView style={[styles.modalContainer]}>
                    <View style={styles.modalBackgrounder}>

                    </View>

                    <View style={styles.modalWrapper}>
                        <View style={styles.modalContent}>
                            <ScrollView
                                style={styles.modalScroll}
                                //onLayout={(event) => this.onLayoutScrollView(event)}
                                indicatorStyle='black'>
                                {
                                    this.state.selectedFileItem.url.split('|').map((item, index) => {
                                        return (
                                            <View style={styles.modalItem} key={index}>
                                                <TouchableOpacity
                                                    style={styles.modalItemWrapper}
                                                    onPress={() =>
                                                        item.state === STATE_DOWNLOAD_READY
                                                            ?
                                                            //this.requestWriteStoragePermission(index)
                                                            //this.alertDownloadFile(index)
                                                            this.checkLogin(index)
                                                            : item.state === STATE_DOWNLOAD_PROGRESS
                                                            ? function(){}
                                                            :
                                                            Platform.OS == 'ios'
                                                            &&
                                                            this.share(
                                                                this.mapMimeType(this.state.lectureItem.files[index].appendExt),
                                                                this.state.lectureItem.files[index].localFilePath
                                                            )
                                                    }
                                                >
                                                    <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                    </View>

                                                    <View style={styles.modalItemIconSelectedWrapperCenter}>
                                                        <CustomTextR
                                                            style={
                                                                item.state === STATE_DOWNLOAD_COMPLETE
                                                                    ? styles.modalItemTextComplete
                                                                    : styles.modalItemText
                                                            }
                                                            numberOfLines={1}
                                                            ellipsizeMode='middle'
                                                        >
                                                            {item.fileName}
                                                        </CustomTextR>
                                                    </View>

                                                    <View style={styles.modalItemIconSelectedWrapperRight}>
                                                        {/*
                                                        <Image
                                                            style={styles.modalItemIconSelected}
                                                            source={require('../../../assets/icons/btn_check_list.png')}/>
                                                        */}
                                                        {
                                                            item.state === STATE_DOWNLOAD_READY
                                                                ?
                                                                <Image
                                                                    style={styles.downIcon}
                                                                    source={require('../../../assets/icons/icon_download.png')}/>
                                                                : item.state === STATE_DOWNLOAD_PROGRESS
                                                                ?
                                                                Platform.OS == 'ios'
                                                                    ?
                                                                    <CustomTextB style={styles.downPercent}>
                                                                        {item.downloadPercent === undefined ? 0 : item.downloadPercent}%
                                                                    </CustomTextB>
                                                                    :
                                                                    <ActivityIndicator
                                                                        style={styles.downIndicator}
                                                                        size="small"/>
                                                                :
                                                                <Image
                                                                    style={styles.completeIcon}
                                                                    source={require('../../../assets/icons/icon_done.png')}/>
                                                        }
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                                <LinearGradient
                                    pointerEvents={'none'}
                                    colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.95)", "rgba(255,255,255,1.00)"]}
                                    //colors={["rgba(255,255,255,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.9)"]}
                                    locations={[0, 0.70, 1]}
                                    style={{position: "absolute", height: this.state.heightScrollView, width: "100%", }}/>
                            </ScrollView>
                            <View style={styles.cancelButton}>
                                <TouchableOpacity
                                    style={styles.cancelButtonWrapper}
                                    onPress={() => this.toggleModal()}>
                                    <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}


const styles = StyleSheet.create ({
    container: {
      
      
    },
    itemWrap : {        
        flexDirection : 'row',
        marginHorizontal:10,        
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        marginVertical:10,        
        paddingVertical:10
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /** Modal **/
    modalContainer: {
        backgroundColor: 'transparent',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalBackgrounder: {
        flex: 2,
        backgroundColor: '#00000055',
    },
    modalWrapper: {
        flex: 3,
        backgroundColor: '#00000055',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff
    },
    modalScroll: {

    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        color: DEFAULT_COLOR.base_color_222,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: 16 * 1.42,
    },
    modalItemTextComplete: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: 16 * 1.42,
    },
    modalItemIconSelectedWrapperLeft: {
        flex: 1.5,
        alignItems: 'center',
    },
    modalItemIconSelectedWrapperCenter: {
        flex: 7,
    },
    modalItemIconSelectedWrapperRight: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 17,
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
    },
    downIcon: {
        //width: DOWNLOAD_BUTTON_HEIGHT / 3,
        //height: DOWNLOAD_BUTTON_HEIGHT / 3,
        width: 15,
        height: 14,
        //alignSelf: 'center',
    },
    completeIcon: {
        //width: DOWNLOAD_BUTTON_HEIGHT / 3,
        //height: DOWNLOAD_BUTTON_HEIGHT / 3,
        width: 15,
        height: 15,
        //alignSelf: 'center',
    },
    downIndicator: {
        color: DEFAULT_COLOR.lecture_base,
    },
    downPercent: {
        color: DEFAULT_COLOR.lecture_base,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(16),
        lineHeight: 16 * 1.42,
    },
})



function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,
        nowScrollY: state.GlabalStatus.nowScrollY,
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
        userToken: state.GlabalStatus.userToken,
    };
}



export default connect(mapStateToProps, null)(FreeDatacreen);
