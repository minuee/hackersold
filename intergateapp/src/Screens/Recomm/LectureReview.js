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
    Animated
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
Icon.loadFont();
import ImageView from '../../Utils/ImageViewer/ImageView';
import TextReadMore from '../Review/TextReadMore';
import {connect} from 'react-redux';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomText, CustomTextR, CustomTextM, CustomTextB, TextRobotoR, TextRobotoM, TextRobotoB} from '../../Style/CustomText';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const pageViewLimit = 5;


class LectureReview extends Component {
    constructor(props) {

        super(props);
        this.state = {
            loading: true,
            moreLoading : false,
            historyTmp : [],
            imageIndex: null,
            isImageViewVisible: false,
            showModifyForm : false,
            showShareForm : false,      
            lectureIdx : this.props.screenState.lectureIdx,
            currentpage : 0,    
            totalReview : 0,  
            reviewItems : [],
            baseStars : [1,2,3,4,5]
        }
    }

    UNSAFE_componentWillMount() {        
        this.setState({
            loading: true
        });

        this.refreshTextBookInfo(this.state.lectureIdx,1,pageViewLimit);
    }

    componentDidMount() {
       
    }

    UNSAFE_componentWillUnmount() {

    }


    refreshTextBookInfo = async(classIdx,page,paginate) => {
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apiTestDomain
        await CommonUtil.callAPI( aPIsDomain + '/v1/review/course/'+classIdx+'?page='+page+'&paginate='+paginate,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },10000
            ).then(response => {
                //console.log('LectureReview > refreshTextBookInfo()', 'response = ' + JSON.stringify(response))
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if ( response.code !== '0000' ) {
                        this.setState({loading:false})    
                        this.failCallAPi(response.message || '수강후기 불러오기 실패');
                    }else{

                        if ( typeof response.data.reviewList !== 'undefined') {
                            this.setState({
                                loading : false,
                                ismore : response.data.current_page < response.data.last_page ? true : false,
                                reviewItems : response.data.reviewList,
                                currentpage : response.data.current_page,
                                totalReview : parseInt(response.data.total)
                            })
                        }
                    }

                }else{
                    this.failCallAPi('수강후기 불러오기 실패')
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('login error => ', err);
                this.setState({loading:false})    
                this.failCallAPi()
        });

       
    }

    refreshTextBookInfoMore = async(classIdx,page,paginate) => {      
           
        if ( this.state.ismore ) {
            this.setState({moreLoading:true});
            let selectedFilterCodeList = this.state.reviewItems;          
            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apiTestDomain
            await CommonUtil.callAPI( aPIsDomain + '/v1/review/course/'+classIdx+'?page='+page+'&paginate='+paginate,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'application/json; charset=UTF-8',
                    'apiKey': aPIsAuthKey
                }), 
                    body:null
                },10000
                ).then(response => {
                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            failCallAPi(response.message || '수강후기 불러오기 실패');
                        }else{
                            response.data.reviewList.forEach(function(element,index,array){                                
                                selectedFilterCodeList.push(element);
                            }); 
                            
                            this.setState({
                                moreLoading : false,
                                ismore : response.data.current_page < response.data.last_page ? true : false,
                                reviewItems : selectedFilterCodeList,
                                currentpage : response.data.current_page
                            })
                        }

                    }else{
                        this.failCallAPi('수강후기 불러오기 실패');
                    }
                    this.setState({moreLoading:false})    
                })
                .catch(err => {
                    console.log('login error => ', err);
                    this.failCallAPi()
            });
        }       
    }

    failCallAPi = msg => {
 
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);
    }

    _handleTextReady = () => {
        
    }

    renderFooter({title}) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
            </View>
        );
    }
    setImageGallery = async( data, idx ) => {
        let returnArray = await this.setImages(data)
        this.setState({
            imageIndex: idx,
            thisImages : returnArray
        })
        this.setState({isImageViewVisible: true})

    }

    reviewViewToggle = ( idx , bool ) => {
        this.state.reviewItems[idx].opened = bool;
        this.forceUpdate();    
    }


    render() {
 
        
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        } else {
            //const STAR_IMAGE_ON = require('../../../assets/icons/btn_view_favorite_on.png')
            //const STAR_IMAGE_OFF = require('../../../assets/icons/btn_view_favorite_off.png')
            const STAR_IMAGE_ON = require('../../../assets/icons/icon_star_on_s.png')
            const STAR_IMAGE_OFF = require('../../../assets/icons/icon_star_off_s.png')
            return(
                <View style={ styles.container }>
                    { this.state.reviewItems.length  > 0 
                    ?
                    this.state.reviewItems.map((item, index) => {
                        //let bgColor = index%2 === 0  ? '#fff' : '#f5f7f8'
                        if ( item.opened ) { 
                            return(
                                <View key={index} style={{flex:1,backgroundColor:'#f5f7f8',width:SCREEN_WIDTH,marginBottom:5}} >
                                    <View 
                                        //onPress={() => this.reviewViewToggle(index,false)}
                                        style={styles.reviewContentWrap}
                                    >
                                        <View style={{flex:1,width:SCREEN_WIDTH,flexDirection:'row',flexGrow:1,paddingVertical:10}}>
                                            { this.state.baseStars.map((star2, sindex2) => {
                                                return(
                                                    <View key={sindex2}>
                                                        { item.starScore > parseInt(sindex2) ?
                                                         <Image style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} resizeMode="contain" source={STAR_IMAGE_ON}/>
                                                         :
                                                         <Image style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} resizeMode="contain" source={STAR_IMAGE_OFF}/>
                                                        }
                                                    </View>
                                                )
                                                })
                                            }
                                            <View style={{paddingLeft:5}}>
                                                <CustomTextR style={{color:'#aaaaaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{item.userName}</CustomTextR>
                                            </View> 
                                        </View>
                                        <TouchableOpacity 
                                            onPress={() => this.reviewViewToggle(index,false)}
                                            style={{paddingVertical:5,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}
                                        >
                                            <CustomTextR style={{paddingBottom:5,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)}}>
                                                {item.title}
                                            </CustomTextR>
                                        </TouchableOpacity>
                                        <View style={{alignItems:'center',justifyContent:'center',paddingVertical:10}}>
                                            <TextReadMore
                                                numberOfLines={2}
                                                onReady={() => this._handleTextReady}
                                            >
                                                <CustomTextR style={styles.cardText}>
                                                    {CommonFuncion.strip_tags(item.content)}
                                                </CustomTextR>
                                            </TextReadMore>
                                        </View>
                                        <View style={{paddingVertical:15}}>
                                            { item.files && Array.isArray(item.files) ?
                                                <ScrollView  horizontal={true}>
                                                    { item.files.map((item2, index2) => {
                                                        return(
                                                            <View key={index2} style={styles.itemBannerContainer}>
                                                                <TouchableOpacity onPress={() => this.setImageGallery(item.files, index2)}>
                                                                    <Image style={styles.imgBannerBackground} resizeMode='cover' source={{uri:item2.url}} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    })}
                                                </ScrollView>
                                            :
                                            <Text></Text>
                                            }
                                        </View>  
                                    </View>
                                </View>
                            )
                        }else{
                           
                            return(
                                <View key={index} style={{flex:1,backgroundColor:DEFAULT_COLOR.base_color_fff,width:SCREEN_WIDTH,marginBottom:5}} >  
                                    <TouchableOpacity 
                                        onPress={() => this.reviewViewToggle(index,true)}
                                        style={styles.reviewContentWrap2}
                                    >
                                        <View style={{flex:1,width:SCREEN_WIDTH,flexDirection:'row',flexGrow:1,paddingVertical:10}}>
                                            
                                            { this.state.baseStars.map((star2, sindex2) => {
                                                return(
                                                    <View key={sindex2}>
                                                        { item.starScore > parseInt(sindex2) ?
                                                         <Image style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} resizeMode="contain" source={STAR_IMAGE_ON}/>
                                                         :
                                                         <Image style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)}} resizeMode="contain" source={STAR_IMAGE_OFF}/>
                                                        }
                                                    </View>
                                                )
                                                })
                                            }
                                           {/*
                                            <Rating
                                                type='custom'                                                
                                                imageSize={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)}
                                                //ratingImage={STAR_IMAGE}
                                                readonly
                                                //ratingColor='#28a5ce'
                                                //ratingBackgroundColor={'#f5f7f8'}
                                                //style={{backgroundColor:'#f5f7f8'}}
                                                ratingCount={5}
                                                startingValue={item.starScore}                                                
                                            />
                                           */}
                                            <View style={{paddingLeft:5}}>
                                                <CustomTextR 
                                                    numberOfLines={1} 
                                                    ellipsizeMode={'tail'}
                                                    style={{color:'#aaaaaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}
                                                >
                                                    {item.userName}
                                                </CustomTextR>
                                            </View> 
                                        </View>
                                        <View style={{paddingVertical:10}}>
                                            <CustomTextR numberOfLines={2} style={{paddingBottom:5,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15),letterSpacing:PixelRatio.roundToNearestPixel(-0.75)}}>
                                                {item.title}
                                            </CustomTextR>
                                        </View> 
                                    </TouchableOpacity>
                                </View>
                            )

                        }
                    })
                    :
                    <View style={[styles.itemWrap,{alignItems:'center', justifyContent: 'center', height: SCREEN_HEIGHT * 0.25}]}>
                        <Image source={require('../../../assets/icons/icon_none_exclamation.png')} style={{width: PixelRatio.roundToNearestPixel(65), height: PixelRatio.roundToNearestPixel(65), marginBottom: 12}} />
                        <CustomTextR
                            style={{
                                textAlign: 'center',
                                color: DEFAULT_COLOR.base_color_888,
                                fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
                                lineHeight: PixelRatio.roundToNearestPixel(18.1),
                                letterSpacing: -0.69,
                            }}>
                            작성하신 게시글이 없습니다.{"\n"}게시글을 작성해주세요 :)
                        </CustomTextR>
                    </View>
                    }
                    { this.state.ismore && 
                        <View style={{flex:1,justifyContent:'center'}}>
                            <View style={styles.bodyContainer }>
                                <View style={styles.inbodyContainer }>
                                    {this.state.moreLoading 
                                    ?
                                    <View style={styles.moreContainer}><ActivityIndicator size="small" /></View>
                                    :
                                    <TouchableOpacity 
                                        style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5}}
                                        onPress={()=> this.refreshTextBookInfoMore(this.props.screenState.lectureIdx,parseInt(this.state.currentpage)+1,pageViewLimit)}
                                    >
                                        <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),fontWeight: "500",color:DEFAULT_COLOR.base_color_222}}>+ 수강후기 더보기</CustomTextM>                                        
                                        <CustomTextM style={{paddingLeft:5,color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}>
                                            {this.state.currentpage*pageViewLimit}/{this.state.totalReview}
                                        </CustomTextM>
                                    </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>
                    }
                
                    <ImageView
                        glideAlways
                        images={this.state.thisImages}
                        imageIndex={this.state.imageIndex}
                        controls={true}
                        animationType="fade"
                        isVisible={this.state.isImageViewVisible}
                        //renderFooter={this.renderFooter}
                        renderFooter={(currentImage) => (<View style={styles.footer}>
                            <TextRobotoR style={styles.footerText}><TextRobotoB>{this.state.imageIndex+1}</TextRobotoB>/<TextRobotoL>{this.state.thisImages.length}</TextRobotoL></TextRobotoR>
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
    moreContainer : {
        flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,paddingVertical:10,borderRadius:5
    },
    requestTitleText2 : {
        color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },

    reviewContentWrap : {        
        marginHorizontal:20,
        justifyContent:'flex-start'
    },
    reviewContentWrap2 : {
        marginHorizontal:20,
        justifyContent:'flex-start',
        borderBottomWidth:1,
        borderBottomColor:DEFAULT_COLOR.input_border_color
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
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
        letterSpacing:PixelRatio.roundToNearestPixel(-0.65)
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
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),
        letterSpacing: PixelRatio.roundToNearestPixel(-0.9),
        color: '#FFF',
        textAlign: 'center',
    },

    bodyContainer : {        
        flexDirection:'row',
        backgroundColor : "#fff",
        borderBottomColor:DEFAULT_COLOR.input_border_color,
        borderBottomWidth:1  ,
        padding:20,
        
    },
    inbodyContainer : {      
        flex:1,flexDirection:'row',backgroundColor : "#fff",     
    },
    itemWrap : {                
        marginHorizontal:10,        
        marginVertical:10,        
        paddingVertical:10
    },
});


function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}

export default connect(mapStateToProps, null)(LectureReview);
