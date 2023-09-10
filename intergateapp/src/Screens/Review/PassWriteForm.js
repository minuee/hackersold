import React, { Component } from 'react';
import {SafeAreaView,Platform,StatusBar,View,Image,Alert,StyleSheet,Text,Dimensions,PixelRatio,BackHandler,TextInput,ScrollView,TouchableOpacity,Animated,ActivityIndicator
} from 'react-native';
import { Overlay } from 'react-native-elements';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import { NavigationEvents } from 'react-navigation';
import ImagePicker from 'react-native-image-picker'
import ImageView from '../../Utils/ImageViewer/ImageViewReviewCreate';

//import DocumentPicker from 'react-native-document-picker';
import {Rating,Input} from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/FontAwesome';
Icon2.loadFont();
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import AsyncStorage from '@react-native-community/async-storage';
import Upload from 'react-native-background-upload';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM,TextRobotoR} from '../../Style/CustomText';

const MAXIMUM_UPLOAD_COUNT = 20;

import ModalSearchPass from './ModalSearchPass';

function shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}


class PassWriteForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isuploading : false,
            file_url : [],
            currentUploadCount: 0,
            isFormMode : 0,
            formMemberIdx : this.props.navigation.state.params.memberIdx,
            formCategoryNames : [],
            formCategoryArrays : [],
            formTitle : null,
            formContents : null,
            ismode : null,
            categoryIdx : 0,
            showAttachShow : true,
            showAttachMode : false,
            attachFileSize : 0,
            photoarray: [],
            selectCategory : this.selectCategory.bind(this),
            imageIndex: null,
            isImageViewVisible: false,
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

    _setNavigationParams(){
        let newLeft = <View style={{flex:1,width:50}}>
            <Icon name="left" size={25} color="#fff" style={{textAlign : 'right', paddingRight:10}}
        onPress={()=> this.customBack()} /></View>;
        let newRight = <TouchableOpacity onPress={()=> this.saveformData(true)} style={{flexDirection:'row',flexGrow:1,textAlign:'center',alignItems:'center',paddingRight:20}}><Icon name="edit" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)} color="#80ffff" style={{textAlign : 'right', paddingRight:10}} /><CustomTextR style={{color:'#80ffff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>등록</CustomTextR></TouchableOpacity>;
        this.props.navigation.setParams({
            newRight,
            newLeft
        });
    }

    async UNSAFE_componentWillMount() {             
        await this._setNavigationParams();
        if ( typeof this.props.navigation.getParam('reviewpassTemp') !== 'undefined' ) {
            await this.setState({            
                //formMemberIdx : tempdata.formMemberIdx,
                isFormMode : this.props.navigation.state.params.reviewData.reviewIdx,
                formTeacher : typeof this.props.navigation.state.params.reviewData.teacherName !== 'undefined' ? this.props.navigation.state.params.reviewData.teacherName : null ,
                formStar : typeof this.props.navigation.state.params.reviewData.starScore !== 'undefined' ? this.props.navigation.state.params.reviewData.starScore : 0,
                formTitle : typeof this.props.navigation.state.params.reviewData.title !== 'undefined' ? this.props.navigation.state.params.reviewData.title : null ,
                formContents : typeof this.props.navigation.state.params.reviewData.content !== 'undefined' ? this.props.navigation.state.params.reviewData.content : null
            })
        }
        
        await this.refreshTextBookInfo();
    }   

    componentDidMount() {     
        if ( typeof this.props.navigation.getParam('reviewpassTemp') === 'undefined' ) {
            setTimeout(
                () => {
                    this.getHistory();   
                },500)
             
        }   
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
        /*
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            Platform.OS === 'android' && StatusBar.setBackgroundColor('#173f82');
        });
        */
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        //this._navListener.remove();
    }  

    getHistory = async() => {                
        AsyncStorage.getItem('reviewpassTemp', (error, result) => {
            {   
                if(result) {                    
                   this.setState({tempData : JSON.parse(result)});
                    Alert.alert(
                        "해커스통합앱 : 합격수기작성",
                        "이전에 작성중인 데이터가 있습니다. \n불러오겠습니까?",
                        [
                            {text: '네', onPress: this.callTempProcess.bind(this)},
                            {text: '아니오', onPress: () =>  AsyncStorage.removeItem('reviewpassTemp')},
                        ],
                        { cancelable: true }
                    )  
                    
                }
            }
        });   
    }

    callTempProcess = async() => {
        let tempdata = this.state.tempData;
        console.log('reviewpassTemp',tempdata)

        this.setState({            
            formMemberIdx : tempdata.formMemberIdx,            
            formCategoryNames : tempdata.formCategoryNames,            
            formTitle : tempdata.formTitle,
            formContents : tempdata.formContents
        })

    }
    refreshTextBookInfo = async() => {
        
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
        await CommonUtil.callAPI( aPIsDomain + '/v1/meta/pass',{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },10000
            ).then(response => {
                console.log('ressss', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        // console.log('response.data',response.data)
                        if ( typeof response.data !== 'undefined') {
                            this.setState({
                                formCategoryNames : response.data
                            })
                        }
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

    failCallAPi = () => {
     
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    handleBackButton = () => {
        return true;
    };

    customBack = () => {
        if ( this.state.formCategoryArrays.length > 0  ||  this.state.formTitle !== null || this.state.formContents !== null ) {

            Alert.alert(
                "해커스통합앱 : 합격수기작성",
                "작성중 상태입니다. \n임시저장하시겠습니까?(파일제외)",
                [
                    {text: '취소', onPress: null},
                    {text: '네', onPress: this.tempSaveProcess.bind(this)},
                    {text: '아니오', onPress: () => {                        
                        AsyncStorage.removeItem('reviewpassTemp');
                        this.props.navigation.goBack();
                        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                    }},
                ],
                { cancelable: true }
            )   

        }else{
            this.props.navigation.goBack(null)
        }
        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.6);
    closeModal = () => {
        this.setState({ 
            showModal: false,
            showAttachShow : true

         })
    };
    _showModal = async(categoryIdx, data) => {
        await this.setState({ 
            categoryIdx : categoryIdx,
            formCategoryArrays : this.state.formCategoryNames[categoryIdx].groupCategory
         })
         this.setState({showModal: true})
    };

    tempSaveProcess = async() => {
        await this.saveformData(0);
        const alerttoast = Toast.show('임시저장이 되었습니다.');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)         
        }, 2000)
    }

    selectCategory = (shuffledPosts) => {
        this.state.formCategoryNames[this.state.categoryIdx].groupCategory.checkedName  = shuffledPosts
        this.setState({showModal:false})
    }

    

    ratingCompleted = (rating) => {
        this.setState({formStar:rating});
    }

    saveformData = async(mode) => {

        if ( mode || this.state.isFormMode > 0 ) {

            
            if ( !this.state.formCategoryArrays.length === 0  ) {
                let message = "`카테고리`를 선택해 주세요";
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
            Alert.alert(
                "해커스통합앱 : 합격수기작성",
                "등록하시겠습니까",
                [
                    {text: '네', onPress: () => this.regProcess(this.state.isFormMode)},
                    {text: '아니오', onPress: () =>  null},
                ],
                { cancelable: false }
            ) 
            
        }else{
            await  AsyncStorage.removeItem('reviewpassTemp');
            let newData = {formMemberIdx : this.state.formMemberIdx,formCategoryNames : this.state.formCategoryNames,formTitle : this.state.formTitle,formContents : this.state.formContents}
            AsyncStorage.setItem('reviewpassTemp', JSON.stringify(newData));
    
        }
        
    }


    registFile = async(index) => {
        console.log('this.state.photoarray', this.state.photoarray)
        let returnData = null;
        if ( this.state.photoarray.length > 0 ) { 
            const options = {
                url: DEFAULT_CONSTANTS.imageUploadDomain,
                path: this.state.photoarray[index].uri,
                method: 'POST',
                field : 'upload_files[]',
                type: 'multipart',
                maxRetries: 2,
                headers: {
                    'Content-Type': 'multipart/form-data;',
                    'apiKey': DEFAULT_CONSTANTS.apitestKey
                },
                notification: {
                    enabled: false
                },
            }

            await Upload.startUpload(options).then((uploadId) => {
                Upload.addListener('progress', uploadId, (data) => {
                })
                Upload.addListener('error', uploadId, (data) => {                
                })
                Upload.addListener('cancelled', uploadId, (data) => {
                    
                })
                Upload.addListener('completed', uploadId, (data) => {
                    let res = JSON.parse(CommonFuncion.unicodeToKor(data.responseBody))
                    if(res.result) {                        
                        let new_file_url = this.state.file_url;
                        new_file_url.push({'url':res.file_url[0]})

                        let nextUploadIndex = -1;
                        let new_photoarray = [];
                        this.state.photoarray.map((newItem, newIndex) => {
                            if(index == newIndex) {
                                new_photoarray.push({...newItem, isUpload: true})
                            } else {
                                if(nextUploadIndex == -1 && (newItem.isUpload == false || newItem.isUpload == undefined)) {
                                    nextUploadIndex = newIndex
                                }
                                new_photoarray.push({...newItem});
                            }
                        });
                        this.setState({
                            photoarray: new_photoarray,
                            file_url: new_file_url,
                            currentUploadCount: this.state.currentUploadCount + 1,
                        });

                        if(nextUploadIndex == -1) {
                            setTimeout(() => {
                                this.formUpload(this.state.file_url);
                            }, 500)

                        } else {
                            if(this.state.currentUploadCount >= MAXIMUM_UPLOAD_COUNT) {
                                console.log('registFile()', 'EXCEED UPLOAD COUNT MAXIMUM');
                                setTimeout(() => {
                                    this.formUpload(this.state.file_url);
                                }, 500)
                            } else {
                                this.registFile(nextUploadIndex)
                            }
                        }
                    
                    } else {            
                        this.setState({isuploading : false})        
                        let message = '파일 업로드에 실패하였습니다';
                        let timesecond = 2000;
                        CommonFuncion.fn_call_toast(message,timesecond);
                    }
                })
            }).catch((err) => {      
                this.setState({isuploading : false})      
                let message = '파일 업로드에 실패하였습니다';
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
            })
        }else{
            returnData = null;
        }
        return returnData;
    }
  
    regProcess = async(reviewIdx) => {
        console.log('reviewIdx', reviewIdx)
        this.setState({isuploading : true})
        if ( this.state.photoarray.length > 0 ) {
            this.setState({file_url : []})
            await this.registFile(0);            
        }else{
            await this.formUpload(null);
        }
        
        
    }


    formUpload = async (mode) => {        
        const formData = new FormData();       
        //formData.append('classIdx', 7285);
        formData.append('category', this.state.formCategoryNames[this.state.categoryIdx].groupCategory.checkedName);
        formData.append('memberIdx', this.state.formMemberIdx);
        formData.append('title', this.state.formTitle);               
        formData.append('attachFile', JSON.stringify(this.state.file_url));
        formData.append('content', this.state.formContents);

        //let aPIsDomain = typeof this.props.myInterestCodeOne.info.ApiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.ApiDomain : DEFAULT_CONSTANTS.apiTestDomain
        //let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.ApiKey !== 'undefined' ? this.props.myInterestCodeOne.info.ApiKey : DEFAULT_CONSTANTS.apitestKey
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey

        console.log('PassWriteForm.js > formUpload()', 'url = ' + aPIsDomain + '/v1/review/pass')
        console.log('PassWriteForm.js > formUpload()', 'formData = ' + JSON.stringify(formData))

        await CommonUtil.callAPI( aPIsDomain + '/v1/review/pass/',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'multipart/form-data',
                'apiKey': aPIsAuthKey
            }), 
                body:formData
            },10000
            ).then(response => {

                console.log('PassWriteForm.js > formUpload()', 'response = ' + JSON.stringify(response))

                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        AsyncStorage.removeItem('reviewpassTemp');
                        this.setState({isuploading : false})
                        const alerttoast = Toast.show('등록 되었습니다');
                        setTimeout(() => {
                            Toast.hide(alerttoast);                         
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                            this.props.navigation.goBack()
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

    failCallAPi = () => {
     
        let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    removeAttachImage = async(idx) => {
        selectedFilterList = await this.state.photoarray.filter(function(info,index) { return index !== idx });
        this.setState({
            photoarray : selectedFilterList
        })
    }


    localcheckfile = () => {
        const options = {
            noData: true,
        }  
        ImagePicker.launchImageLibrary(options, response => {
            try {
                if(response.type.indexOf('image') != -1) {
                    if (response.uri) {
                        //console.log('response.uri', response)
                        if ( parseInt((this.state.attachFileSize+response.fileSize)/1024/1024) > 50 ) {
                            Alert.alert('image upload error', '50MB를 초과하였습니다.');
                            return;
                        }else{
                            this.state.photoarray.push({type : response.type === undefined ? 'txt' :  response.type,uri : response.uri, height:response.height,width:response.width,fileSize:response.fileSize,fileName:response.fileName});
                            this.setState({
                                ismode:'upload',
                                attachFileSize :  this.state.attachFileSize+response.fileSize
                            })
                            this.ScrollView.scrollToEnd({ animated: true});
                        }
                        
                    }
                }else{
                    Alert.alert('image upload error', '정상적인 이미지 파일이 아닙니다.');
                    return;
                }
            }catch(e){
                console.log("eerorr ", e)        
            }
        })
    }
    
    handleChoosePhoto = async() => {
              
        await this.localcheckfile();
        //this.setState({ photo: photoarray });
        console.log('this.state.photoarray', this.state.photoarray)
        this.setState({ismode:null})        
    }
   

    renderImageUpload (){        
        return (
            <View style={{flex:1,flexDirection:'row',marginBottom:10,paddingLeft:10}}>
                {
                    this.state.photoarray.map((data, index) => {                        
                        return (                
                            <TouchableOpacity
                                style={{flex:1,padding:5,width:80}}
                                onPress={() => {
                                    this.setState({
                                        imageIndex: index,
                                        isImageViewVisible: true,
                                    })
                                }}
                                key={index}
                                >
                                <Image
                                    source={{ uri: data.uri }}
                                    resizeMode='cover'
                                    style={{ width: "100%", height: '100%' }}
                                />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        width: 80 / 2.5,
                                        height: 80 / 2.5,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                    onPress={() => this.removeAttachImage(index)}>
                                    <Image
                                        style={{
                                            width: 80 / 2.5,
                                            height: 80 / 2.5,
                                        }}
                                        source={require('../../../assets/icons/btn_img_file_del.png')}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    )
                }

                {
                    this.state.photoarray.length < 5
                        &&
                            <TouchableOpacity
                                onPress={() => this.handleChoosePhoto()}
                                style={{flex:1,padding:20,margin:5,borderWidth:1,borderColor:'#ccc'}}>
                                <Icon name="plus" size={25} color="#ccc" />
                            </TouchableOpacity>
                }
            </View>
        )
    }

    attachShow = (bool) => {
        this.setState({showAttachShow:bool})
    }
    startTouch = () => {
        this.setState({showAttachShow : !this.state.showAttachShow})
        if ( this.state.showAttachMode ) {
            this.setState({showAttachMode : false})
        }
        //console.debug("You start so don't stop!??",this.state.showAttachShow);
    }
    
    stopTouch = () => {
        //console.debug("Why you stop??");
    }
    
    render() {
        return(
            <SafeAreaView  style={ styles.container}>
                <NavigationEvents
                        onWillFocus={payload => {
                            console.log('writeform nWillFocus');
                        }}
                        onDidFocus={payload => {
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);                               
                            
                           }
                        }
                        onWillBlur={payload => {                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                            }
                        }
                        onDidBlur={payload => 
                            {                            
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                                
                            }
                        }
                    />
                
                <Modal
                    onBackdropPress={this.closeModal}
                    style={{justifyContent: 'flex-end',margin: 0}}
                    useNativeDriver={true}
                    animationInTiming={300}
                    animationOutTiming={300}
                    hideModalContentWhileAnimating
                    isVisible={this.state.showModal}>
                    <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                        <View style={styles.modalWrapper}>
                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                                카테고리를 선택해주세요
                            </CustomTextR>
                            <TouchableOpacity 
                                onPress= {()=> this.closeModal()}
                                style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                                <Icon name="close" size={25} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,justifyContent: 'flex-start'}}>
                            <ModalSearchPass screenState={this.state} />
                        </View>
                    </Animated.View>
                </Modal>

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

                {/* form */}                
                <ScrollView
                    onResponderGrant = { () => this.startTouch() }
                    onResponderRelease = { () => this.stopTouch() }
                    onStartShouldSetResponder = { (e) => {return true} }
                >
                    <View style={{flex:2,marginTop:10}}>
                            <View style={{flex:1,paddingVertical:10,paddingLeft:15}}>
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>카테고리 선택</CustomTextB>
                            </View>                            
                            {
                            this.state.formCategoryNames.length > 0 ? 
                            
                                this.state.formCategoryNames.map((post,postidx) => {   
                                /*
                                let isIndexOf = this.state.formCategoryArrays.findIndex(
                                    info => info.index === item.productIdx
                                );  
                                console.log('isIndexOf : ',isIndexOf)
                                */
                                return (
                                    <View style={{flex:1,paddingHorizontal:15,marginBottom:10}} key={postidx} >                                
                                        <TouchableOpacity
                                            style={[styles.inputDisable,{flexDirection:'row',flexGrow:1}]}
                                            onPress={()=>this._showModal(postidx,post)}
                                        >
                                            <View style={{paddingHorizontal:5}}>
                                                <CustomTextR style={styles.inputDisableText}>
                                                   {typeof post.groupCategory.checkedName !== 'undefined' ? post.groupCategory.checkedName : '카테고리를 선택해주세요'}
                                                </CustomTextR>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                                })
                            
                            : 
                                <View style={{flex:1,paddingHorizontal:15}}>                                
                                    <TouchableOpacity
                                        style={styles.inputDisable}
                                    >
                                        <CustomTextR style={styles.inputDisableText}>카테고리를 선택해주세요</CustomTextR>
                                    </TouchableOpacity>
                                </View>
                            }

                            <View style={{flex:1,paddingVertical:10,paddingLeft:15,marginTop:10}}>
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,letterSpacing:-0.7,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.75}}>합격수기작성</CustomTextB>
                            </View> 

                            <View style={{flex:1}}>
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    {/*
                                    <Input 
                                        placeholder='제목을 입력해주세요'
                                        onChangeText={text=>this.setState({formTitle:text})}
                                        inputContainerStyle={{borderWidth:1,borderColor:DEFAULT_COLOR.base_color_fff}}
                                        onFocus={()=> this.startTouch()}
                                        onBlur={() => this.attachShow(true) }
                                        value={this.state.formTitle}  
                                    />
                                    */}
                                    <Input 
                                        placeholder=' 제목을 입력해주세요'
                                        onChangeText={text=>this.setState({formTitle:text})}
                                        inputContainerStyle={{borderWidth:1,borderColor:'#d8d8d8',borderRadius:4}}
                                        onFocus={()=> this.startTouch()}
                                        onBlur={() => this.attachShow(true) }
                                        value={this.state.formTitle}
                                    />
                                </View>
                            </View>                
                        
                            <View style={{flex:1,paddingHorizontal:15,marginTop:10}}>
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
                { this.state.showAttachMode ?
                    <View style={{height:130,backgroundColor:'#505253'}}>
                        <View style={{height:40,flexGrow:1,flexDirection:'row',paddingTop:10,paddingHorizontal:20}}>
                            <View style={{flex:1,alignItems:'flex-end',paddingRight:5}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>첨부된 파일</CustomTextR>
                            </View>
                            <View style={{flex:1,alignItems:'flex-start',paddingLeft:5,paddingTop:2}}>
                                <TextRobotoR style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                    {this.state.attachFileSize > 0 ? parseInt(this.state.attachFileSize/1024/1024) : 0} / 50MB
                                </TextRobotoR>
                            </View>
                            
                            
                        </View>
                        <ScrollView 
                            ref={(ref) => {
                                this.ScrollView = ref;
                            }}
                            horizontal={true} 
                        >
                            {this.renderImageUpload()}
                        </ScrollView>
                    </View>
                    :
                    this.state.showAttachShow &&
                        <TouchableOpacity 
                            onPress={() => this.setState({showAttachMode:true})}
                            style={{flexDirection:'row',height:50,borderColor:'#505253',borderWidth:1,margin:15,alignItems:'center',justifyContent:'center',borderRadius:5}}
                            >
                            <Image source={require('../../../assets/icons/icon_clip.png')} style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}} />
                            <CustomTextM style={{paddingLeft:10,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>파일첨부</CustomTextM>
                        </TouchableOpacity>
                }

                {
                    (
                        this.state.photoarray !== null
                        && this.state.photoarray !== undefined
                        && this.state.photoarray.length != 0
                    )
                    &&
                    <ImageView
                        glideAlways
                        images={this.state.photoarray}
                        imageIndex={this.state.imageIndex}
                        controls={true}
                        animationType="fade"
                        isVisible={this.state.isImageViewVisible}
                        renderFooter={(currentImage) => (
                            <View style={[
                                styles.footer,
                                {
                                    backgroundColor: 'transparent',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }
                            ]}>
                                <Text style={[
                                    styles.footerText,
                                    {
                                        fontWeight: 'bold',
                                    }
                                ]}>
                                    {(this.state.imageIndex + 1) + " "}
                                </Text>
                                <Text style={styles.footerText}>
                                    / {this.state.photoarray.length}
                                </Text>
                            </View>)}
                        onClose={() => this.setState({
                            isImageViewVisible: false,
                            imageIndex: null
                        })}
                        onImageChange={index => {
                            this.setState({imageIndex: index})
                        }}
                    />
                }
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
        color:DEFAULT_COLOR.base_color_222,fontWeight:'bold',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    inputDisable : {
        padding:10,borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:5,backgroundColor:'#f7f7f7'
    },
    inputDisableText : {
        color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
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

    footerText: {
        color: DEFAULT_COLOR.base_color_fff,
        fontSize: PixelRatio.roundToNearestPixel(18),
        lineHeight: 18 * 1.42,
    },
});


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}
export default connect(mapStateToProps, null)(PassWriteForm);