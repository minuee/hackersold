import React, { Component } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    PixelRatio,
    View,
    Image,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
    Animated,
    Alert,
    Share as NativeShare
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
Icon.loadFont();
//import ImageView from 'react-native-image-view';
import ImageView from '../../Utils/ImageViewer/ImageView';
import ModalShare from './ModalShare';
import Modal from 'react-native-modal';
import Toast from 'react-native-tiny-toast';
import { Rating,CheckBox } from 'react-native-elements';
import TextReadMore from './TextReadMore'
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import { database } from 'react-native-firebase';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


class PassReview extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            historyTmp : [],
            imageIndex: null,
            isImageViewVisible: false,
            showModifyForm : false,
            showShareForm : false,    
            selectedReivewData : null,    
            thisImages : [
                {
                    source : {
                        uri : 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg'
                    },
                    title : "dfdfdfdfdfdfdfd"
                },
            ],
            closeModal2 : this.closeModal2.bind(this),
            dynamicIndex: 0
        }

        this.arr = [];
    }

    UNSAFE_componentWillMount() {        
       
    }

    componentDidMount() {
        setTimeout(
            () => {                
                this.setState({ loading: false });
            },500);
    }

    UNSAFE_componentWillUnmount() {

    }

    setImages = async(data) => {
        let selectedFilterCodeList = [];   
        await data.forEach(function(element,index,array){            
            selectedFilterCodeList.push({source : {uri:element.url},title:data.type});
        });

        return selectedFilterCodeList;
    }

    setImageGallery = async( data, idx ) => {
        let returnArray = await this.setImages(data)
        this.setState({
            imageIndex: idx,
            thisImages : returnArray
        })
        this.setState({isImageViewVisible: true})

    }
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.3);    
    closeModal = () => {
        this.setState({ 
            showModifyForm: false,
            selectedReivewData : null
         })
    };

    closeModal2 = () => {
        this.setState({             
            showShareForm: false,
         })
         setTimeout(
            () => {
                this.setState({ showModifyForm: true});
            },300)
    };
    showModal2 = () => {        
        this.setState({ 
            showModifyForm: false,            
         })
         setTimeout(
            () => {
                this.setState({ showShareForm: true});
            },300)
    };

    updateMyReview = async() => {

        Alert.alert(
            "해커스통합앱 : 수강후기",
            "PC에서 수정 가능합니다.",
            [                
                {text: '확인', onPress: () => null }
            ],
            { cancelable: false }
        )  

        /*
        if ( this.state.selectedReivewData !== null ) {
            //console.log('this.state.selectedReivewData', this.state.selectedReivewData);
            await this.setState({showModifyForm:false})
            this.props.screenProps.screennavigation1.navigate('LectureWriteForm',{
                reviewData : this.state.selectedReivewData
            });            
        }else{
            console.error('not selected')
        }
        */
    }

    removeProcess = async() => {
        if ( this.state.selectedReivewData !== null ) {
            console.log('this.state.selectedReivewData',this.state.selectedReivewData)
            this.setState({showModifyForm:false})
            const formData = new FormData();
            formData.append('classIdx', parseInt(this.state.selectedReivewData.classIdx));
            formData.append('memberClassIdx', 1432863201);
            formData.append('memberIdx', 5104881);
            formData.append('idx', parseInt(this.state.selectedReivewData.reviewIdx));
            let Domain = DEFAULT_CONSTANTS.apiTestDomain + '/v1/review/pass/remove/' + parseInt(this.state.selectedReivewData.reviewIdx)
            try {
                await fetch(Domain , {
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'apiKey': DEFAULT_CONSTANTS.apitestKey,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                })
                .then((response) => response.json())
                .then((response) => {
                    console.log('response', response)
                    if ( response.code !== '0000' ) {                        
                        this.failCallAPi()
                    }else{
                        this.setState({isuploading : false})
                        const alerttoast = Toast.show( '삭제 되었습니다');
                        setTimeout(() => {
                            Toast.hide(alerttoast);                       
                            this.props.screenState.refreshTextBookInfo(0,pageViewLimit);  
                        }, 2000)
                    }
                })
                .done();
            }catch(e) {            
                console.error('e : ',e)
                let message = "처리중 오류가 발생하였습니다.\n 잠시후 이용해 주세요";
                let timesecond = 2000;
                CommonFuncion.fn_call_toast(message,timesecond);
            }

        }else{
            console.error('not selected')
        }

    }

    removeMyReview = () => {
        Alert.alert(
            "해커스통합앱 : 수강후기",
            "선택하신 수강후기를 삭제하시겠습니까?",
            [
                {text: '네', onPress: this.removeProcess.bind(this)},
                {text: '아니오', onPress: () => null },
            ],
            { cancelable: false }
        )  
        
    }

    failCallAPi = () => {
     
        let message = "처리중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    onMoreShare = async() => {
        try {
            const result = await NativeShare.share({
              message: this.state.selectedReivewData.title,
            });
      
            if (result.action === NativeShare.sharedAction) {
              if (result.activityType) {
                
              } else {
                
              }
            } else if (result.action === NativeShare.dismissedAction) {
              
            }
          } catch (error) {
            alert(error.message);
          }

    }

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            
            //const images = this.state.thisImages || [];
            //const {isImageViewVisible, imageIndex} = this.state;
            return(
                <View style={ styles.container }>
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
                                <TouchableOpacity 
                                    //onPress= {()=> this.showModal2()}
                                    onPress={()=> this.onMoreShare()}
                                    style={{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}
                                >
                                    <CustomTextR style={styles.requestTitleText2}>공유</CustomTextR>
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
                    <Modal
                        onBackdropPress={this.closeModal2}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating
                        isVisible={this.state.showShareForm}>
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight2 }]}>                        
                            <View style={{flex:1,justifyContent: 'flex-start'}}>
                                <ModalShare screenState={this.state} />
                            </View>
                        </Animated.View>
                    </Modal>                
                    
                    { 
                    this.props.screenState.reviewItems.length === 0
                    ?
                        <View
                            style={[
                                styles.itemWrap,
                                {
                                    alignItems:'center',
                                    justifyContent: 'center',
                                    height: Platform.OS === 'android' ? SCREEN_HEIGHT * 0.3 : SCREEN_HEIGHT * 0.4,
                                }]
                            }>
                            <Image
                                style={{
                                    width: 65,
                                    height: 65,
                                    marginBottom: 15,
                                }}
                                source={require('../../../assets/icons/icon_none_exclamation.png')}
                            />
                            <CustomTextR
                                style={{
                                    textAlign: 'center',
                                    color: DEFAULT_COLOR.base_color_888,
                                    fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
                                    lineHeight: PixelRatio.roundToNearestPixel(18.1),
                                    letterSpacing: -0.69,
                                }}>작성하신 게시글이 없습니다.{"\n"}게시글을 작성해주세요 :)
                            </CustomTextR>
                        </View>
                    :
                    this.props.screenState.reviewItems.map((item, index) => {
                        let bgColor = index%2 === 0  ? '#92b0be' : '#88b7a8'
                        return(
                            <View
                                key={index}
                                style={{
                                    flex:1,backgroundColor:bgColor,minHeight:150,width:SCREEN_WIDTH,marginBottom:2}}
                                onLayout={event => {
                                    const layout = event.nativeEvent.layout;
                                    this.arr[index] = layout.y;
                                }}>
                                {/* 선생님 설명양약  */}
                                <View style={{minHeight:80,maring:0,padding:0}}>
                                    <ImageBackground                                    
                                        style={{
                                            flex:1,
                                            padding: 40,
                                            position: 'absolute',
                                            bottom:-10,
                                            right:30,
                                            opacity:0.9
                                        }}
                                        resizeMode='cover'
                                        source={ require('../../../assets/icons/icon_pass.png')}
                                    />
                                    <View style={{marginLeft:30, width:SCREEN_WIDTH/2+20,paddingVertical:5}}>
                                        {/*
                                        <View style={{flex:1,paddingTop:20}}>
                                            <Text style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold'}}>
                                                {item.testName} 격
                                            </Text>
                                        </View>
                                        */}
                                        <View style={{flex:1,flexDirection:'row',flexGrow:1,paddingTop:20}}>
                                            {
                                                typeof item.groupCategory !== 'undefined' && 
                                                item.groupCategory.map((citem, cindex) => {
                                                    return (

                                                        <CustomTextR 
                                                            key={cindex}
                                                            style={{paddingBottom:10,paddingRight:10,color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                                            {citem.categoryName} 
                                                        </CustomTextR>
                                                    )
                                                })
                                            }
                                            
                                        </View>
                                    </View>
                                    
                                </View>

                                {/* 리뷰내역  */}
                                <View>
                                    <View style={styles.reviewContentWrap}>
                                        
                                        <View style={{flexDirection:'row',width:SCREEN_WIDTH,paddingVertical:10,paddingHorizontal:30}}>
                                            <View style={{flex:7,alignItems:'center',justifyContent:'center'}}>
                                               <CustomTextB style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16)}}>
                                                    {item.title}
                                                </CustomTextB>
                                            </View>
                                            {this.props.screenState.formMemberIdx !== item.memberIdx  && 
                                                <TouchableOpacity 
                                                    onPress={()=>                                                        
                                                        this.setState({
                                                            showModifyForm:true,
                                                            selectedReivewData : item
                                                        })
                                                    }
                                                    style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}
                                                >
                                                    <Icon name="dots-three-vertical" size={20} color={DEFAULT_COLOR.base_color_ccc} />
                                                </TouchableOpacity>   
                                                }
                                        </View>
                                        <View style={{flexDirection:'row',flexGrow:1,alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                                            <View style={{paddingLeft:5}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12)}}>{item.userName}</CustomTextR>
                                            </View>                                            
                                        </View>
                                        <View style={{width:SCREEN_WIDTH,alignItems:'flex-start',justifyContent:'flex-start',paddingVertical:10,paddingHorizontal:30}}>
                                            <TextReadMore
                                                numberOfLines={5}
                                                onReady={this._handleTextReady}
                                                isClosed={() => {
                                                    this.setState({
                                                        dynamicIndex: index,
                                                    }, function() {
                                                        console.log('LectureReview.js > render()', 'this.arr.length = ' + this.arr.length)
                                                        console.log('LectureReview.js > render()', 'this.state.dynamicIndex = ' + this.state.dynamicIndex)
                                                        console.log('LectureReview.js > render()', 'this.arr = ' + this.arr)

                                                        try {
                                                            if (this.arr.length >= this.state.dynamicIndex) {
                                                                console.log('LectureReview.js > render()', 'scrollTo() CALL')
                                                                this.props.screenState.scrollToRemote({
                                                                    x: 0,
                                                                    y: this.arr[this.state.dynamicIndex],
                                                                    animated: true,
                                                                });
                                                            }
                                                        } catch(e) {
                                                            console.log('LectureReview.js > render()', 'error = ' + e)
                                                        }
                                                    })
                                                }}
                                                >
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:-0.6}}>
                                                    {item.content}
                                                </CustomTextR>
                                            </TextReadMore>
                                        </View>
                                        <View style={{paddingVertical:15}}>
                                        { 
                                            item.files && Array.isArray(item.files) ?
                                            
                                                <ScrollView  horizontal={true}>
                                                    {
                                                        item.files.map((item2, index2) => {
                                                            return(
                                                                <View key={index2} style={styles.itemBannerContainer}>
                                                                    <TouchableOpacity onPress={() => this.setImageGallery(item.files, index2)}>
                                                                        <Image style={styles.imgBannerBackground} resizeMode='cover' source={{uri:item2.url}} />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </ScrollView>
                                                :
                                                <Text></Text>
                                        }
                                        </View>                                   
                                    
                                    </View>  
                                  
                                </View>
                            
                            </View>
                        )
                    })}
                   <ImageView
                        glideAlways
                        images={this.state.thisImages}
                        imageIndex={this.state.imageIndex}
                        controls={true}
                        animationType="fade"
                        isVisible={this.state.isImageViewVisible}
                        //renderFooter={this.renderFooter}
                        renderFooter={(currentImage) => (<View style={styles.footer}>
                            <Text style={styles.footerText}>{this.state.imageIndex+1}/{this.state.thisImages.length}</Text>
                        </View>)}
                        onClose={() => this.setState({
                            isImageViewVisible: false,
                            imageIndex:null})}
                        onImageChange={index => {
                            //console.log(index);
                            this.setState({imageIndex: index})
                        }}
                    />
                </View>
            );
        
        }
    }
}

export default PassReview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : '#fff',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    reviewContentWrap : {
        
        marginHorizontal:15,
        paddingHorizontal:20,                
        borderTopStartRadius : 20,
        borderTopEndRadius : 20,        
        backgroundColor : '#fff',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    itemBannerContainer: {
        width:100,
        minHeight: 60,
        marginHorizontal : 5
    },
    imgBannerBackground: {
        width:100,
        minHeight: 60,
        transform: [{ scale: 1 }]
    },

    card: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 3,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        backgroundColor: '#fff',
    },
    cardText: {
        color:DEFAULT_COLOR.base_color_666,
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13),
        
    },
    footer: {
        width :SCREEN_WIDTH,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },

    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

});