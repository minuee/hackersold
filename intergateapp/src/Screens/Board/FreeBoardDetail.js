import React, { Component } from 'react';
import {TouchableOpacity,ScrollView,View,StyleSheet,Text,Dimensions,PixelRatio,Image,ActivityIndicator,TextInput,Alert,Keyboard,BackHandler,StatusBar,Animated} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Modal from 'react-native-modal';
import Toast from 'react-native-tiny-toast';
import AsyncStorage from '@react-native-community/async-storage';
import 'moment/locale/ko'
import  moment  from  "moment";
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


import  * as SpamWords   from '../../Constants/FilterWords';
import { resumeDownload } from 'react-native-fs';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

class FreeBoardDetail extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading:true,            
            isMyArticle : false,
            showModifyForm : false,
            replyprocessing : false,
            historyTmp : [],
            memberIdx : 0,
            detailInfo : this.props.navigation.state.params,
            articleIdx : 0,
            formContents : '',
            targetReplyIdx : null,
            replyContents : [],
            fromHistory : typeof this.props.navigation.state.params.fromHistory !== 'undefined' ? true : false
        }
        
    }

    customGoBack(ismode = false ) {
        const { navigation } = this.props;
        navigation.goBack();
        if ( typeof this.props.navigation.state.params.fromHistory === 'undefined' || ismode) {            
            navigation.state.params.onRefreshMode({ isRefresh: true });
        }
      }

    static navigationOptions = ({navigation}) => {

        //console.log('question 2',navigation)
        const params =  navigation.state.params || {};        
        return {
           
            headerTitle: params.newtitle,
            headerRight: params.newheaderRight,
            headerLeft : params.newheaderLeft,
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: DEFAULT_COLOR.lecture_base,
                height:40
            },
            headerTintColor: '#fff'
        }
    };

    _setNavigationParams(){
        let newtitle = <View style={{flexGrow:1,textAlign:'center',alignItems:'center'}}><CustomTextR style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),letterSpacing:PixelRatio.roundToNearestPixel(-0.96)}}>게시글 상세</CustomTextR></View>;
        let newheaderLeft = <TouchableOpacity onPress={()=>{this.customGoBack(false); }} style={{flexGrow:1,textAlign:'center',alignItems:'center',paddingLeft:20}}><Image source={require('../../../assets/icons/btn_back_page.png')} style={{width: 17, height: 17}} /></TouchableOpacity>
        let newheaderRight = <View style={{flex:1,flexGrow:1,paddingRight:10}} >{ this.state.isMyArticle ? <TouchableOpacity onPress={()=>this.showButton()}><Image source={require('../../../assets/icons/btn_more_board.png')} style={{width:17,height:17}} /></TouchableOpacity> : null}</View>
        this.props.navigation.setParams({
            newtitle,
            newheaderLeft,
            newheaderRight
        });
    }

    async UNSAFE_componentWillMount() {      
        if ( this.props.userToken !== null ) {
            //console.log('this.props.userToken.memberIdx', JSON.parse(this.props.userToken).memberIdx)
            if ( typeof this.props.userToken.memberIdx !== 'undefined') {
                await this.setState({memberIdx : this.props.userToken.memberIdx  })
            }else{
                await this.setState({memberIdx :  JSON.parse(this.props.userToken).memberIdx })
            }
        }
        
        if ( typeof this.props.navigation.state.params.routeIdx !== 'undefined') {            
            this.setState({ articleIdx : this.props.navigation.state.params.routeIdx})
            await this.refreshTextBookInfo(this.props.navigation.state.params.routeIdx);
            this.setHistory();
            this.updateViewCount();//조회수 업데이트
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);     
        }else if ( typeof this.props.navigation.state.params.titem.articleIdx !== 'undefined' ) {
            this.setState({ articleIdx : this.props.navigation.state.params.titem.articleIdx})
            await this.refreshTextBookInfo(this.props.navigation.state.params.titem.articleIdx);
            this.setHistory();
            this.updateViewCount();//조회수 업데이트
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);           
        }else{            
            this.handleBackButtonError();
        }
        await this._setNavigationParams();       
          
    }  

    componentDidMount() {                    
        
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    UNSAFE_componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    } 

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        if ( this.state.fromHistory ) {
            this.props.navigation.toggleDrawer();
        }
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
        return true;
    }

    handleBackButtonError = () => {
        const alerttoast = Toast.show('게시글이 삭제되었거나 비공개 글입니다..');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null);
            
        }, 2000)
    }

    refreshTextBookInfo = async(idx) => {     
        
        let memberIdx = this.state.memberIdx ? this.state.memberIdx : 0
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article/'+idx+'/' + memberIdx ,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {                     
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                         
                    if ( response.code !== '0000' ) {                        
                        this.setState({loading:false})    
                        this.handleBackButtonError();
                    }else{
                        //console.log('this.state.memberIdx', this.state.memberIdx);
                        //console.log('response.data.articles.memberIdx', response.data.articles.memberIdx);
                        if ( this.state.memberIdx == response.data.articles.memberIdx ) {
                            //console.log('fdfdfdfdfd', this.state.memberIdx);
                            this.setState({isMyArticle : true})
                        }
                        this.setState({
                            loading : false,
                            detailInfo : response.data.articles,
                            replyContents: response.data.articles.replies.length > 0 ? response.data.articles.replies : [],
                        })
                        this.timeout = setTimeout(
                            () => {
                                this.saveToStorage();
                        },
                            1000    // 1초
                        );
                    }

                }else{                    
                    this.setState({loading:false})    
                    this.handleBackButtonError();
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                
                this.setState({loading:false})    
                this.handleBackButtonError();
        });
    }

    updateViewCount = async() => {       
        let articleIdx = this.state.articleIdx; 
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article/view/'+ articleIdx ,{
            method: 'PUT', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/x-www-form-urlencoded',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:null
            },10000
            ).then(response => {
            })
            .catch(err => {
                console.log('login3 error => ', err);                
        });
    }

    failCallAPi = () => {
     
        let message = "데이터 수신중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    setHistory = async() => {                
        await AsyncStorage.getItem('history', (error, result) => {
            {   
                if(result) {
                    let resultTmp = JSON.parse(result);
                    if ( resultTmp.length > DEFAULT_CONSTANTS.recentlyHistoryLimit ) {                        
                        let resultTmp2 = resultTmp.sort((a, b) => ( b.date > a.date) ? 1 : -1);
                        let resultTmp3 = resultTmp2.filter((info,index) => {
                            return index < DEFAULT_CONSTANTS.recentlyHistoryLimit
                         } )                        
                        this.setState({ historyTmp: resultTmp3})
                    }else{                        
                        this.setState({ historyTmp: resultTmp})
                    }
                    
                }else{
                    this.setState({historyTmp : []})
                }
            }
        });   
    }

    stroageInsert = async(target,object) => {
        await target.push(object);        
        AsyncStorage.setItem('history', JSON.stringify(target));
    }

    checkInsertOrUpdate = async( newData) => {           
        if ( this.state.articleIdx ) {     
            let historyTmp = this.state.historyTmp;
            let isIndexOf = historyTmp.findIndex(                
                info => ( info.keyindex === 'freeboard' + this.state.articleIdx )
            );  
            let newHistory = await historyTmp.filter(info => info.keyindex !== 'freeboard' + this.state.articleIdx );
            if (isIndexOf != -1 )  { //update                    
                this.stroageInsert(newHistory,newData,);
            }else{ // insert                            
                this.stroageInsert(historyTmp,newData);
            }
        }

    }
    saveToStorage = async() => {
        if ( this.state.isMyArticle === false) {
            let CurrentDateTimeStamp = moment().unix();
            let newData = {interestCode : 'all',interestName : 'all',keyindex : 'freeboard' + this.state.articleIdx, type:'freeboard',urllink : '', navigate:'FreeBoardDetail',idx : this.state.articleIdx,date : CurrentDateTimeStamp,contents:this.state.detailInfo}        
        
            this.checkInsertOrUpdate( newData);
        }
    }

    removeDatareply = (idx ) => {
        let selectedFilterCodeList = this.state.replyContents;  
        selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.replyIdx !== idx);  
        return selectedFilterCodeList;
    }

    replyRemoveProcess = async() => {
        
        if ( this.state.targetReplyIdx) {
            returnArray = await this.removeDatareply(this.state.targetReplyIdx);            
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain + '/v1/app/board/article/reply/remove/'+ this.state.targetReplyIdx ,{
                method: 'DELETE', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:null
                },10000
                ).then(response => {                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.failCallAPi()
                        }else{
                            this.setState({
                                replyContents: Array.from(new Set(returnArray))
                            })
                
                            const alerttoast = Toast.show('삭제되었습니다');
                            setTimeout(() => {
                                Toast.hide(alerttoast);
                                
                            }, 2000)              
                        }
    
                    }else{
                        this.setState({replyprocessing : false})
                        this.failCallAPi()
                    }
                    
                })
                .catch(err => {
                    this.setState({replyprocessing : false})
                    console.log('login error => ', err);
                    this.failCallAPi()
            });


            
        }else{
            const alerttoast = Toast.show('이미 삭제되거나 오류가 발생하였습니다.');
            setTimeout(() => {
                Toast.hide(alerttoast);
            }, 2000)

        }
    }
    replyRemove = async( idx ) => {
        this.setState({targetReplyIdx : idx})

        Alert.alert(
            DEFAULT_CONSTANTS.appName + " : 댓글삭제",
            "댓글을 삭제하시겠습니까?",
            [
                {text: '네', onPress: this.replyRemoveProcess.bind(this)},
                {text: '아니오'},
            ],
            { cancelable: false }
        )          
    }

    replyRegist = async() => {
        if ( this.state.formContents !== null ) {
            Keyboard.dismiss();
            Alert.alert(
                DEFAULT_CONSTANTS.appName + " : 댓글작성",
                "댓글을 등록하시겠습니까?",
                [
                    {text: '네', onPress: this.replySaveProcess.bind(this)},
                    {text: '아니오'},
                ],
                { cancelable: false }
            )  
        }
    }
    registReply = () => {

        let selectedFilterCodeList = this.state.replyContents; 
        selectedFilterCodeList.push({index:data.index,info:data});        
        return selectedFilterCodeList;
    }

    replyFormUpload = async () => {
        let formContents = await CommonFuncion.isForbiddenWord( this.state.formContents, SpamWords.FilterWords.badWords)    
     
        const formData = new FormData();       
        formData.append('articleIdx', this.state.articleIdx);
        formData.append('memberIdx', this.state.memberIdx);
        formData.append('content', formContents);
        console.log('formData2', formData)

        
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain  + '/v1/app/board/article/reply/insert',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'multipart/form-data',
                'apiKey': DEFAULT_CONSTANTS.apiAdminKey
            }), 
                body:formData
            },10000
            ).then(response => {
                
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        //this.textInput.clear();
                        const alerttoast = Toast.show('등록되었습니다');
                        setTimeout(() => {
                            Toast.hide(alerttoast);
                        }, 2000)

                        if ( response.data.reply.replyIdx ) {
                            newReply = {
                                replyIdx: response.data.reply.replyIdx,
                                memberIdx: this.state.memberIdx, 
                                memberName: this.props.userToken.memberName, 
                                content: formContents, 
                                regDatetime: response.data.reply.regDatetime
                            }
                            this.setState({
                                formContents : '',
                                replyContents: [newReply, ...this.state.replyContents],
                                replyprocessing : false,
                            })
                        }else{
                            this.setState({replyprocessing : false})
                        }                        
                    }

                }else{
                    this.setState({replyprocessing : false})
                    this.failCallAPi()
                }
                
            })
            .catch(err => {
                this.setState({replyprocessing : false})
                console.log('login error => ', err);
                this.failCallAPi()
        });

       
    }
    
    replySaveProcess = async() => {    
        await this.setState({replyprocessing : true});      
        if ( this.state.articleIdx > 0 && this.state.memberIdx > 0 && this.state.formContents.length > 9 )   {
            this.replyFormUpload();
        }else{
            this.setState({replyprocessing : false}) 
        }
    }

    replyUpdateText = async(text) => {
        let route = 'FreeBoard';
        if ( this.props.userToken === null ) {
            Alert.alert(DEFAULT_CONSTANTS.appName, '로그인이 필요합니다.\n로그인 하시겠습니까?',
            [                
                {text: '확인', onPress: () => this.props.navigation.navigate('SignInScreen', {goScreen: route})},             
                {text: '취소', onPress: () => console.log('로그인 취소')},
            ]);

        }else{
            if ( text.length < 501 ) {
                this.setState({formContents:text})
            }else{
                const alerttoast = Toast.show('500자를 초과하였습니다.');
                setTimeout(() => {
                    Toast.hide(alerttoast);
                }, 2000)
            }
        }
    }

    showButton = () => {
        this.setState({ 
            showModifyForm: true
         })
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.25);    
    closeModal = () => {
        this.setState({ 
            showModifyForm: false,
            selectedReivewData : null
         })
    };


    updateMyReview = async() => {
        if ( this.state.articleIdx > 0  ) {
            
            await this.setState({showModifyForm:false})
            this.props.navigation.navigate('FreeBoardWrite',{
                articleIdx : this.state.articleIdx,
                memberIdx : this.state.memberIdx
            });            
        }else{
            console.error('not selected')
        }
    
    }

    removeProcess = async() => {
        if ( this.state.articleIdx !== null ) {
            const formData = new FormData();       
            formData.append('articleIdx', this.state.articleIdx);
          
            await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiAdminDomain  + '/v1/app/board/article/remove',{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': DEFAULT_CONSTANTS.apiAdminKey
                }), 
                    body:formData
                },10000
                ).then(response => {        
                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.failCallAPi();
                            this.setState({showModifyForm : false})
                        }else{                            
                            this.setState({showModifyForm : false})
                            const alerttoast = Toast.show('삭제 되었습니다');
                            setTimeout(() => {
                                Toast.hide(alerttoast);
                                this.customGoBack(true);
                            }, 1000)
                        }

                    }else{
                        this.setState({showModifyForm : false})
                        this.failCallAPi()
                    }
                    
                })
                .catch(err => {
                    this.setState({showModifyForm : false})
                    console.log('login error => ', err);
                    this.failCallAPi()
            });
            
        }else{
            console.error('not selected')
        }

    }

    removeMyReview = () => {
        Alert.alert(
            DEFAULT_CONSTANTS.appName + ": 자유게시판",
            "선택하신 자유게시판을 삭제하시겠습니까?",
            [
                {text: '네', onPress: this.removeProcess.bind(this)},
                {text: '아니오', onPress: () => null },
            ],
            { cancelable: false }
        )  
        
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { 
                        //Platform.OS === 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />
                        Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} backgroundColor={DEFAULT_COLOR.lecture_base} animated={true} hidden={false}/>
                    }
                    <NavigationEvents
                        onWillFocus={payload => {                    
                            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);          
                        }}
                        onWillBlur={payload => { 
                            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
                        }}
                    />
                    <Modal
                        onBackdropPress={this.closeModal}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showModifyForm}>
                        <Animated.View style={{height: this.animatedHeight,backgroundColor:'transparent',margin:15}}>
                            <View style={{flex:3,backgroundColor:'#fff',borderRadius:10}}>
                                <TouchableOpacity 
                                    onPress={()=>this.updateMyReview()}
                                    style={{flex:1,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                                >
                                    <CustomTextR style={styles.requestTitleText2}>수정</CustomTextR>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={()=>this.removeMyReview()}
                                    style={{flex:1,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                                >
                                    <CustomTextR style={styles.requestTitleText2}>삭제</CustomTextR>
                                </TouchableOpacity>                                                   
                            </View>
                            
                            <View style={{flex:1,backgroundColor:'#ccc',borderRadius:10,marginTop:10}}>
                                <TouchableOpacity 
                                    onPress= {()=> this.closeModal()}
                                    style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                                >
                                    <CustomTextR style={styles.requestTitleText2}>취소</CustomTextR>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </Modal>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        //onScroll={e => this.handleOnScroll(e)}
                        onMomentumScrollEnd = {({nativeEvent}) => { 
                        //this.loadMoreData (nativeEvent) 
                        }}
                        onScrollEndDrag ={({nativeEvent}) => { 
                            //this.loadMoreData (nativeEvent) 
                        }}
                        style={{marginBottom:50}}
                    >
                    <View style={{paddingTop:20,paddingHorizontal:20}}>
                        <View style={{flexDirection:'row',flexGrow:1}}>
                            <CustomTextR                                        
                                style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >{this.state.detailInfo.interestFieldName}</CustomTextR>
                            <CustomTextR                                        
                                style={{paddingHorizontal:5,color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >|</CustomTextR>
                            <CustomTextR                                        
                                style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >조회수 {parseInt(this.state.detailInfo.viewCnt) > 999999 ? '999,999+' : CommonFuncion.currencyFormat(this.state.detailInfo.viewCnt)} </CustomTextR>
                            <CustomTextR                                        
                                style={{paddingHorizontal:5,color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >|</CustomTextR>
                            <CustomTextR                                        
                                style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >댓글 {parseInt(this.state.detailInfo.replyCnt) > 999 ? '999+' : this.state.detailInfo.replyCnt}</CustomTextR>
                        </View>
                    </View>
                    <View style={{paddingHorizontal:20,paddingVertical:15}}>
                        <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),lineHeight:PixelRatio.roundToNearestPixel(25),letterSpacing:-0.9}}>{this.state.detailInfo.title}</CustomTextM>
                    </View>
                    <View style={{paddingHorizontal:20,paddingBottom:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color}}>
                        <View style={{flexDirection:'row',flexGrow:1,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Image source={require('../../../assets/icons/icon_bubble.png')} style={{width:PixelRatio.roundToNearestPixel(12),height:PixelRatio.roundToNearestPixel(14)}} />
                            <TextRobotoR                                        
                                style={{paddingHorizontal:10,color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >{this.state.detailInfo.memberName}</TextRobotoR>
                            <TextRobotoR                                        
                                style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),letterSpacing:-0.65}}
                            >{this.state.detailInfo.regDatetime}</TextRobotoR>
                        </View>
                    </View>
                    <View style={{padding:20,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_border_color,minHeight:200}}>
                        <Text style={styles.descriptionText}>{this.state.detailInfo.content}</Text>
                    </View>                
                    <View style={{height:10,backgroundColor:'#eaebee',borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1,}} />
                  
                    {this.state.replyContents.length > 0  &&
                        <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color,paddingVertical:20}}>
                            
                            <View style={{paddingHorizontal:20}}>
                                {
                                    /*
                                    "replyIdx": 1,
                                    "memberIdx": 1, 
                                    "memberName": "", 
                                    "content": "", 
                                    "regDatetime": ""
                                    */  
                                    this.state.replyContents.map((ritem,rindex) => {
                                        return (
                                            <View key={rindex} style={{borderBottomColor:DEFAULT_COLOR.base_color_ccc,borderBottomWidth:1}}>
                                                <View style={{paddingTop:15,paddingBottom:5}}>
                                                    <View style={{flex:1,flexDirection:'row'}}>
                                                        <View style={{flex:2,flexDirection:'row'}}>
                                                            <CustomTextR                                                 
                                                                style={{color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                            >{ritem.memberName}홍*동</CustomTextR>                            
                                                            <CustomTextR                                                 
                                                                style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}
                                                            >{ritem.regDatetime.substr(0,10)}</CustomTextR>                                                
                                                        </View>
                                                        <View style={{flex:1,alignItems:'flex-end'}}>
                                                            {
                                                                ritem.memberIdx === this.state.memberIdx &&
                                                                <TouchableOpacity 
                                                                    onPress={() =>  this.replyRemove(ritem.replyIdx)}
                                                                    style={{flexDirection:'row',flexGrow:1,justifyContent:'center',alignItems:'center'}}
                                                                >
                                                                    <Icon name="close" size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)} color={DEFAULT_COLOR.lecture_base} />
                                                                    <CustomTextR                                                 
                                                                        style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}
                                                                    >삭제</CustomTextR>
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{paddingBottom:15,paddingTop:5}}>
                                                    <CustomTextR                                                 
                                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),paddingRight:5}}
                                                    >{ritem.content}</CustomTextR>
                                                </View>
                                            </View>

                                        )
                                    })
                                }
                            </View>
                        </View>
                    }
                    </ScrollView>
                    <View                    
                        style={{zIndex:3,position:'absolute',left:0,bottom:0,minHeight:Platform.OS === 'android' ? 50 :  CommonFuncion.isIphoneX() ? 60 : 50,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.base_color_666,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,justifyContent:'center',alignItems:'center',}}
                    >
                        { this.state.replyprocessing 
                        ?
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingVertical:0,}}>
                            <View style={styles.IndicatorContainer2}><ActivityIndicator size="small" /></View>
                        </View>
                        :
                        <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingVertical:0}}>
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../../../assets/icons/icon_write_chat.png')} style={{width:PixelRatio.roundToNearestPixel(12),height:PixelRatio.roundToNearestPixel(14)}} />
                            </View>
                            <View style={{flex:6}}>
                                <TextInput                                 
                                    ref={input => { this.textInput = input }}
                                    //style={{borderWidth:1,borderColor:DEFAULT_COLOR.base_color_fff}}                                
                                    placeholder=' 댓글을 입력해 주세요(최소10자,최대500자이하)'
                                    onChangeText={text=>this.replyUpdateText(text)}
                                    multiline={true}
                                    defaultRating={2.5}
                                    fractions={0.5}
                                    showRating={false}
                                    clearButtonMode='always'
                                    value={this.state.formContents}
                                    //onFocus={()=>this.startTouch()}
                                    //onFocus={() => this.startTouch()}
                                    //onBlur={() => this.attachShow(true) }
                                />
                            </View>
                            <View style={{flex:1}}>
                                {this.state.formContents.length > 10 &&
                                <TouchableOpacity 
                                    onPress={() =>  this.replyRegist()}
                                >
                                    <Text style={{color:'#ccc',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}>등록</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        }
                        
                        

                    </View>
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    IndicatorContainer2 : {
        flex: 1,
        width:'100%',
        backgroundColor:DEFAULT_COLOR.base_color_666,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:DEFAULT_COLOR.lecture_base
    },
    titleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:DEFAULT_COLOR.base_color_222
    },
    descriptionText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_666
    },
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken,   
    };
}



export default connect(mapStateToProps, null)(FreeBoardDetail);