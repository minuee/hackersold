import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    ImageBackground,
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,    
    Animated,
    ActivityIndicator,
    PixelRatio,
    Platform
} from 'react-native';
import Modal from 'react-native-modal';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import SearchFilter from './SearchFilter';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MarqueeVertical from '../../Utils/MarqueeVertical'

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import styles from '../../Style/Recomm/LectureListScreen';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';

const pageViewLimit = 10;
class LectureListScreen extends Component {

    constructor(props) {
        super(props);        
        this.state = {
            loading : true,
            selectItem : 0,
            showItem : 2,
            showModal : false,
            items : [],
            testItems : [
                { index :1, title : '토익시험' , dday : 30 },
                { index :2, title : '토익시험2' , dday : 35 },
                { index :3, title : '토익시험3' , dday : 66 }
            ],            
            selectedFilterCodeList : [],
            _showModal : this._showModal.bind(this),
            _closeModal : this._closeModal.bind(this),
            refreshTextBookInfo : this.refreshTextBookInfo.bind(this)
           
        }   
            
    }

    UNSAFE_componentWillMount() {
        this.refreshTextBookInfo(1);
    }    

    componentDidMount() {
      
    }

    refreshTextBookInfo = async(page) => {    
        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey    
        await CommonUtil.callAPI( aPIsDomain + '/v1/product?page='+page+'&paginate=' + pageViewLimit,{
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
                        this.failCallAPi()
                    }else{
                      
                        this.setState({
                            loading : false,
                            items:response.data.productList,
                            ismore : response.data.current_page < response.data.last_page ? true : false,
                            currentpage : response.data.current_page,
                        })

                        //this.props.screenState.setPageMore(response.data.current_page,response.data.current_page < response.data.last_page ? true : false)
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

    goDetail = async(classIdx) => {        
        //console.log('idx',idx);
        this.props.screennavigation2.navigate('LectureDetailScreen',{
            lectureIdx : 11835//classIdx
        });
    }

    _closeModal = () => {
        this.setState({ showModal: false })
        
    };
    _showModal = async() => {                
        this.setState({ showModal: true })
        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);
    
    render() {
        
        let filterData = this.state.items;
            if ( typeof this.props.myTopFilter.filter1 !== 'undefined' && this.props.myTopFilter.filter1.length > 0 ) {
                
                groupedType = CommonFuncion.groupBy(this.props.myTopFilter.filter1, 'type');                
                console.log('groupedType', groupedType)
                if ( typeof groupedType[1] !== 'undefined' ) {                    
                    let checkArray1 = [];
                    groupedType[1].map((data1) => {
                        return checkArray1.push(data1.code)
                    })
                    filterData = filterData.filter(
                        fitems => {
                            return fitems.level03.indexOf(checkArray1) > -1 
                        }
                    );
                }

                if ( typeof groupedType[2] !== 'undefined' ) {                    
                    let checkArray2 = [];
                    groupedType[2].map((data2) => {
                        return checkArray2.push(data2.code)
                    })
                    filterData = filterData.filter(
                        fitems => {
                            return fitems.level04.indexOf(checkArray2) > -1 
                        }
                    );
                    
                }
                if ( typeof groupedType[3] !== 'undefined' ) {                    
                    let checkArray3 = [];
                    groupedType[3].map((data3) => {
                        return checkArray3.push(data3.code)
                    })
                    filterData = filterData.filter(
                        fitems => {
                            return fitems.difficulty.indexOf(checkArray3) > -1 
                        }
                    );
                    
                }
                if ( typeof groupedType[4] !== 'undefined' ) {                    
                    let checkArray4 = [];
                    groupedType[4].map((data1) => {
                        return checkArray4.push(data4.code)
                    })
                    filterData = filterData.filter(
                        fitems => {
                            return fitems.teachers.indexOf(checkArray4) > -1 
                        }
                    );
                }
            }     
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
         }else {

            return (
                <View style={styles.container}>
                    
                    <View style={styles.filterWrapper}>                    
                        <View style={styles.filterWakuWrapper} >
                            <View style={styles.filterWakuWrapperLeft}>
                                <ScrollView         
                                    style={{paddingVertical:5}}                        
                                    horizontal={true}
                                    nestedScrollEnabled={Platform.OS === 'android' ? true : false}
                                    >
                                        { this.props.myTopFilter.filter1 === undefined || this.props.myTopFilter.filter1.length === 0
                                        ?
                                            <Text style={styles.filterWakuWrapperLeftText}>전체항목</Text>
                                        :
                                                this.props.myTopFilter.filter1.map((fdata,index3) => {
                                                return (
                                                    <Text style={[styles.filterWakuWrapperLeftText,{marginRight:10}]} key={index3}>
                                                        {fdata.name}
                                                    </Text>
                                                )
                                            })
                                        }
                                </ScrollView>
                            </View>
                            <View style={styles.filterWakuWrapperRight}>
                                <TouchableOpacity 
                                    style={{paddingVertical:5,paddingHorizontal:10,alignContent:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.base_color_ccc,borderRadius:5}}
                                    onPress={()=>this._showModal()}
                                >
                                    <Text style={styles.filterWakuWrapperLeftText} >필터</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                
                    <View style={styles.testScheduleWrapper} >
                        {/*}
                        <TouchableHighlight 
                            style={{flex:1,width:'90%',alignItems:'center',justifyContent:'center',paddingVertical : 10, backgroundColor:'#ccc',borderRadius : 20}}>
                            <Text>토익시험 D-30 // 이거  2개이상일때 like a ticker</Text>
                        </TouchableHighlight>    
                        */}    
                        <MarqueeVertical
                            textList = {[
                                {label : '1',value : '토익시험' + ' D-30'},
                                {label : '2',value : '토익시험' + ' D-40'},
                                {label : '3',value : '토익시험 D-60'},
                                {label : '4',value : '토익시험 D-70'},
                                {label : '5',value : '토익시험 D-90'},
                            ]}
                            width = {SCREEN_WIDTH-10}
                            height = {40}
                            /*
                            headViews = {[
                                
                                <Image 
                                    source = {require('../../../assets/images/brain.png')}
                                    style = {{width : 36,height : 36}}
                                />,
                                
                                <View/>,
                                <View/>,
                            ]}
                            */
                            separator={5}
                            reverse={true}
                            //duration = {600}
                            delay = {1800}
                            direction = {'up'}
                            numberOfLines = {1}
                            bgContainerStyle = {{width:SCREEN_WIDTH-80,backgroundColor : DEFAULT_COLOR.lecture_base,borderRadius:20}}
                            viewStyle={{paddingTop:8,alignItems:'center',justifyContent:'center'}}
                            textStyle = {{fontSize : 20,color : '#fff',}}
                            onTextClick = {(item) => {
                                alert(''+JSON.stringify(item));
                            }}
                        />            
                    </View>
                    <View style={styles.bodyWrapper}>  
                                    
                        {                     
                        filterData.length === 0 ?
                        <View style={{height:150,paddingVertical:30,alignItems:'center',justifyContent:'center'}}>
                            <Text                                                 
                                style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.body_14)}}
                            >검색 결과가 없습니다.
                            </Text>
                        </View>
                        :
                        filterData.map((data, index) => {   
                            return (
                                <View style={styles.commonWrap} key={index}>
                                    <TouchableOpacity onPress= {()=> this.goDetail(data.classIdx)}>
                                        <View style={styles.textrow}>
                                            {/*
                                            <View style={[styles.textinrow,{flexDirection:'row'}]}>
                                                <View style={[styles.commonIconWrap,{borderColor:'#ff0000'}]}>
                                                    <Text style={[styles.commonIconText,CommonStyles.fontRed]}>NEW</Text>
                                                </View>
                                                <View style={[styles.commonIconWrap]}>
                                                    <Text style={styles.commonIconText}>베스트</Text>
                                                </View>
                                                <View style={[styles.commonIconWrap]}>
                                                    <Text style={styles.commonIconText}>교재제공</Text>
                                                </View>
                                            </View>
                                            */}
                                            <View style={styles.textinrow}>
                                                <Text style={styles.LectureTitieWrapper}>
                                                    {data.title}
                                                </Text>
                                            </View>
                                            <View style={[styles.textinrow,{flexDirection:'row',flexGrow:1}]}>
                                                <Text style={styles.LectureSubInfoText}>{data.courseDays > 0 && data.courseDays + '일'}{data.lectureCount > 0 && '(' + data.lectureCount + '강)'}</Text>
                                                <Text style={styles.LectureSubInfoText}>|</Text>
                                                <Text style={styles.LectureSubInfoText}>{data.teacherName}</Text>
                                            </View>
                                            { data.discountRate > 0 ?
                                            <View style={[styles.textinrow,{flexDirection:'row'}]}>
                                                <Text style={[styles.LectureSubInfoText,{textDecorationLine:'line-through',color:DEFAULT_COLOR.base_color_ccc}]}>{CommonFuncion.currencyFormat(data.originalPrice)}원</Text>
                                                <Text style={[styles.LectureSubInfoText,{color:DEFAULT_COLOR.lecture_base}]}>{data.discountRate}%{data.discountRate > 0 && "↓"}</Text>
                                                <Text style={styles.LectureSubInfoTextBold}>{CommonFuncion.currencyFormat(data.price)}원</Text>
                                            </View>
                                            :
                                            <View style={[styles.textinrow,{flexDirection:'row'}]}>                                                
                                                <Text style={styles.LectureSubInfoTextBold}>{CommonFuncion.currencyFormat(data.price)}원</Text>
                                            </View>
                                            }
                                        </View>
                                        <ImageBackground                                    
                                            style={{flex:1,padding: 65,position: 'absolute',bottom:0,right:-10,opacity:0.9}}
                                            resizeMode='cover'
                                            //source={require('../../../assets/images/sample_woman2.png')}
                                            source={data.teacherImage ? {uri:data.teacherImage} : require('../../../assets/images/default_teacher.png')}
                                        />
                                            {/*
                                                <View style={styles.imgrow}>                                    
                                                    <Image 
                                                        //source={{uri:data.bannerurl}} 
                                                        source={require('../../../assets/images/sample_woman.png')}
                                                        style={{width:110,height:150}} resizeMode='contain' 
                                                        />
                                                </View>
                                            */}                                    
                                    </TouchableOpacity>      
                                </View>                
                            )
                        })}  
                    </View> 

                    {/* 여기서부터 검색필터 영역 */}
                    <Modal
                        onBackdropPress={this.closeModal}
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
                            <SearchFilter screenState={this.state} screenProps={this.props} />
                        </Animated.View>
                        
                    </Modal>
                    { this.state.moreLoading &&
                        <View style={{flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                            <ActivityIndicator size="large" />
                        </View>
                    }
                </View>    
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myTopFilter : state.GlabalStatus.myTopFilter,
        recommSelectData : state.GlabalStatus.recommSelectData,
        recommFilterData : state.GlabalStatus.recommFilterData,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne
    };
}


LectureListScreen.propTypes = {
    selectBook: PropTypes.object,
    topFavoriteMenu: PropTypes.bool,   
    showBottomBar: PropTypes.bool,   
    textBookFocusHeight: PropTypes.number,
    myTopFilter: PropTypes.object,
};


export default connect(mapStateToProps, null)(LectureListScreen);