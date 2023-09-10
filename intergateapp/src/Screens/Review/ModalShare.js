import React, { Component } from 'react';
import {PixelRatio, Dimensions, Text, TouchableOpacity, View,StyleSheet,ScrollView,Platform,Share as NativeShare,NativeModules,Image} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import { Buffer } from 'buffer';
import Share  from 'react-native-share';
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

import {shareOnFacebook,shareOnTwitter,shareOnInstagram} from '../../Utils/SocialShare';
import { ShareDialog,ShareApi } from 'react-native-fbsdk';

import images from './images';

const linkObject={
    webURL                :'https://mchamp.hackers.com',//optional
    mobileWebURL          :'https://mchamp.hackers.com',//optional
    androidExecutionParams:'LectureDetailScreen|lectureId=1&itemId=24', //optional For Linking URL
    iosExecutionParams    :'LectureDetailScreen|lectureId=1&itemId=24', //optional For Linking URL
};

const linkObject2={
  webURL                :'https://mchamp.hackers.com',
  mobileWebURL          :'https://mchamp.hackers.com'
};

const contentObject = {
    title     : '해커스 카카오톡 통합앱2 ',
    link      : linkObject,
    imageURL  : 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
  
    desc      : '겁나 힘드네 만들기 죽갔다 ㅠㅠ',//optional
    imageWidth: 400,//optional
    imageHeight:120//optional
  }
  
  //5개의 속성 중 최대 3개만 표시해 줍니다. 우선순위는 Like > Comment > Shared > View > Subscriber 입니다.
  const socialObject ={
    likeCount:12,//optional
    commentCount:1,//optional
    sharedCount:23,//optional
    viewCount:10,//optional
    subscriberCount:22//optional
  }
  
  const buttonObject = {
    title:'앱으로보기',
    link : linkObject,
  }
  const buttonObject2 = {    
    title:'웹으로보기',
    link : linkObject2,
  }
  
  
  const commerceDetailObject ={
    regularPrice :10000,//required,
    // discountPrice:1000,//Optional
    // discountRate:10,//Optional
    // fixedDiscountPrice:1000//Optional
  };

export default class ModalShare extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            shareList  : [
                { index :1, title : '깨톡', url : 'shareKakao'},
                { index :2, title : '네이버', url : null},
                { index :3, title : '얼굴책', url : null},
                { index :4, title : '인스타', url : null},
                { index :5, title : '트위터', url : null},
                { index :6, title : 'more', url : 'more'},
            ],
            shareLinkContent : {
              contentType: 'link',
              contentUrl: "https://facebook.com",
              contentDescription: 'Wow, check out this great site!',
            }
           
        }
    }

    static Social = {
        FACEBOOK: NativeModules.RNShare.FACEBOOK || 'facebook',
        PAGESMANAGER: NativeModules.RNShare.PAGESMANAGER || 'pagesmanager',
        TWITTER: NativeModules.RNShare.TWITTER || 'twitter',
        WHATSAPP: NativeModules.RNShare.WHATSAPP || 'whatsapp',
        INSTAGRAM: NativeModules.RNShare.INSTAGRAM || 'instagram',
        INSTAGRAM_STORIES: NativeModules.RNShare.INSTAGRAM_STORIES || 'instagram-stories',
        GOOGLEPLUS: NativeModules.RNShare.GOOGLEPLUS || 'googleplus',
        EMAIL: NativeModules.RNShare.EMAIL || 'email',
        PINTEREST: NativeModules.RNShare.PINTEREST || 'pinterest',
    };

    UNSAFE_componentWillMount() {              
        
    }  

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    componentWillUnmount(){
        
    }
 

    onTweeter = () => {
        shareOnTwitter({
            'text':'10분안에 끝내는 앱??',
            'link':'https://mchamp.hackers.com/',
            'imagelink':'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
            //or use image
            //'image': 'artboost-icon',
          },
          (results) => {
            console.log(results);
          }
        );
    }

    onFaceBook2 = () => {
        shareOnFacebook({
            'text':'10분안에 끝내는 앱??',
            'link':'https://mchamp.hackers.com/',
            'imagelink':'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
            //or use image
            //'image': 'artboost-icon',
          },
          (results) => {
            console.log('results',results);
          }
        );
        
    }
    

    onFaceBook = (mode) => {

        console.log('mode : ', mode);

        var tmp = this;
        ShareDialog.canShow(this.state.shareLinkContent).then(
            function(canShow) {
            if (canShow) {
                return ShareDialog.show(tmp.state.shareLinkContent);
            }
            }
        ).then(
            function(result) {
            if (result.isCancelled) {
                console.log('Share cancelled');
            } else {
                console.log('Share success with postId: '+ result.postId);
            }
            },
            function(error) {
            console.log('Share fail with error: ' + error);
            }
        );
        /*
        shareOnFacebook({
            'text':'Global democratized marketplace for art',
            'link':'https://www.hackers.com.com/',
            //'imagelink':'https://artboost.com/apple-touch-icon-144x144.png'
            //or use image
            //'image': 'artboost-icon',
        },
        (results) => {
            console.log('results',results);
        }
        );
        */
       
    }

    onEmailImage = async () => {
        const shareOptions = {
          title: 'Share file',
          email: 'email@example.com',
          social: Share.Social.EMAIL,
          failOnCancel: false,
          urls: [images.image1, images.image2],
        };
    
        try {
          const ShareResponse = await Share.open(shareOptions);
          setResult(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
          console.log('Error =>', error);
          setResult('error: '.concat(getErrorString(error)));
        }
    };
  
    onInstagram = async(mode) => {
        if ( mode === 1 ) {       
            const shareOptions = {
                method: Share.InstagramStories.SHARE_BACKGROUND_IMAGE,
                backgroundBottomColor: '#fefefe',
                backgroundTopColor: '#906df4',
                attributionURL : '',
                backgroudImage : '',
                social: Share.Social.INSTAGRAM_STORIES
            };

            try {
                const ShareResponse = await Share.shareSingle(shareOptions);
                console.log(JSON.stringify(ShareResponse, null, 2));
            } catch (error) {
                console.log('Error =>', error);
                //setResult('error: '.concat(getErrorString(error)));
            }
        }else{
            const deeplinkUrl =  'https://www.hackers.com/';
            const encodedString = new Buffer('https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg').toString('base64');
            NativeModules.InstagramShare.shareInstagram(encodedString, encodedString, message => {
                if (message) alert(message);
                    console.log('SUCCESS')
                }, error => {
                    alert(error.message) // error callback for IOs only
                    console.log('ERROR', error)
                })
            /*
            NativeModules.InstagramShare.shareWithInstagram({
                backgroundImage: 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
                deeplinkUrl: 'https://www.hackers.com/',
            })
            .then(() => console.log('SUCCESS'))
            .catch(e => console.log('ERROR', e))
            */
        }
    }
    onWatchapp = async() => {

        const shareOptions = {
            title: 'Share via',
            message: 'some message',
            url: 'https://www.hackers.com',
            social: Share.Social.WHATSAPP,
            whatsAppNumber: "9199999999",  // country code + phone number(currently only works on Android)
            filename: null , // only for base64 file in Android 
        };
        Share.shareSingle(shareOptions);

    }

    shareToSMS = async () => {
        const shareOptions = {
          title: 'Share via',
          message: 'some message',
          social: 'sms',
        };
    
        try {
          const shareRes = await Share.shareSingle(shareOptions);      
        } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');  
        }
    };

    shareMultipleImages = async () => {
        const shareOptions = {
        title: 'Share file',
        failOnCancel: false,
        urls: [images.image1, images.image2],
        };

        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
            console.log('Error =>', error);
            //setResult('error: '.concat(getErrorString(error)));
        }
    };

        /**
     * This functions share a image passed using the
     * url param
     */
    shareSingleImage = async () => {
        const shareOptions = {
        title: 'Share file',
        url: Share.base64('https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg'),//images.image1,
        failOnCancel: false,
        };

        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
            console.log('Error =>', error);
            //setResult('error: '.concat(getErrorString(error)));
        }
    };

    /**
     * This function shares PDF and PNG files to
     * the Files app that you send as the urls param
     */
    shareToFiles = async () => {
        const shareOptions = {
        title: 'Share file',
        failOnCancel: false,
        saveToFiles: true,
        urls: [images.image1, images.pdf1], // base64 with mimeType or path to local file
        };

        // If you want, you can use a try catch, to parse
        // the share response. If the user cancels, etc.
        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
            console.log('Error =>', error);
            //setResult('error: '.concat(getErrorString(error)));
        }
    };

    onKakaoLink = async() => {
        try {
            const options = {
                objectType: "scrap", //required
        url: "https://developers.kakao.com" //required
            };
            const response = await NativeModules.RNKakaoLink.link(options);
            console.log(response);
        } catch (e) {
            console.warn(e);
        }
    }


    onMoreShare = async() => {
        try {
            const result = await NativeShare.share({
              message:
                'React Native | A framework for building native apps using React',
            });
      
            if (result.action === NativeShare.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === NativeShare.dismissedAction) {
              // dismissed
            }
          } catch (error) {
            alert(error.message);
          }

    }
    //
    linkCustom = async () => {
        try{
          const options = {
            objectType:'custom',//required
            templateId:'13671',//required
            templateArgs:{
              title:'커스텀 제목',//Your Param
              desc:'커스텀 설명',//Your Param
            }
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
    
      linkScrap = async () => {
        try{
          const options = {
            objectType:'scrap',//required
            url:'https://developers.kakao.com',//required
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
    
      linkText = async () => {
        try{
          const options = {
            objectType:'text',//required
            text:'텍스트 입력',//required
            link:linkObject,//required
            // buttonTitle:'',//optional buttons랑 사용 불가.
            buttons:[buttonObject]//optional
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
    
      linkCommerce = async () => {
        try{
          const options = {
            objectType:'commerce',//required
            content:contentObject,//required
            commerce:commerceDetailObject,//required
            // buttonTitle:'',//optional buttons랑 사용 불가.
            buttons:[buttonObject]//optional
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
    
      linkLocation = async () => {
        try{
          const options = {
            objectType:'location',//required
            content:contentObject,//required
            address:'실제 주소',//required
            addressTitle:'우리 집',//optional
            // buttonTitle:'',//optional buttons랑 사용 불가.
            buttons:[buttonObject]//optional
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
      //test okay
      linkList = async () => {
        try{
          const options = {
            objectType:'list',//required
            headerTitle:'리스트 제목',//required
            headerLink:linkObject,//required
            contents:[contentObject,contentObject],//required
            // buttonTitle:'',//optional buttons랑 사용 불가.
            buttons:[buttonObject]//optional
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
        }catch(e){
          console.warn(e);
        }
      }
    
      //test okay
      linkFeed = async () => {
        try{
          const options = {
            objectType:'feed',//required
            content:contentObject,//required
            social:socialObject,//optional
            buttons:[buttonObject,buttonObject2]//optional
          };
          const response = await NativeModules.RNKakaoLink.link(options);
          console.log(response);
    
        }catch(e){
          console.warn(e);
        }
      }
   
    render() {
        
        return(
            <View style={ styles.container }>                
                <View style={{paddingVertical:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                    <Text style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.base_color_222,fontWeight:'bold'}}>
                        공유하기
                    </Text>
                    <TouchableOpacity 
                        onPress= {()=> {                            
                            this.props.screenState.closeModal2();
                            }
                        }
                        style={{position:'absolute',top:5,right:10,width:30,height:30}}>
                        <Icon name="close" size={25} color={DEFAULT_COLOR.base_color_666} />
                    </TouchableOpacity>
                </View>
               
                <ScrollView style={{padding:10,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}} horizontal={true}>
                    <TouchableOpacity 
                        onPress= {()=> {this.linkFeed()}}
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_kakao.png')} />
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity 
                        onPress= {()=> {this.onFaceBook(1)}}
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_naver.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress= {()=> {this.onFaceBook(9)}}
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_line.png')} />
                    </TouchableOpacity>
                    */}
                    <TouchableOpacity 
                        onPress= {()=> {this.onFaceBook(9)}}
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_facebook.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress= {()=> {this.onFaceBook2()}}
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_facebook.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center',borderColor:'#ccc',borderWidth:1}}
                        onPress= {()=> {this.onTweeter()}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_tweet.png')} />
                    </TouchableOpacity>
                    {/*
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.onInstagram(1)}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_instagram.png')} />
                    </TouchableOpacity> 
                    */}
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.onInstagram(2)}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_instagram2.png')} />
                    </TouchableOpacity> 
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.onEmailImage()}}
                    >
                        <Image style={{width:60,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_email.png')} />
                    </TouchableOpacity>    
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.shareSingleImage()}}
                    >
                        <Image style={{width:50,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_camera.png')} />
                    </TouchableOpacity>    
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.shareToFiles()}}
                    >
                        <Image style={{width:50,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_disk.png')} />
                    </TouchableOpacity>                        
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.onWatchapp()}}
                    >
                        <Image style={{width:50,minHeight: 60,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_whatsapp.png')} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.shareToSMS()}}
                    >
                        <Image style={{width:40,minHeight: 10,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_sms.png')} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{width:60,height:60,margin:5,alignItems:'center',justifyContent:'center'}}
                        onPress= {()=> {this.onMoreShare()}}
                    >
                        <Image style={{width:30,minHeight: 10,transform: [{ scale: 1 }]}} resizeMode='contain' source={require('../../../assets/icons/icon_more.png')} />
                    </TouchableOpacity>
                    
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff',
        borderTopLeftRadius:10,
        borderTopRightRadius:10
    },
    unselectedAttention : {
        margin:5,backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10
    },
    selectedAttention : {
        margin:5,backgroundColor:DEFAULT_COLOR.lecture_base,paddingHorizontal:20,paddingVertical:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10
    },
    textWhite  :{
        color : DEFAULT_COLOR.base_color_fff
    },
    textGray  :{
        color : DEFAULT_COLOR.base_color_666
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    
    
});
/*


    onInstagram = (mode) => {
        if ( mode === 1 ) {
            shareOnInstagram({            
                'backgroundImage':'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',        
                'deeplinkUrl':'https://artboost.com/'
            },
            (error) => {
                console.error('error',error);
            },
            (results) => {
                console.log('results',results);
            }
            );
        }else{
            const deeplinkUrl =  'https://www.hackers.com/';
            const encodedString = new Buffer('https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg').toString('base64');
            NativeModules.InstagramShare.shareWithInstagram(deeplinkUrl, encodedString, message => {
                if (message) alert(message)
              }, error => {
                alert(error.message) // error callback for IOs only
              })
            
            NativeModules.InstagramShare.shareWithInstagram({
                backgroundImage: 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
                deeplinkUrl: 'https://www.hackers.com/',
            })
            .then(() => console.log('SUCCESS'))
            .catch(e => console.log('ERROR', e))
            
        }
    }

    */