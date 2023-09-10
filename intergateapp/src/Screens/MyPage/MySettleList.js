import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    ActivityIndicator,
    Animated
} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import 'moment/locale/ko'
import  moment  from  "moment";
import DateRangePicker from "../../Utils/DateRangePicker";

import {Button} from 'react-native-elements';

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextL,CustomTextM,TextRobotoM,TextRobotoR} from '../../Style/CustomText';


const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class MySettleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading : true,
            calendarShow : false,
            showModal : false,            
            selectedTerm : 1,
            startDate: moment().subtract(6, 'd'),
            endDate: moment().subtract(-1, 'd'),
            startDateText: moment().subtract(6, 'd').format('YYYY-MM-DD'),
            endDateText: moment().format('YYYY-MM-DD'),
            startDateTerm: moment().subtract(6, 'd').format('YYYYMMDD'),
            endDateTerm: moment().format('YYYYMMDD'),
            displayedDate: moment(),
            minDate: moment().set("date", 17),
            maxDate: moment().set("date", 20),            
            itemlist :[],
            myFavoriteItem : [
                {index :1, title :'토익'},
                {index :2, title :'토익2'},
                {index :3, title :'토익3'},
                {index :4, title :'토익4'}
            ],
            _closeModal : this._closeModal.bind(this)
        }
    }
    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    async UNSAFE_componentWillMount() {
        const isLogin = await CommonUtil.isLoginCheck();
        isLogin === true && this.refreshTextBookInfo();
    }

    componentDidMount() {
      
    }

    UNSAFE_componentWillUnmount() {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    refreshTextBookInfo = async() => {
        const memberIdx = this.props.userToken.memberIdx;
        const aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;    
        // console.log('response.data.aPIsDomain', aPIsDomain)
        // console.log('response.data.aPIsAuthKey', aPIsAuthKey)    
        // console.log( aPIsDomain + '/v1/mypayment/'+memberIdx+'?beginDate='+this.state.startDateTerm+'&endDate='+this.state.endDateTerm)    
        await CommonUtil.callAPI( aPIsDomain + '/v1/mypayment/'+memberIdx+'?beginDate='+this.state.startDateTerm+'&endDate='+this.state.endDateTerm,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },10000
            ).then(response => {
                // console.log('response.data.paymentList', response)
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi(response.message || '결제 내역 조회 실패');
                    } else {
                        
                        if ( typeof response.data.paymentList !== 'undefined') {
                            // console.log('response.data.paymentList', response.data.paymentList)
                            this.setState({
                                loading : false,
                                itemlist : response.data.paymentList
                            })
                        }
                    }
                } else {
                    this.failCallAPi()
                    this.setState({loading:false});
                }
                
            })
            .catch(err => {
                console.log('login error => ', err);
                this.failCallAPi()
                this.setState({loading:false});
        });
    }

    failCallAPi = msg => {
        this.setState({loading:false})    
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

   

    selectTerm = ( term, idx ) => {
        this.setState({
            selectedTerm:idx,
            startDate : moment().subtract(term, 'd'),
            startDateText : moment().subtract(term, 'd').format('YYYY-MM-DD'),
            startDateTerm : moment().subtract(term, 'd').format('YYYYMMDD')
        });        
    }

    setTextDate = () => {
        if ( this.state.startDate && this.state.endDate) {
            this.setState({
                startDateText: moment(this.state.startDate).format('YYYY-MM-DD'),
                endDateText: moment(this.state.endDate).format('YYYY-MM-DD'),
                startDateTerm: moment(this.state.startDate).format('YYYYMMDD'),
                endDateTerm: moment(this.state.endDate).format('YYYYMMDD'),
            })
        }

    }

    _showModal = async() => {
        if ( this.state.startDate && this.state.endDate) { 
            this.setState({                 
                calendarShow: true
             })
        }else{
            this.setState({ 
                endDate : this.state.startDate,
                calendarShow: true
             })
        }
    };
    _closeModal = async() => {        
        await this.setTextDate();
        
        this.setState({ calendarShow: false })
        
    };


    setDates = dates => {        
        this.setState({
            ...dates
          });
    };
    

    render() {
        const defaultKeyword = [
            {index:1,title : '1주일',days : 7},
            {index:2,title : '1개월',days : 30},
            {index:3,title : '6개월',days : 180},
            {index:4,title : '12개월',days : 365}
        ]

        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {

            return(
                <View style={ styles.container }>
                    {/** 달력 모달 **/}
                    <Modal
                        onBackdropPress={this._closeModal}
                        animationType="slide"
                        //transparent={true}
                        onRequestClose={() => {
                            this.setState({calendarShow:false})
                        }}
                        onBackdropPress={() => {
                            this.setState({calendarShow:false})
                        }}
                        style={{justifyContent: 'flex-end',margin: 0}}
                        useNativeDriver={true}
                        animationInTiming={300}
                        animationOutTiming={300}
                        hideModalContentWhileAnimating                    
                        isVisible={this.state.calendarShow}
                    >
                        <Animated.View style={[styles.modalContainer,{ height: this.animatedHeight }]}>
                            <DateRangePicker
                                onChange={this.setDates}
                                onIsOpen={this.state.calendarShow}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                //minDate={this.state.minDate}
                                //maxDate={this.state.maxDate}
                                range
                                displayedDate={this.state.displayedDate}
                                screenState={this.state}
                            />
                        </Animated.View>
                        
                    </Modal>
                    <View >
                        <View style={{backgroundColor:DEFAULT_COLOR.input_bg_color,paddingBottom:5,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>                            
                            <View style={{flexDirection:'row',marginHorizontal:5}}>
                                {defaultKeyword.map((item,index)=> {
                                    return (
                                        <View key={index} style={{flex:1}}>
                                            {
                                            this.state.selectedTerm === item.index ? 
                                            <TouchableOpacity 
                                                onPress={()=>this.selectTerm(item.days,item.index)}
                                                style={styles.termWrapperOn}>
                                                <CustomTextR style={styles.termTextOn}>{item.title}</CustomTextR>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity 
                                                style={styles.termWrapper}
                                                onPress={()=>this.selectTerm(item.days,item.index)}
                                            >
                                                <CustomTextR style={styles.termText}>{item.title}</CustomTextR>
                                            </TouchableOpacity>
                                            }
                                        </View>
                                    )
                                })}                       
                            </View>
                            <View style={{marginBottom:10,flexDirection:'row',marginHorizontal:10}}>
                                <View style={{flex:4.5}}>
                                    <View style={{flex:1,flexDirection:'row',borderWidth:1,borderColor:DEFAULT_COLOR.input_bg_color,borderRadius:5,height:40,backgroundColor:'#ebeef0'}} >
                                        <View style={{flex:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                            <Text style={styles.termText2}>{this.state.startDateText}</Text>
                                            <Text style={styles.termText2}>{"-"}</Text>
                                            <Text style={styles.termText2}>{this.state.endDateText}</Text>
                                        </View>
                                        <View style={{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:5}}>
                                            <TouchableOpacity onPress={()=>this._showModal()}>
                                                <Icon name='calendar' size={20} color={DEFAULT_COLOR.base_color_666} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{flex:1,paddingHorizontal:3}}>
                                    <Button
                                        onPress={() => this.refreshTextBookInfo()}
                                        title="조회"
                                        titleStyle={{color:DEFAULT_COLOR.base_color_666}}
                                        buttonStyle={{borderColor:DEFAULT_COLOR.base_color_666,borderWidth:1,height:35,backgroundColor:'#fff'}}
                                        
                                        type="outline"
                                    />
                                </View>
                            </View>   
                        </View>
                        <ScrollView >
                            <View style={{flex:1,marginBottom:100,backgroundColor:'#fff',paddingHorizontal:5}}>
                            { 
                                this.state.itemlist.length === 0 ?
                                
                                    <View style={{marginHorizontal:10,marginVertical:10,paddingVertical:10,alignItems:'center'}}>
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                            검색 결과가 없습니다.
                                        </CustomTextR>
                                    </View>
                                
                                :
                                this.state.itemlist.map((titem, index) => {     
                                    return(                           
                                        <TouchableOpacity 
                                            style={styles.itemWrap} key={index}
                                            onPress={() => this.props.screenProps.navigation.navigate('SettleDetail',{
                                                titem
                                            }) }
                                        >                             
                                            <View style={{flex:1}}>
                                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}} numberOfLines={2} ellipsizeMode = 'tail'>
                                                    {titem.productName}
                                                </CustomTextR>
                                            </View>      
                                            <View style={{flex:1,paddingVertical:5,flexDirection:'row',flexGrow:1}}>
                                                <View style={{flex:1,paddingVertical:5}}>
                                                    <CustomTextM style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                                        {titem.deliveryStatus}
                                                    </CustomTextM>
                                                </View>
                                                <View style={{flex:3,paddingVertical:5,flexDirection:'row',flexGrow:1,justifyContent:'flex-end',alignItems:'flex-end'}}>                                                    
                                                    <CustomTextR style={{color:'#aaa',fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                                        {titem.paymentDatetime}
                                                    </CustomTextR>                                                    
                                                    <CustomTextR                                                 
                                                        style={{color:DEFAULT_COLOR.base_color_ccc,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14),paddingHorizontal:5}}
                                                    >|</CustomTextR>
                                                    <CustomTextM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>
                                                        {CommonFuncion.currencyFormat(titem.amount)}원
                                                    </CustomTextM>                                                    
                                                </View>
                                            </View>
                                                                                
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>
                        </ScrollView>                 
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
    termWrapper : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,backgroundColor:'#fff',borderRadius:25,alignItems:'center'
    },
    termWrapperOn : {
        marginVertical:5,marginHorizontal:5,paddingVertical:5,paddingHorizontal:15,borderColor:DEFAULT_COLOR.lecture_base,borderWidth:1,backgroundColor:'#fff',borderRadius:15,alignItems:'center'
    },
    termText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.base_color_444,letterSpacing:-0.7
    },
    termTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),color:DEFAULT_COLOR.lecture_base,letterSpacing:-0.7
    },
    termText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },
    termText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_222
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },

    /**** Modal  *******/    
    modalContainer: {
     
    },    
    modalContainer2: {                
        backgroundColor: '#fff',
        height:SCREEN_HEIGHT*0.5,
        width:SCREEN_WIDTH*0.9,
        borderRadius:15
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sampleWrapper : {
        flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    sampleWrapperOn :{
        flex:1,borderBottomColor:DEFAULT_COLOR.lecture_base,borderBottomWidth:2,paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    smapleText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    smapleTextOn : {fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },

    termWrapper : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.input_border_color,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termWrapperOn : {
        marginVertical:10,marginHorizontal:5,paddingVertical:10,paddingHorizontal:15,borderColor:DEFAULT_COLOR.lecture_base,borderWidth:1,backgroundColor:'#fff',borderRadius:20,alignItems:'center'
    },
    termText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small)
    },
    termTextOn : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color:DEFAULT_COLOR.lecture_base
    },
    termText2 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },
    termText3 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_222
    },
    termText4 : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),paddingHorizontal:5,color:DEFAULT_COLOR.base_color_666
    },

    itemWrap : {                
        marginHorizontal:10,marginVertical:10,paddingVertical:10,
        borderBottomWidth:1,borderBottomColor:'#ccc',
        
    },

    fixedWriteButton : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:2,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.8
    },
    fixedWriteButton2 : {
        position:'absolute',bottom:70,right:20,width:50,height:50,backgroundColor:'#222',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,
    },

    slideCommonWrap: {        
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5,
        marginVertical:2,
        paddingHorizontal:5,
        paddingVertical:7,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:DEFAULT_COLOR.input_border_color,
        borderRadius:5
    },
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,
        userToken: state.GlabalStatus.userToken,
    };
}
export default connect(mapStateToProps, null)(MySettleList);