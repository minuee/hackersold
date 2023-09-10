import React from 'react';
import {PixelRatio, Text, ScrollView,RefreshControl,View, Image,TouchableOpacity,Dimensions,Platform,ActivityIndicator,Animated,Alert, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import Modal from 'react-native-modal';
import Icon2 from 'react-native-vector-icons/AntDesign';
Icon2.loadFont();
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';
import LinearGradient from 'react-native-linear-gradient';

const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import styles from '../../Style/TextBook/IntroScreen';
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

import SearchFilter from './SearchFilter';

const pageViewLimit = 12;

const gradientColor = ['#000','#333','transparent' ];
const gradientStart = {x: 0, y: 1} 
const gradientEnd = {x: 0, y: 0.6}
class IntroScreen extends React.Component {

    constructor(props) {
        super(props);        
        this.state = {
            loading : true,
            refreshing: false,
            ischange : false,
            moreLoading : false,
            moreLoading2 : false,
            currentpage : 1,
            ismore : false,   
            showModal : false,
            selectedFilterCodeList : [],
            _showModal : this._showModal.bind(this),
            _closeModal : this._closeModal.bind(this),
            showTopButton : false,
            loading : false,
            thisFocus : this.props.screenState.nowFocus,
            focusTab : this.props.screenState.focusTab,
            selectItem : 0,
            showItem : 2,
            showType : 'list',
            items : [],
            myInterestCodeOne : this.props.myInterestCodeOne
           
        }   
            
    }

    async UNSAFE_componentWillMount() {        
        await setTimeout(() => { 
            this.refreshTextBookInfo(1);
         }, 200)
    } 

    componentDidMount() {        
       
    }

    UNSAFE_componentWillUnmount() {
        
    }  
    
    componentDidUpdate(prevProps, prevState) {

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log('nextProps.myInterestCodeOne.code textbook2',nextProps.myInterestCodeOne.code )
        //console.log('this.state. textbook2',this.state.myInterestCodeOne.code )
        
        if ( nextProps.screenState.focusTab !== this.props.screenState.focusTab ) {
            this.upButtonHandler();
        }
        /*
        if ( nextProps.myInterestCodeOne.code !== this.state.myInterestCodeOne.code ) {
            if ( this.state.ischange === false ) {
                this._onRefresh2()
            }
        }
        */
    }

    
  
    shouldComponentUpdate(nextProps, nextState) {
        
        //console.log('nextState.myInterestCodeOne.code textbook',nextState.myInterestCodeOne.code )
        //console.log('nextProps.props.myInterestCodeOne.code textbook',nextProps.myInterestCodeOne.code )        
        if ( nextProps.myInterestCodeOne.code !== this.props.myInterestCodeOne.code) {
            if ( this.state.ischange === false ) {
                this._onRefresh2()
            }
        }        
        return true;
    }

    _onRefresh2 = async() => {
        
        await this.setState({
            loading: true,
            ischange : true,
            items : []
        });   
        let sendData2 = [];      
        await this.props._updatetextbookFilterData(sendData2);
        await this.props._updatetextbookSelectData(sendData2);
        await this.refreshTextBookInfo(1)
        setTimeout(
            () => {
                this.setState({ loading: false});
        },500)
    }

    _onRefresh = () => {        
        this.setState({
            refreshing: true,
            items : []
        }, function() {
            this.refreshTextBookInfo(1)
        });

        setTimeout(
            () => {
                this.setState({ refreshing: false});
        },500)
    }
    

    refreshTextBookInfo = async(page) => {    
        
        let selectedFilterCodeList = [];   
        if ( page === 1 ) {
            selectedFilterCodeList = [];   
        }else{
            selectedFilterCodeList = this.state.items;   
        }
        let checkArray1 = [];
        let checkArray2 = [];
        let checkArray3 = [];
        let checkArray4 = [];
        if ( typeof this.props.textbookSelectData !== 'undefined' && this.props.textbookSelectData.length > 0 ) {
            
            let groupedType = await CommonFuncion.groupBy(this.props.textbookSelectData, 'type');
            
            if ( typeof groupedType[1] !== 'undefined' ) {
                groupedType[1].map((data1) => {
                    return checkArray1.push(data1.code)
                })
            }
            /*
            if ( typeof groupedType[2] !== 'undefined' ) {
                groupedType[2].map((data2) => {
                    return checkArray2.push(data2.code)
                })
            }
            */
            if ( typeof groupedType[3] !== 'undefined' ) {                    
                groupedType[3].map((data3) => {
                    return checkArray3.push(data3.code)
                })
            }
            /*
            if ( typeof groupedType[4] !== 'undefined' ) {
                groupedType[4].map((data4) => {
                    return checkArray4.push(data4.code)
                })
            }
            */
        }

        const formData = new FormData();
        formData.append('page', page);
        formData.append('paginate', pageViewLimit);
        formData.append('level03', checkArray1.length > 0 ? JSON.stringify(checkArray1) : '');
        //formData.append('level04', checkArray2.length > 0 ? JSON.stringify(checkArray2) : '');
        formData.append('difficulty', checkArray3.length > 0 ? JSON.stringify(checkArray3) : '');
        //formData.append('teacher', checkArray4.length > 0 ? JSON.stringify(checkArray4) : '');
        //console.log('formData',formData)
        
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;      
       
        await CommonUtil.callAPI( aPIsDomain + '/v1/book',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:formData
            },10000
            ).then(response => {

                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{                        
                        if ( typeof response.data.books !== 'undefined') {                            
                            this.moreDataUpdate(selectedFilterCodeList,response.data )
                        }
                        
                        /*
                        if ( typeof response.data.books !== 'undefined') {
                            this.setState({
                                loading : false,
                                items:response.data.books,
                                ismore : response.data.currentPage < response.data.lastPage ? true : false,
                                currentpage : response.data.currentPage,
                            })
                        }else{
                            this.setState({loading : false,})
                        }
                        */
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

    moreDataUpdate = async( baseData , addData) => {     
        
        await addData.books.forEach(function(element,index,array){                                
            baseData.push(element);
        });    
        this.setState({            
            moreLoading : false,
            loading : false,
            ischange : false,
            items : baseData,
            ismore : addData.currentPage < addData.lastPage ? true : false,
            currentpage : addData.currentPage,
        })
    }


    failCallAPi = () => {
        const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast); 
            this.setState({loading:false})    
        }, 2000)
    }

    goDetail = async(idx,bookidx) => {               
        
        this.props.screennavigation1.navigate('TextBookDetail',{
            bookIdx : bookidx,//this.props.myInterestCodeOne.info.serviceID == '3090' ? 2 : bookidx,// 2,77,75
            bannerurl : this.state.items[idx].image
        });
    }

    changeViewType = async() => {
        if ( this.state.showType === 'list') {
            this.setState({
                showType :'grid'
            })
        }else{
            this.setState({
                showType :'list'
            })
        }
    }

    handleOnScroll = async(event) => {     
        this.props._updateStatusNowScrollY(event.nativeEvent.contentOffset.y);     
        this.props.screenProps.resizeTopHeader(event.nativeEvent.contentOffset.y)
        if ( event.nativeEvent.contentOffset.y >= 200 ) {
            this.props._updateStatusShowBottomBar(true);                 
        }else{            
            this.props._updateStatusShowBottomBar(false);
         }

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;                            
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {            
            this.scrollEndReach();
        }
    }

    scrollEndReach = () => {
        if ( this.state.moreLoading === false && this.state.ismore) {        
            this.setState({moreLoading : true})   
            setTimeout(
                () => {
                    if ( this.state.moreLoading ) {
                        this.refreshTextBookInfo(parseInt(this.state.currentpage)+parseInt(1))
                    }
                },500
            )
            
        }
    }

    loadMoreData = async(code) => {
        //console.log("code", code);
        //console.log("code contentOffset", code.contentOffset);
    }

    upButtonHandler = async() => {      
        try {  
            this.ScrollView.scrollTo({ x: 0,  animated: true });
        }catch(e){

        }
    };

    _closeModal = (bool) => {
        
        if ( bool) {            
            this.refreshTextBookInfo(1);
        }
        this.setState({ showModal: false })
       
    };
    _showModal = async() => {                
        this.setState({ showModal: true })
        
    }

    animatedHeight = new Animated.Value(SCREEN_HEIGHT * 0.9);

    setupClearFilter = async() => {
        let sendData = {
            'filter1' : this.props.myTopFilter.filter1,
            'filter2' : [],
            'filter4' : this.props.myTopFilter.filter4
        }
        let sendData2 = [];
        //this.props._updatemyTopFilter(sendData);
        this.props._updatetextbookSelectData(sendData2)
        await this._onRefresh()
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
         }else {

            //console.log('selectedFilterCodeList',this.props.myTopFilter.filter2);
            let filterData = this.state.items;
            
            //if ( typeof this.props.textbookSelectData !== 'undefined' && this.props.textbookSelectData.length > 0 ) {
                /*
                groupedType = CommonFuncion.groupBy(this.props.textbookSelectData, 'type');      
                //console.log('groupedType22', groupedType)          
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
                */
            //}

            return (
                <View style={styles.container}>
                 
                    { this.props.showBottomBar &&
                        <TouchableOpacity 
                            style={this.state.showType === 'list' ? styles.btnGoTopWrap :styles.btnGoTopWrap2}
                            onPress={e => this.upButtonHandler()}
                        >
                            <Icon2 name="up" size={30} color="#000" />
                        </TouchableOpacity>
                    }
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
                            <SearchFilter
                                screenState={this.state}
                                screenProps={this.props}
                            />
                        </Animated.View>
                        
                    </Modal>
                    <ScrollView
                        ref={(ref) => {
                            this.ScrollView = ref;
                        }}
                        indicatorStyle={'white'}
                        scrollEventThrottle={16}
                        keyboardDismissMode={'on-drag'}
                        onScroll={e => this.handleOnScroll(e)}
                        onMomentumScrollEnd = {({nativeEvent}) => { 
                         //this.loadMoreData (nativeEvent) 
                        }}
                        onScrollEndDrag ={({nativeEvent}) => { 
                            //this.loadMoreData (nativeEvent) 
                        }}

                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={this._onRefresh}
                            />
                        }
                    >

                    
                        <View style={styles.searchWrapper}>
                            <View style={[styles.filterWrapper]}>
                                <View style={[
                                    styles.filterWakuWrapperLeft,
                                    {
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        paddingTop: 0,
                                        paddingHorizontal: 5,
                                    }
                                ]}>
                                    <ScrollView         
                                        style={{
                                            paddingVertical: 10,
                                            marginRight: 5,
                                        }}
                                        horizontal={true}>
                                            { typeof this.props.textbookSelectData !== 'undefined' && this.props.textbookSelectData.length > 0
                                            ?
                                                this.props.textbookSelectData.map((fdata,index3) => {
                                                    return (
                                                        <CustomTextR style={{
                                                            color: DEFAULT_COLOR.lecture_base,
                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),
                                                            lineHeight: PixelRatio.roundToNearestPixel(7.1),
                                                            letterSpacing: -0.65,
                                                            paddingRight: this.props.textbookSelectData.length - 1 == index3 ? 5 : 20
                                                        }} key={index3}>
                                                            {fdata.name}
                                                        </CustomTextR>
                                                    )
                                                })
                                                :
                                                <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13),paddingRight:5}}>전체항목</CustomTextR>
                                            }
                                    </ScrollView>
                                    {
                                        (
                                            typeof this.props.textbookSelectData !== 'undefined'
                                            && this.props.textbookSelectData.length > 0
                                        ) &&
                                            <TouchableOpacity
                                                style={{
                                                    justifyContent: 'center',
                                                }}
                                                onPress={() => this.setupClearFilter()}
                                                >
                                                <Image
                                                    style={{width: 25, height: 25,}}
                                                    source={require('../../../assets/icons/btn_del_keyword_all.png')}/>
                                            </TouchableOpacity>
                                    }

                                </View>
                                <View style={styles.filterWakuWrapperRight}>
                                    <TouchableOpacity 
                                        style={{
                                            //paddingVertical: 5,
                                            //paddingHorizontal: 10,
                                            padding:5,
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: DEFAULT_COLOR.base_color_ccc,
                                            borderRadius: 5
                                        }}
                                        onPress={()=>this._showModal()}
                                    >
                                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_444,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-1.5}}>필터</CustomTextR>
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    borderLeftColor: '#ccc',
                                    borderLeftWidth: 1,
                                    marginLeft: 10,
                                    marginRight: 5,
                                    paddingVertical: 10
                                }}>
                                    <View style={{width:1,backgroundColor:'#ccc'}} />
                                </View>
                                <TouchableOpacity  style={{flex:0.5,alignItems:'center'}} onPress= {()=> this.changeViewType()}>
                                    { this.state.showType === 'list' ?
                                       <Image source={require('../../../assets/icons/btn_view_thumb.png')} resizeMode="contain" 
                                            style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                        />
                                    :
                                        <Image source={require('../../../assets/icons/btn_view_list.png')} resizeMode="contain" 
                                            style={{width:PixelRatio.roundToNearestPixel(55),height:PixelRatio.roundToNearestPixel(55)}}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.listWrapper}>

                        {                     
                            this.state.showType === 'grid' ?
                            <View  style={{flexDirection:'row',flexWrap:'wrap'}}>
                                { 
                                this.state.items.length === 0 
                                ?
                                <View style={{marginVertical:10,paddingVertical:10,alignItems:'center',width:'100%'}}>
                                    <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>검색 결과가 없습니다.
                                    </CustomTextR>
                                </View>
                                :
                                this.state.items.map((data, index) => {  
                                    
                                    let nextIndex = (index+1)%12 === 11 ? index+1 : index+2;                                     
                                    {
                                        //console.log('index ' , index+1, 'bookIdx', data.bookIdx, '(index+1)%6', (index+1)%6, 'nextIndex',nextIndex);
                                     }
                                     if ( (index+1)%6 > 0 && (index+1)%6 != 6 ) {                                         
                                        return (
                                            ( (index+1)%12 === 4 ||  (index+1)%12 === 11)  ?
                                            <View key={index}>
                                                <TouchableOpacity 
                                                    style={{width:SCREEN_WIDTH/3,borderWidth:2,borderColor:'#222'}}
                                                    onPress= {()=> this.goDetail(index,data.bookIdx)}
                                                    >                                                         
                                                    <ImageBackground
                                                        source={{uri:data.image}} 
                                                        style={{width:SCREEN_WIDTH/3-4,height:(SCREEN_WIDTH/3)*4/3}}
                                                        resizeMode='cover'
                                                    >                                                    
                                                        <LinearGradient 
                                                            colors={gradientColor} 
                                                            style={styles.linearGradient} 
                                                            start={gradientStart} 
                                                            end={gradientEnd}
                                                            //locations={[0.8,0.4,0]}
                                                        />
                                                    </ImageBackground>
                                                </TouchableOpacity>
                                                { this.state.items[nextIndex].bookIdx  && 
                                                <TouchableOpacity 
                                                    style={{width:SCREEN_WIDTH/3,borderWidth:2,borderColor:'#222'}} 
                                                    onPress= {()=> this.goDetail(nextIndex,this.state.items[nextIndex].bookIdx)}
                                                >   
                                                    {/*    
                                                    <Text>{nextIndex+1}_2_{this.state.items[nextIndex].bookIdx}_{(index+1)%12}</Text>
                                                    */}                                 
                                                    <ImageBackground
                                                        source={{uri:this.state.items[nextIndex].image}} 
                                                        style={{width:SCREEN_WIDTH/3-4,height:(SCREEN_WIDTH/3)*4/3}}
                                                        resizeMode='cover'
                                                    >                                                    
                                                        <LinearGradient 
                                                            colors={gradientColor} 
                                                            style={styles.linearGradient} 
                                                            start={gradientStart} 
                                                            end={gradientEnd}
                                                            //locations={[0.8,0.4,0]}
                                                        />
                                                    </ImageBackground>
                                                </TouchableOpacity>
                                                }
                                            </View>
                                            :
                                            ( (index+1)%12 === 5 || (index+1)%12 === 10 )?
                                            <TouchableOpacity 
                                                style={{width:SCREEN_WIDTH/3*2,borderWidth:2,borderColor:'#222'}}
                                                key={index}
                                                onPress= {()=> this.goDetail(index,data.bookIdx)}
                                                >    
                                                {/* 
                                                <Text>{index+1}_3_{data.bookIdx}_{(index+1)%12}</Text>
                                                */}                                      
                                                <ImageBackground
                                                    source={{uri: data.image}} 
                                                    style={{width:SCREEN_WIDTH/3*2-4,height:(SCREEN_WIDTH/3*2+3)*4/3}}
                                                    resizeMode='cover'
                                                >
                                                    <LinearGradient 
                                                        colors={gradientColor}  
                                                        style={styles.linearGradient} 
                                                        start={gradientStart} 
                                                        end={gradientEnd}
                                                    //locations={[0.8,0.4,0]}
                                                />
                                                </ImageBackground>
                                                
                                            </TouchableOpacity>
                                            :                                            
                                            <TouchableOpacity 
                                                style={{width:SCREEN_WIDTH/3,borderWidth:2,borderColor:'#222'}}
                                                key={index}
                                                onPress= {()=> this.goDetail(index,data.bookIdx)}
                                                >                                                 
                                                
                                                {/*  
                                                <Text>{index+1}_4_{data.bookIdx}_{(index+1)%12}</Text>
                                                */}                                    
                                                <ImageBackground
                                                    source={{uri:data.image}} 
                                                    style={{width:SCREEN_WIDTH/3-4,height:(SCREEN_WIDTH/3)*4/3}}
                                                    resizeMode='cover'
                                                >                                                
                                                    <LinearGradient 
                                                        colors={gradientColor} 
                                                        style={styles.linearGradient} 
                                                        start={gradientStart} 
                                                        end={gradientEnd}
                                                        //locations={[0.8,0.4,0]}
                                                    />
                                                </ImageBackground>
                                            </TouchableOpacity>                      
                                            
                                        )
                                    }else{
                                        
                                    }
                                    
                                })
                                }
                            </View>                        
                            :
                            this.state.items.length === 0 
                            ?
                            <View style={{marginHorizontal:10,marginVertical:10,paddingVertical:10,alignItems:'center'}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>검색 결과가 없습니다.
                                </CustomTextR>
                            </View>
                            :
                            this.state.items.map((data, index) => {   
                                return (
                                    <TouchableOpacity 
                                        style={styles.commoneWrap} key={index}
                                        onPress= {()=> this.goDetail(index,data.bookIdx)}
                                        >
                                        <View style={styles.bgWrapper}>
                                            <View style={styles.bookimagewrap}>
                                                <Image
                                                    source={{uri:data.image}} 
                                                    style={styles.bookimage}
                                                    resizeMode='cover'
                                                />
                                            </View>
                                            <View style={styles.informationWrapper}>
                                                <View style={{flex:3}}> 
                                                    <CustomTextM
                                                        style={{
                                                            color:DEFAULT_COLOR.base_color_222,
                                                            fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
                                                            lineHeight: PixelRatio.roundToNearestPixel(22),
                                                            letterSpacing: -0.8,
                                                        }}
                                                        numberOfLines={3} ellipsizeMode='tail'
                                                    >
                                                        {data.title}
                                                    </CustomTextM>
                                                    {/*
                                                    <CustomTextR 
                                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}
                                                        numberOfLines={2} ellipsizeMode='tail'
                                                    >                                                        
                                                        {data.desc}
                                                    </CustomTextR>
                                                    */}
                                                </View>
                                                <View style={styles.bookOptionWrapper}>
                                                    { 
                                                        data.isPaidMP3 ?
                                                        <View style={styles.bookOption1Wrap}>
                                                            <Image
                                                            source={require('../../../assets/icons/icon_mp_3_study.png')}
                                                            style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}
                                                            resizeMode='contain'
                                                            />
                                                            <CustomTextR  style={{marginTop:-2,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:-0.55}}> 문제풀이MP3</CustomTextR>
                                                        </View>
                                                        :
                                                        <View style={styles.bookOption1Wrap}></View>
                                                    }
                                                    {
                                                    data.isFreeMP3 ?
                                                    <View style={styles.bookOption2Wrap}>
                                                        <Image
                                                        source={require('../../../assets/icons/icon_mp_3_free.png')}
                                                        style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}
                                                        resizeMode='contain'
                                                        />
                                                        <CustomTextR  style={{marginTop:-2,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:-0.55}}> 무료MP3</CustomTextR>
                                                    </View>
                                                    :
                                                    <View style={styles.bookOption2Wrap}></View>
                                                    }
                                                    {
                                                    data.isFreeMP3 ?
                                                    <View style={styles.bookOption3Wrap}>
                                                        <Image
                                                        source={require('../../../assets/icons/icon_datafree.png')}
                                                        style={{width:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),height:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11)}}
                                                        resizeMode='contain'
                                                        />
                                                        <CustomTextR  style={{marginTop:-2,color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize11),letterSpacing:-0.55}}> 무료자료</CustomTextR>
                                                    </View>
                                                    :
                                                    <View style={styles.bookOption3Wrap}></View>
                                                    }

                                                </View>
                                            </View>

                                            
                                        </View>                                                           
                                    </TouchableOpacity>                      
                                )
                            })

                            }  

                            { this.state.moreLoading &&
                            <View style={{flex:1,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
                                <ActivityIndicator size="large" />
                            </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        nowScrollY: state.GlabalStatus.nowScrollY,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        myTopFilter : state.GlabalStatus.myTopFilter,
        textbookSelectData : state.GlabalStatus.textbookSelectData,
        textbookFilterData : state.GlabalStatus.textbookFilterData,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        },
         _updatemyTopFilter:(object) => {
            dispatch(ActionCreator.updatemyTopFilter(object));
        },
        _updatetextbookFilterData:(object) => {
            dispatch(ActionCreator.updatetextbookFilterData(object));
        },
        _updatetextbookSelectData:(object) => {
            dispatch(ActionCreator.updatetextbookSelectData(object));
        }
    };
}

IntroScreen.propTypes = {
    selectBook: PropTypes.object,
    topFavoriteMenu: PropTypes.bool,   
    showBottomBar: PropTypes.bool,   
    myTopFilter: PropTypes.object,
    nowScrollY: PropTypes.number,
};


export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen);