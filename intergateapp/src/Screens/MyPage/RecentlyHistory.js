import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    PixelRatio,
    Linking,
    Platform,
    TouchableOpacity,
    Alert
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';


import 'moment/locale/ko'
import  moment  from  "moment";
let CurrentDateTimeStamp = moment().unix();

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

function compare_item(a, b){
        // a should come before b in the sorted order
        if(a.date < b.date){
                return -1;
        // a should come after b in the sorted order
        }else if(a.date > b.date){
                return 1;
        // and and b are the same
        }else{
                return 0;
        }
}

class RecentlyHistory extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state={
            loading : true,
            contentWidth : 100,
            history : []
        };
    }

    UNSAFE_componentWillMount() {        
        this.getHistory()
        
    }  

    componentDidMount() {     
        this.setState({loading:false});
        
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {       
        this.getHistory();     
    }

    componentWillUnmount(){
       
    }

    onLayoutHeader = (evt ) => {
        //console.log('height2',SCREEN_HEIGHT);
        //console.log('height',evt.nativeEvent.layout);
        this.setState({contentWidth : evt.nativeEvent.layout.width});
    }

    getHistory = async() => {      
        /*  
        let hdata = await AsyncStorage.getItem('history');            
        if ( typeof JSON.parse(hdata) !== null ) { 
            if ( hdata.length > 0 ) { 
                this.setState({history : JSON.parse(hdata)})
            }
        }
        */
        
        let historyData = [];         
        //let setMyInterestCode = typeof this.props.myInterestCodeOne.code !== 'undefined' ? this.props.myInterestCodeOne.code : 'all';
        await AsyncStorage.getItem('history', (error, result) => {
            {                
                if(result) {           
                    historyData =  JSON.parse(result);
                    
                }else{
                    this.setState({history : historyData})
                }
            }
        });
        historyData.sort((a, b) => ( b.date > a.date) ? 1 : -1)  ;
        //let historyData2 =  await historyData.filter(item => ( setMyInterestCode === item.interestCode || item.interestCode === 'all' ) ); 
        this.setState({ history: historyData.sort()})
        

    }

    moveNavigate = async(interestCode,interestName,target,idx,bannerurl=null) => {

        
        if ( interestCode === this.props.myInterestCodeOne.code || interestCode === 'all') {

            if ( target === 'LectureDetailScreen') {
                this.props.screenProps.navigation.navigate('LectureDetailScreen',{
                    fromHistory : true, 
                    lectureIdx : idx,
                    lecturList : [bannerurl],
                    lectureSeq :  0
                })
            }else if ( target === 'TextBookDetail') {
                this.props.screenProps.navigation.navigate('TextBookDetail',{
                    fromHistory : true, 
                    bookIdx : idx,
                    bannerurl : bannerurl,
                    isagent : true
                })            
            }else if ( target === 'FreeLectureDetail'){
                this.props.screenProps.navigation.navigate('FreeLectureDetail',{
                    fromHistory : true, 
                    lectureItem: {
                        index: idx,
                        cat_idx: 1,
                        mainTitle: 'Text해커스 토익 왕기초 Listening',
                        subTitle: 'Test토린이를 위한 토익 첫걸음 | 리스닝 4주 완성!',
                        thumbUrl: 'https://mchamp.hackers.com/files/lecture/2019/11/3c3bcde9f02ec0d291fcbac735561aac.jpg',
                        videoUrl: 'http://mvod.hackers.co.kr/champstudymobile/sample_movie/15068_s.mp4',
                    }
                }) 
            }else if ( target === 'FreeBoardDetail') {        
                this.props.screenProps.navigation.navigate('FreeBoardDetail2',{
                    fromHistory : true, 
                    titem : bannerurl
                }) 

            }else if ( target === 'ReviewDetailScreen') {               
                this.props.screenProps.navigation.navigate('ReviewDetailScreen',{
                    fromHistory : true, 
                    reviewIdx : idx,
                    reviewData : bannerurl
                }) 
                
            }else if ( target === 'BrowwerLink') {
                Linking.openURL(bannerurl);
            }
        }else {
            Alert.alert(DEFAULT_CONSTANTS.appName, '컨텐츠 확인을 위해서 (' + interestName + ') 관심분야로 변경이 필요합니다.',
            [
                {text: '확인', onPress: () => console.log('로그인 취소')},
            ]);
        }

    }
    render() {
        if ( this.state.loading ) {
            return (
                <View style={{flex: 1,width:'100%',backgroundColor : "#fff",textAlign: 'center',alignItems: 'center',justifyContent: 'center',}}><ActivityIndicator size="large" /></View>
            )
        }else {

            const LectureData = (data) => {                
                return (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',maxWidth:this.state.contentWidth-10}}>
                        <TouchableOpacity onPress={() =>this.moveNavigate(data.data.interestCode,data.data.interestName,data.data.navigate,data.data.idx,data.data.contents)}>
                        { data.data.imageurl ?
                            <Image source={{uri:data.data.imageurl}} style={{width:parseInt(this.state.contentWidth-10),height:parseInt(this.state.contentWidth-10)/2}} resizeMode='cover' />
                            :
                            <View style={{borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,justifyContent:'center',alignContent:'center',paddingVertical:20,marginVertical:10}}>
                                <Text style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}>{data.data.title}</Text>
                            </View>
                        }
                        </TouchableOpacity>
                    </View>
                )
            }

            const FreeLectureData = (data) => {                
                return (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',maxWidth:this.state.contentWidth-10}}>
                        <TouchableOpacity onPress={() =>this.moveNavigate(data.data.interestCode,data.data.interestName,data.data.navigate,data.data.idx)}>
                        { data.data.imageurl ?
                            <Image source={{uri:data.data.imageurl}} style={{width:parseInt(this.state.contentWidth-20),height:parseInt(this.state.contentWidth-20)/2}} resizeMode='cover' />
                            :
                            <View style={{borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,justifyContent:'center',alignContent:'center',paddingVertical:20,marginVertical:10}}>
                                <Text style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}>{data.data.title}</Text>
                            </View>
                        }
                        </TouchableOpacity>
                    </View>
                )
            } 

            const EventData = (data) => {                
                return (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center',maxWidth:this.state.contentWidth-10}}>
                        <TouchableOpacity onPress={() =>this.moveNavigate(data.data.interestCode,data.data.interestName,data.data.navigate,null,data.data.urllink)}>
                        { data.data.imageurl ?
                            <Image source={{uri:data.data.imageurl}} style={{width:parseInt(this.state.contentWidth-10),height:parseInt(this.state.contentWidth)/3}} resizeMode='cover' />
                            :
                            <View style={{borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,justifyContent:'center',alignContent:'center',paddingVertical:20,marginVertical:10}}>
                                <Text style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}>{data.data.title}</Text>
                            </View>
                        }
                        </TouchableOpacity>
                    </View>
                )
            }

            const FreeBoardData = (data) => {                
                return (
                    <TouchableOpacity onPress={() =>this.moveNavigate(data.data.interestCode,data.data.interestName,data.data.navigate,data.data.idx,data.data.contents)}>
                        <View style={{flex:1,flexDirection:'row',flexGrow:1,flexWrap:'wrap'}}>
                            <View style={{borderRadius:15,height:30,minWidth:40,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                                <CustomTextM style={{color:'#3674c0',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contents.interestFieldName}</CustomTextM>
                            </View>
                            <View style={{borderRadius:15,height:30,minWidth:50,borderWidth:1,borderColor:'#3674c0',justifyContent:'center',alignItems:'center',marginRight:5,paddingHorizontal:10}}>
                                <CustomTextM style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>자유게시판</CustomTextM>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            <View style={{flex:1,paddingTop:10}}>
                                <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6}}>{data.data.contents.title}</CustomTextM>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                            <View style={{flex:1,paddingTop:10}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}} numberOfLines={2} ellipsizeMode = 'tail'>
                                    {data.data.contents.description}
                                </CustomTextR>
                            </View>
                        </View>
                        <View style={{flex:1,flexDirection:'row',flexGrow:1}}>
                            <View style={{paddingTop:10,paddingRight:5}}>
                                <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>
                                    {data.data.contents.regDatetime ?data.data.contents.regDatetime.substring(0,10) : null}
                                </CustomTextR>
                            </View>
                            <View style={{paddingTop:10}}>
                                <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}>{data.data.contents.memberName}</CustomTextR>
                            </View>
                        </View>
                    </TouchableOpacity>
                    )
            }
            const TextBookData = (data) => {
                return (
                    <TouchableOpacity onPress={() =>this.moveNavigate(data.data.interestCode,data.data.interestName,data.data.navigate,data.data.idx,data.data.imageurl)}>
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <View style={{flex:1}}>
                            { 
                                data.data.imageurl ?
                                <Image source={{uri:data.data.imageurl}} style={{width:parseInt(this.state.contentWidth*0.3),height:parseInt(this.state.contentWidth*0.3)*1.5}} resizeMode='cover' />
                                :
                                <View style={{borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,justifyContent:'center',alignContent:'center',paddingVertical:20}}>
                                    <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}} numberOfLines={2} ellipsizeMode = 'tail'>{data.data.title}</CustomTextM>                                   
                                </View>
                            }
                            </View>
                            <View style={{flex:1.8,justifyContent:'flex-start',paddingLeft:10}}>
                                <View style={{flex:1}}>
                                    <CustomTextM style={{paddingBottom:15,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}} numberOfLines={2} ellipsizeMode = 'tail'>
                                        {data.data.title}
                                    </CustomTextM>
                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_888,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}} numberOfLines={3} ellipsizeMode = 'tail'>
                                        {data.data.description}
                                    </CustomTextR>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
            const DefaultData = () => {        
                return (
                    <View style={{alignItems:'center'}}>
                        <Text                                                 
                            style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                        >정보가 없거나 잘못된 정보입니다.
                        </Text>
                    </View>
                )
            }

            return(
                <View style={ styles.container } onLayout={(e)=>this.onLayoutHeader(e)}>
                    {
                        this.state.history.length === 0 ?
                        <View style={{alignItems:'center'}}>
                            <CustomTextR style={styles.newsUnSelectedText}>최근 보신 컨텐츠가 없습니다.</CustomTextR>

                        </View>
                        :
                       <ScrollView >
                        {this.state.history.map((item,index) => {
                            return (
                                <View style={index > 0 ? styles.baseCommonWrap : styles.baseFirstWrap} key={index}>
                                    {
                                        item.type === 'lecture' 
                                        ?
                                        <LectureData data={item} />
                                        :
                                        item.type === 'textbook'
                                        ?
                                        <TextBookData data={item} />
                                        :
                                        item.type === 'freepractice'
                                        ?
                                        <FreeLectureData data={item} />
                                        :
                                        item.type === 'event'
                                        ?
                                        <EventData data={item} />
                                        :
                                        (item.type === 'freeboard' || item.type === 'lecturereview')
                                        ?
                                        <FreeBoardData data={item} />
                                        :
                                        <DefaultData data={item} />
                                    }

                                </View>
                            )
                        })
                        }
                        </ScrollView>
                    }
                </View>
            );
        }
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal:10,
        marginTop:10,
        marginBottom : Platform.OS === 'android' ? 100 : 10
    },
    baseFirstWrap : {
        paddingBottom:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_bg_color
    },
    baseCommonWrap : {
        paddingVertical:10,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.input_bg_color
    },
    newsUnSelectedText : {
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),
        color: DEFAULT_COLOR.base_color_888,
        letterSpacing : -0.84
    },
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne, 
        userToken: state.GlabalStatus.userToken,   
    };
}



export default connect(mapStateToProps, null)(RecentlyHistory);