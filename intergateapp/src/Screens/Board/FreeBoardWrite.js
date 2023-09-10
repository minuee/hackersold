import React, { Component } from 'react';
import {SafeAreaView,Platform,StatusBar,View,Image,Alert,StyleSheet,Text,Dimensions,PixelRatio,BackHandler,TextInput,ScrollView,TouchableOpacity,Animated,ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import { NavigationEvents } from 'react-navigation';
import {Input,Overlay} from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/FontAwesome';
Icon2.loadFont();
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

import InterestSelect from '../../../InterestSelect';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;

//필터
import  * as SpamWords   from '../../Constants/FilterWords';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const createFormData = (photo, body) => {
    const fdata = new FormData();
    //console.log("photo". photo);
    fdata.append("photo", {
        name: photo.fileName,
        type: photo.type,
        uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
        fdata.append(key, body[key]);
    });
    //console.log("returdata". fdata);
    return fdata;
};

class FreeBoardWrite extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isuploading : false,
            interestMode : 'once',
            myInterestCodeOne : null,
            attentionSelectCode : null,
            attentionSelectName : null,
            attentionSelectRGB : null,
            formArticleIdx : this.props.navigation.getParam('articleIdx'),
            setMyInterest : this.setMyInterest.bind(this),
            formMemberIdx : this.props.navigation.getParam('memberIdx'),
            formTitle : null,
            formContents : null,
            ismode : null,
            showAttachShow : true,
            showAttachMode : false,
            showModal : false,
            attachFileSize : 0,
            photoarray: []
        }
    }


    static navigationOptions = ({navigation}) => {

        //console.log('question 2',navigation)
        const params =  navigation.state.params || {};        
        return {
            headerTitle: null,
            headerRight: params.newRight,
            headerLeft : params.newLeft,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: '#transparent',
                height:40
            },
            headerTintColor: '#fff'
        }
    };

    _setNavigationParams(formArticleIdx){
        let newLeft = <View style={{flex:1,width:50}}>
            <Icon name="left" size={25} color="#fff" style={{textAlign : 'right', paddingRight:10}}
        onPress={()=> this.customBack()} /></View>;
        let newRight = <TouchableOpacity onPress={()=> this.saveformData(true)} style={{flexDirection:'row',flexGrow:1,textAlign:'center',alignItems:'center',paddingRight:20}}><Icon name="edit" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)} color="#80ffff" style={{textAlign : 'right', paddingRight:10}} /><Text style={{color:'#80ffff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>{ formArticleIdx!==  null && typeof formArticleIdx!==  'undefined' ? '수정' :'등록'}</Text></TouchableOpacity>;
        this.props.navigation.setParams({
            newRight,
            newLeft
        });
    }

    async UNSAFE_componentWillMount() {   
        console.log('formArticleIdx', this.props.navigation.getParam('articleIdx'));
        this._setNavigationParams(this.props.navigation.getParam('articleIdx'));

        if ( typeof this.props.navigation.getParam('articleIdx') !== 'undefined' && this.props.navigation.getParam('articleIdx') > 0 ) {
            this.setState({isuploading:true})
            await this.refreshTextBookInfo(this.props.navigation.getParam('articleIdx'));
        }
    }   


    componentDidMount() {     
        if ( typeof this.props.navigation.getParam('reviewData') === 'undefined' && typeof this.props.navigation.getParam('articleIdx') === 'undefined') {
            setTimeout(
                () => {
                    this.getHistory();   
                },500)
             
        }   
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);                  
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }  

    handleBackButton = () => {
        return true;
    };

    refreshTextBookInfo = async(idx) => {        
        
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article/'+idx+'/0' ,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {       
                console.log('response', response)         
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {                        
                        this.setState({isuploading:false})    
                        this.handleBackButtonError();
                    }else{
                        this.setState({
                            isuploading : false,                            
                            attentionSelectCode : response.data.articles.interestFieldId,
                            attentionSelectName : response.data.articles.interestFieldName,
                            formTitle : response.data.articles.title,
                            formContents : response.data.articles.content
                        })
                    }

                }else{                    
                    this.setState({isuploading:false})    
                    this.handleBackButtonError();
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                
                this.setState({isuploading:false})    
                this.handleBackButtonError();
        });
    }

    handleBackButtonError = () => {
        const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)
        }, 2000)
    }

    customBack = () => {
        if ( this.state.formArticleIdx ) {
            
            Alert.alert(
                DEFAULT_CONSTANTS.appName + " : 자유게시판",
                "수정작업을 취소하시겠습니까?",
                [
                    {text: '네', onPress: () => this.props.navigation.goBack(null) },
                    {text: '아니오', onPress: () => console.log('cancled') },
                ],
                { cancelable: false }
            )  

        }else{

            if ( this.state.attentionSelectCode !== null || this.state.formTitle != null || this.state.formContents != null ) {
                Alert.alert(
                    DEFAULT_CONSTANTS.appName +  " : 자유게시판",
                    "작성중 상태입니다. \n임시저장하시겠습니까?",
                    [
                        {text: '네', onPress: this.tempSaveProcess.bind(this)},
                        {text: '아니오', onPress: () => this.props.navigation.goBack(null) },
                    ],
                    { cancelable: false }
                )  

            }else{
                this.props.navigation.goBack(null)
            }
        }        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    closeModal = () => {
        this.setState({ 
            showModal: false,
            showAttachShow : true

         })
    };
    showModal = () => {        
        this.setState({ 
            showModal: true,
            //showAttachShow : false
         })
    };

    setMyInterest = async(code,name,data,color) => {        
        await this.setState({
            myInterestCodeOne : data,
            attentionSelectCode : code,
            attentionSelectName : name,
            attentionSelectRGB : color,
            showModal : false
        })
    }

    tempSaveProcess = async() => {
        await this.saveformData(0);
        const alerttoast = Toast.show('임시저장이 되었습니다.');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)         
        }, 2000)
    }

 
    getHistory = async() => {                
        AsyncStorage.getItem('freeBoardTemp', (error, result) => {
            {   
                if(result) {                    
                   this.setState({tempData : JSON.parse(result)});
                    Alert.alert(
                    DEFAULT_CONSTANTS.appName  +  " : 자유게시판",
                        "이전에 작성중인 데이터가 있습니다. \n불러오겠습니까?",
                        [                            
                            {text: '네', onPress: this.callTempProcess.bind(this)},
                            {text: '아니오', onPress: () => {                        
                                AsyncStorage.removeItem('freeBoardTemp');
                            }}
                        ],
                        { cancelable: true }
                    )  
                    
                }
            }
        });   
    }

    callTempProcess = async() => {
        let tempdata = this.state.tempData;
        
        this.setState({            
            formMemberIdx : tempdata.formMemberIdx,
            attentionSelectCode : tempdata.attentionSelectCode,
            attentionSelectName : tempdata.attentionSelectName,
            formTitle : tempdata.formTitle,
            formContents : tempdata.formContents
        })

    }

    saveformData = async(mode) => {
        // mode true : 등록, false : 임시저장
         if ( mode || this.state.isFormMode > 0 ) {
            console.log('this.state.attentionSelectCode',this.state.attentionSelectCode)
            if ( !this.state.attentionSelectCode  ) {
                let message = "`관심분야`를 선택해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }             

            if ( !this.state.formTitle ) {
                let message = "`제목`를 입력해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }

            if ( !this.state.formContents ) {
                let message = "`내용`를 입력해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
                return false;
            }

            let isMode =  !CommonUtil.isEmpty(this.state.formArticleIdx) ? '수정' : '등록';
            Alert.alert(
                DEFAULT_CONSTANTS.appName + " : 자유게시판 글작성",
                isMode + "하시겠습니까",
                [
                    {text: '네', onPress: () => this.formUpload()},
                    {text: '아니오', onPress: () =>  null},
                ],
                { cancelable: false }
            ) 
            
        }else{
            await  AsyncStorage.removeItem('freeBoardTemp');
            let newData = {formMemberIdx : this.state.formMemberIdx,attentionSelectCode : this.state.attentionSelectCode,attentionSelectName : this.state.attentionSelectName,formTitle : this.state.formTitle,formContents : this.state.formContents}
            AsyncStorage.setItem('freeBoardTemp', JSON.stringify(newData));
    
        }
    }

    customGoBack(ismode = false ) {
        const { navigation } = this.props;
        navigation.goBack();
        console.log('11111')
        if ( ismode) {
            console.log('22222',ismode)
            navigation.state.params.onRefreshMode({ isRefresh: true });
        }
      }

    formUpload = async () => {
        let formContents = await CommonFuncion.isForbiddenWord( this.state.formContents, SpamWords.FilterWords.badWords) 
        let formTitle = await CommonFuncion.isForbiddenWord( this.state.formTitle, SpamWords.FilterWords.badWords) 

        const formData = new FormData();       
        formData.append('interestFieldId', this.state.attentionSelectCode);        
        formData.append('memberIdx', this.state.formMemberIdx);//this.state.formMemberIdx);
        formData.append('title', formTitle);        
        //formData.append('content', JSON.stringify(CommonFuncion.escapeHtml(formContents)));        
        formData.append('articleIdx', this.state.formArticleIdx || '');
        formData.append('content', formContents);
        console.log('formData2', formData)
        let isMode =  !CommonUtil.isEmpty(this.state.formArticleIdx) ? '수정' : '등록';
        
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain  + '/v1/app/board/article',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'multipart/form-data',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:formData
            },10000
            ).then(response => {
                console.log('response', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        AsyncStorage.removeItem('freeBoardTemp');
                        this.setState({isuploading : false})
                        const alerttoast = Toast.show( isMode + '되었습니다');
                        setTimeout(() => {
                            Toast.hide(alerttoast);
                            //if ( this.state.formArticleIdx === null ) {
                                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                                //this.props.navigation.goBack()
                                this.customGoBack(true);
                            //}
                        }, 2000)
                    }

                }else{
                    this.setState({isuploading : false})
                    this.failCallAPi()
                }
                
            })
            .catch(err => {
                this.setState({isuploading : false})
                console.log('login error => ', err);
                this.failCallAPi()
        });

       
    }

    ratingCompleted = (rating) =>  {
        this.setState({formStar:rating});
    }

    removeAttachImage = async(idx) => {
        selectedFilterList = await this.state.photoarray.filter((info,index) => index !== idx);
        this.setState({
            photoarray : selectedFilterList
        })
    }

    
    attachShow = (bool) => {
        this.setState({showAttachShow:bool})
    }
    startTouch = async() => {
        
    }
    
    stopTouch = () => {
        
    }

    failCallAPi = () => {
        let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }
    
    render() {
        return(
            <SafeAreaView 
                style={ styles.container}                
            >
                 { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                <NavigationEvents
                        onWillFocus={payload => {
                            console.log('writeform nWillFocus');
                        }}
                        onDidFocus={payload => {
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);   
                            console.log('writeform did focus');
                            
                           }
                        }
                        onWillBlur={payload => {
                            console.log('writeform will blur')
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                            }
                        }
                        onDidBlur={payload => 
                            {
                            console.log('writeform did blur');
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                                
                            }
                        }
                    />
                
                { this.state.isuploading &&
                    <View style={{zIndex:5,justifyContent:'center',alignItems:'center'}}>
                        <Overlay
                            isVisible={this.state.isuploading}
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"
                            containerStyle={{
                                flex:1,justifyContent:'center',alignItems:'center'
                            }}                            
                        >
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <View style={{flex:5,justifyContent:'center',alignItems:'center'}}>
                                    <ActivityIndicator size="large"  color={DEFAULT_COLOR.lecture_base} />
                                </View>
                                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>
                                        처리중입니다. 잠시만 기달려 주십시요
                                    </CustomTextR>
                                </View>
                            </View>
                            
                        </Overlay>
                    </View>
                }
        
                
                <ScrollView
                    onResponderGrant = { () => this.startTouch }
                    onResponderRelease = { () => this.stopTouch }
                    onStartShouldSetResponder = { (e) => {return true} }
                >
                    <View style={{flex:2,marginTop:10}}>
                        <View style={{flex:1,paddingVertical:10,paddingLeft:15}}>
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.75,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10}}>관심분야선텍</CustomTextB>
                        </View>                     
                        <View style={{flex:1,paddingHorizontal:15}}>
                            {this.state.attentionSelectCode !== null ? 
                            <TouchableOpacity
                                style={styles.inputDisable2}
                                onPress={()=>this.showModal()}
                            >
                                <Text style={styles.inputDisableText2}>
                                    {this.state.attentionSelectName }
                                </Text>
                            </TouchableOpacity>
                            
                            :
                            <TouchableOpacity
                                style={styles.inputDisable}
                                onPress={()=>this.showModal()}
                            >
                                <CustomTextR style={styles.inputDisableText}>
                                    관심분야를 선택해주세요
                                </CustomTextR>
                            </TouchableOpacity>
                            }
                        </View>
                        
                        <View style={{flex:1,paddingVertical:10,paddingLeft:15,marginTop:10}}>
                            <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.75,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),paddingRight:10}}>게시글작성</CustomTextB>
                        </View>                         
                        <View style={{flex:1,padding:5}}>
                            <Input 
                                placeholder=' 제목을 입력해주세요'
                                onChangeText={text=>this.setState({formTitle:text})}
                                inputContainerStyle={{borderWidth:1,borderColor:'#d8d8d8',borderRadius:4}}
                                onFocus={()=> this.startTouch()}
                                onBlur={() => this.attachShow(true) }
                                value={this.state.formTitle}
                            />
                        </View>                
                    
                        <View style={{flex:1,padding:5,marginHorizontal:10}}>
                            <TextInput 
                                style={{borderWidth:1,borderColor:'#d8d8d8',borderRadius:4,minHeight:Platform.OS === 'android' ? 100 : 200}}                                
                                placeholder=' 내용을 입력해주세요'
                                onChangeText={text=>this.setState({formContents:text})}
                                multiline={true}
                                defaultRating={2.5}
                                fractions={0.5}
                                showRating={false}
                                clearButtonMode='always'
                                //onFocus={()=>this.startTouch()}
                                onFocus={() => this.startTouch()}
                                onBlur={() => this.attachShow(true) }
                                value={this.state.formContents}
                            />
                        </View>
                    </View>
                </ScrollView>     
                {/* 여기서부터 검색필터 영역 */}
                <Modal
                        onBackdropPress={this._closeModal}
                        animationType="slide"
                        //transparent={true}
                        onRequestClose={() => {
                            this.setState({showModal:false})
                        }}
                        onBackdropPress={() => {
                            this.setState({showModal:false})
                        }}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating                    
                        isVisible={this.state.showModal}
                    >
                        
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <InterestSelect screenState={this.state} screenProps={this.props} />
                        </Animated.View>
                        
                    </Modal>          
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commonHr1 : {
        backgroundColor:'#ebebeb',height:10
    },
    requestTitleText : {
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    inputDisable : {
        padding:10,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#f7f7f7'
    },
    inputDisable2 : {
        padding:10,borderWidth:1,borderColor:DEFAULT_COLOR.lecture_base,borderRadius:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center'
    },
    inputDisableText : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    inputDisableText2 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    inputAble : {
        borderWidth:1,borderColor:'#ccc',borderRadius:5
    },

    /**** Modal  *******/
    modalContainer: {
        paddingTop: 16, backgroundColor: '#fff', borderTopLeftRadius: 8, borderTopRightRadius: 8
    },
    modalWrapper : {
        paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1
    },
    
    
});

/*
https://www.npmjs.com/package/react-native-document-picker
*/

function mapStateToProps(state) {
    return {       
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        myInterestCodeMulti: state.GlabalStatus.myInterestCodeMulti,   
        userToken: state.GlabalStatus.userToken,   
    };
}

export default connect(mapStateToProps, null)(FreeBoardWrite);