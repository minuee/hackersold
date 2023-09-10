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
    StatusBar
} from 'react-native';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/Entypo';
Icon.loadFont();
import ImageView from '../../Utils/ImageViewer/ImageView';

import { Rating } from 'react-native-elements';

//HTML 
import HTMLConvert from '../../Utils/HtmlConvert/HTMLConvert';
const IMAGES_MAX_WIDTH = SCREEN_WIDTH - 50;
const CUSTOM_STYLES = {};
const CUSTOM_RENDERERS = {};
const DEFAULT_PROPS = {
    htmlStyles: CUSTOM_STYLES,
    renderers: CUSTOM_RENDERERS,
    imagesMaxWidth: IMAGES_MAX_WIDTH,
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true
};

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
import { database } from 'react-native-firebase';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

export default  class ReviewDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            imageIndex: null,
            isImageViewVisible: false,
            showModifyForm : false,
            showShareForm : false,            
            
            lectureItems: [
                { index: 1, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg', },
                { index: 2, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/3dfa81cec2f9b3d168e4a3bf436d41d1.jpg', },
                { index: 3, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/111e8f4857ab868b1f4ee2e2a4dbcd78.jpg', },
                { index: 4, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/12/3d9723f8a69a41a05592b941899b461e.jpg', },
                { index: 5, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/12/4da5cb12e55b4a21f8efd431b67ed81b.jpg', },
                { index: 6, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/12/f097716b581966a458e10739c0ad5aa8.jpg', },
                { index: 7, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/12/91c147c04e7e3e05599956ee9c9e8921.jpg', },
                { index: 8, cat_idx: 1, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/1c47b6afe2f8608124806c303421eb19.jpg', },
                { index: 9, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/1944e743d614f6f52c9251bf63326d69.jpg', },
                { index: 10, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/223146c620dd8569545b8522758b9790.jpg', },
                { index: 11, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/669e75ea5fbbdc05aea56d4a285a4c48.jpg', },
                { index: 12, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/34765ae25c8268b5b080aa37283d39f6.jpg', },
                { index: 13, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2018/10/7a5a11931f8bcee2f9cbcb183223b910.jpg', },
                { index: 14, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2020/02/56514638e19e8812c19d72b0059d957e.jpg', },
                { index: 15, cat_idx: 2, thumbUrl: 'https://mchamp.hackers.com/files/lecture/2020/01/61d14559c437b6d14175924332c41ad6.jpg', },
            ],
            thisImages : [
                {
                    source : {
                        uri : 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg'
                    },
                    title : "dfdfdfdfdfdfdfd"
                },
                {
                    source: {
                        uri:
                            'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-forest-in-fog-russian-nature-forest-mist-dmitry-ilyshev.jpg',
                    },
                    title: 'Switzerland',
                },
            
                {
                    source: {
                        uri:
                            'https://i.pinimg.com/564x/a5/1b/63/a51b63c13c7c41fa333b302fc7938f06.jpg',
                    },
                    title: 'USA',
                    width: 400,
                    height: 800,
                },
                {
                    source: {
                        uri:
                            'https://guidetoiceland.imgix.net/4935/x/0/top-10-beautiful-waterfalls-of-iceland-8?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-2.1.1&w=883&s=1fb8e5e1906e1d18fc6b08108a9dde8d',
                    },
                    title: 'Iceland',
                    width: 880,
                    height: 590,
                },
                
            ],
            closeModal2 : this.closeModal2.bind(this)
        }
    }

    UNSAFE_componentWillMount() {        
        this.setState({
            loading: true
        });

        if ( this.props.navigation.state.params.reviewIdx ===  null ) {
            this.failCallAPi()
        }else{
            this.setState({
                reviewData : this.props.navigation.state.params.reviewData
            })
        }
        
        
    }

    componentDidMount() {
        setTimeout(
            () => {                
                this.setState({ loading: false });
            },500);
    }

    UNSAFE_componentWillUnmount() {

    }

    failCallAPi = () => {
        const alerttoast = Toast.show('필수코드가 없는 비정상적인 접근입니다.\n정상적으로 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.navigation.goBack(null)
        }, 2000)
    }

    renderFooter({title}) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
            </View>
        );
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.3);
    animatedHeight2 = new Animated.Value(SCREEN_HEIGHT * 0.35);
    closeModal = () => {
        this.setState({ 
            showModifyForm: false,
         })
    };
    closeModal2 = () => {
        this.setState({             
            showShareForm: false,
         })
         setTimeout(
            () => {
                this.setState({ showModifyForm: true});
            },500)
    };
    showModal2 = () => {        
        this.setState({ 
            showModifyForm: false,            
         })
         setTimeout(
            () => {
                this.setState({ showShareForm: true});
            },500)
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            const item =  this.state.reviewData;
            console.log('item',item)
            let bgColor = '#92b0be';
            return(
                <View style={ styles.container }>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={'#92b0be'} translucent={false}  barStyle="dark-content" />}
                    <View style={{flex:1,backgroundColor:bgColor,minHeight:150,width:SCREEN_WIDTH,marginBottom:2}} >
                        {/* 선생님 설명양약  */}
                        <View style={{minHeight:120,maring:0,padding:0}}>
                            { 
                            item.teacherImage
                            ?
                            <ImageBackground                                    
                                style={{flex:1,padding: 60,position: 'absolute',bottom:0,right:30,opacity:0.9}}
                                resizeMode='cover'
                                source={{uri:item.teacherImage.replace('tchamp','champ')}}
                            />
                            :
                            <ImageBackground                                    
                                style={{flex:1,padding: 60,position: 'absolute',bottom:0,right:30,opacity:0.9}}
                                resizeMode='cover'
                                source={require('../../../assets/images/default_teacher.png')}
                            />
                            }
                            <View style={{marginLeft:30, width:SCREEN_WIDTH/2+20,paddingTop:20}}>
                                <Text 
                                    numberOfLines={2} ellipsizeMode={'tail'}
                                    style={{paddingBottom:10,color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13)}}>
                                    {item.className}
                                </Text>

                                <Text style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold'}}>
                                    {item.teacherName} 선생님
                                </Text>
                            </View>
                            
                        </View>

                        {/* 리뷰내역  */}
                        <ScrollView>
                            <View style={styles.reviewContentWrap}>
                                <View style={{flex:1,width:SCREEN_WIDTH,flexDirection:'row',flexGrow:1,alignItems:'center',justifyContent:'center',paddingVertical:20}}>
                                    <Rating
                                        type='custom'                                                
                                        imageSize={20}
                                        readonly
                                        //ratingColor='#28a5ce'
                                        //ratingBackgroundColor='#ebebeb'
                                        ratingCount={5}
                                        startingValue={item.star}                                                
                                    />
                                    <View style={{paddingLeft:5}}>
                                        <Text style={{color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}}>홍*동</Text>
                                    </View> 
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                                    <Text style={{paddingBottom:5,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),fontWeight:'bold'}}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View style={{alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                                    <HTMLConvert 
                                        {...DEFAULT_PROPS}
                                        html={item.content}
                                    />
                                </View>
                                <View style={{paddingVertical:15}}>
                                    <ScrollView  horizontal={true} nestedScrollEnabled={Platform.OS === 'android' ? true : false}>
                                        { this.state.lectureItems.map((item2, index2) => {
                                            return(
                                                <TouchableOpacity 
                                                    key={index2}
                                                    style={styles.itemBannerContainer} 
                                                    onPress={() => {
                                                        this.setState({
                                                            imageIndex: index2,
                                                            isImageViewVisible: true,
                                                        });
                                                    }}
                                                >
                                                    <Image style={ styles.imgBannerBackground } resizeMode='cover' source={{uri:item2.thumbUrl}} />
                                                </TouchableOpacity>
                                            )
                                    })}
                                    </ScrollView>
                                </View>   
                               
                            </View>  
                            
                        </ScrollView>
                    
                    </View>
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

    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    reviewContentWrap : {
        minHeight:SCREEN_HEIGHT*0.8,
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_13)
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
});