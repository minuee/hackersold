import React, { Component } from 'react';
import {    
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    ActivityIndicator,
    StatusBar,
    TouchableOpacity,
    Alert,
    BackHandler
} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Icon9 from 'react-native-vector-icons/MaterialCommunityIcons';
Icon9.loadFont();
import {CheckBox} from 'react-native-elements';
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoB} from '../../Style/CustomText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');


class CartScreen extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            loading : true,
            apiLoading: false,
            checkCartList : [],
            checkeTotalSettlePrice : 0,
            checkeTotalPoint : 0,
            cartItem : [],
            isInitialCheckAll: true,
        }
        
    }

    async UNSAFE_componentWillMount() {
        this.setState({apiLoading: true});
        const isLogin = await CommonUtil.isLoginCheck();
        this.setState({apiLoading: false});
        if (isLogin === true) {
            await this.refreshTextBookInfo();
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);        
    }  

    componentDidMount() {     
        this.setState({loading:false});
    }

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보        
        
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
     
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);   
    }

    handleBackButton = () => {
        this.props.navigation.goBack(null);
        this.props.navigation.toggleDrawer();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton); 
        return true;
    };

    refreshTextBookInfo = async () => {
        const memberIdx = this.props.userToken.memberIdx;
        const aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
        const aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;    
        // console.log('response.data.aPIsDomain', aPIsDomain)
        // console.log('response.data.aPIsAuthKey', aPIsAuthKey)
        // console.log( aPIsDomain + '/v1/mypayment/'+memberIdx)
        await CommonUtil.callAPI( aPIsDomain + '/v1/mypayment/cart/'+memberIdx,{
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
                        this.failCallAPi(response.message || '장바구니 조회에 실패했습니다.')
                    } else {
                        // if ( typeof response.data.cartList !== 'undefined') {
                        if (!CommonUtil.isEmpty(response.data.cartList)) {
                            this.setState({
                                loading: false,
                                cartItem: response.data.cartList,
                            });

                            if (this.state.isInitialCheckAll) {
                                this.checkAll(true);
                                this.setState({isInitialCheckAll: false});
                            }
                        } else {
                            this.setState({
                                loading : false,
                            });
                        }
                    }

                }else{
                    this.failCallAPi('장바구니 조회에 실패했습니다.')
                }
                this.setState({loading:false})    
            })
            .catch(err => {
                console.log('CartScreen refreshTextBookInfo error => ', err);
                this.failCallAPi()
        });
    }


    failCallAPi = msg => {
        let message = msg || "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

 

    checkRemove = () => {
        Alert.alert(
            "해커스통합앱 : 장바구니",
            "선택하신 상품을 장바구니에서 삭제하시겠습니까?",
            [
                {text: '네', onPress: this.removeProcess.bind(this)},
                {text: '아니오', onPress: () => null },
            ],
            { cancelable: false }
        )  
        
    }

    removeProcess = async () => {
        if ( this.state.cartItem !== null ) {
            //this.setState({loading : true})

            let productIdxArray =  [];
            await this.state.checkCartList.forEach(function(element,index,array) {
                productIdxArray.push({
                    //productIdx : element.info.productIdx,
                    cartIdx: element.info.cartIdx
                });
            });

            const formData = new FormData();
            formData.append('memberIdx', this.props.userToken.memberIdx);
            formData.append('cartList', JSON.stringify(productIdxArray));
            
            let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
            await CommonUtil.callAPI( aPIsDomain + '/v1/mypayment/cart/remove',{
                method: 'POST', 
                headers: new Headers({
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'apiKey': aPIsAuthKey
                }), 
                    body:formData
                },10000
                ).then(response => {
                    //console.log('response', response)
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        this.setState({loading : false});
                        Toast.show( '삭제 되었습니다');
                        this.removeCartItem(productIdxArray);
                        // const alerttoast = Toast.show( '삭제 되었습니다');
                        // setTimeout(() => {
                        //     Toast.hide(alerttoast);
                        //     this.setState({
                        //         checkCartList: [],
                        //         checkeTotalSettlePrice : 0,
                        //         checkeTotalPoint : 0
                        //     })                
                        //     this.refreshTextBookInfo();
                        // }, 2000)
                    } 
                })
                .catch(err => {
                    console.log('login error => ', err);
                    this.failCallAPi()
            });
           
        } else {
            console.error('not selected')
        }
    }

    removeCartItem = async productIdxArray => {
        const newCartItem = [...this.state.cartItem];
        productIdxArray.map(item => {
            const itemIndex = newCartItem.findIndex(cart => cart.cartIdx === item.cartIdx);
            newCartItem.splice(itemIndex, 1);
        });
        await this.setState({cartItem: newCartItem, checkCartList: []});
    };

    checkAll = async(mode) => {
        console.log('checkAll : ', mode);
        if ( mode ) {
            let returnArray = await this.setAllChecked(this.state.cartItem);
            this.setState({checkCartList: Array.from(new Set(returnArray))})

            let tmpdata = this.state.cartItem;
            let tmpcheckeTotalSettlePrice = 0;
            let tmpcheckeTotalPoint = 0;
            tmpdata.map((items,idx) => {
                //items[idx].checked === false ? {...items, ...items[idx].checked = true } : items 
                this.state.cartItem[idx].checked = true;
                tmpcheckeTotalSettlePrice = parseInt(tmpcheckeTotalSettlePrice) + parseInt(items.paymentAmount);
                tmpcheckeTotalPoint = parseInt(tmpcheckeTotalPoint) + (items.productList[0] && items.productList[0].prePoint || 0) ; //point 항목이 없음
            })

            this.setState({
                cartItem: tmpdata,
                checkeTotalSettlePrice : tmpcheckeTotalSettlePrice,
                checkeTotalPoint : tmpcheckeTotalPoint
            })
        }else{
            this.setState({checkCartList: []});

            let tmpdata = this.state.cartItem;
            tmpdata.map((items,idx) => 
                //items[idx].checked === false ? {...items, ...items[idx].checked = true } : items 
                this.state.cartItem[idx].checked = false
            )

            this.setState({cartItem: tmpdata})
            
        }

    }
    setAllChecked = async(data) => {
        let selectedFilterCodeList = [];   
        await data.forEach(function(element,index,array){            
            selectedFilterCodeList.push({index:element.productIdx,info:element,productIdx:element.productIdx,cartIdx:element.cartIdx});            
        });

        return selectedFilterCodeList;
    }

    setOnceChecked = (data,mode) => {
        // console.log('data',data)
        let selectedFilterCodeList = this.state.checkCartList;                  
        if ( mode === 'remove' ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.index !== data.productIdx);        
        }else{ //추가
            selectedFilterCodeList.push({index:data.productIdx,info:data,productIdx:data.productIdx,cartIdx:data.cartIdx});
        }
        return selectedFilterCodeList;
    }
    
    _checkCartList = async(index,data,mode) =>{
        let returnArray = await this.setOnceChecked(data,mode);        
        
        let tmpcheckeTotalSettlePrice = 0;
        let tmpcheckeTotalPoint = 0;
        returnArray.map((items,idx) => {
            tmpcheckeTotalSettlePrice = parseInt(tmpcheckeTotalSettlePrice) + parseInt(items.info.paymentAmount);
            tmpcheckeTotalPoint = parseInt(tmpcheckeTotalPoint) + (items.info.productList[0] && items.info.productList[0].prePoint || 0); ///point 수정필요
        })

        this.state.cartItem[index].checked = !data.checked;
        this.setState({
            checkCartList: Array.from(new Set(returnArray)),
            checkeTotalSettlePrice : tmpcheckeTotalSettlePrice,
            checkeTotalPoint : tmpcheckeTotalPoint
        })
        
        //console.log('this.checkCartList',this.state.checkCartList)
    }

    // 주문번호 생성 
    requestOrderNo = async() => {        
       
        // console.log('this.state.checkCartList', this.state.checkCartList)
        let productIdxArray =  [];
        await this.state.checkCartList.forEach(function(element,index,array){
            if (typeof element.info.productList === 'undefined' || element.info.productList.length === 0) {
                element.info.productList = [];
                element.info.productList.push({
                        title: element.info.productName,
                        price: element.info.price,
                        productType: 'Lecture',
                        productIdx: element.info.productIdx,
                        prePoint: 0,
                        freeOptionList: []
                });
            }

            productIdxArray.push({
                memberProductIdx : 0,
                extendsDay : 0,
                optionList : !CommonUtil.isEmpty(element.info.productList[0]) && element.info.productList[0].optionList || [],
                productIdx : element.info.productIdx,
                productType : '',
                eventcode : ''
            });
        });

        let productDataArray =  [];
        await this.state.checkCartList.forEach(function(element,index,array){
            if (typeof element.info.productList === 'undefined' || element.info.productList.length === 0) {
                element.info.productList = [];
                element.info.productList.push({
                        title: element.info.productName,
                        price: element.info.price,
                        productType: 'Lecture',
                        productIdx: element.info.productIdx,
                        prePoint: 0,
                        freeOptionList: []
                });
            }

            productDataArray.push({
                memberProductIdx : 0,
                extendsDay : 0,
                optionList : !CommonUtil.isEmpty(element.info.productList[0]) && element.info.productList[0].optionList || [],
                freeOptionList : !CommonUtil.isEmpty(element.info.productList[0]) && element.info.productList[0].freeOptionList || [],
                productData : element.info.productList,
                basePrice : element.info.price,
                discountAmount : element.info.discountAmount,
                paymentAmount : element.info.paymentAmount,
                productType : '',
                eventcode : ''
            });
        });

        const memberIdx = this.props.userToken.memberIdx;
        const formData = new FormData();
        formData.append('orderType', "lecture");
        formData.append('memberIdx', memberIdx);
        formData.append('paymentStatus', 1); //안씀
        formData.append('productList', productIdxArray.length > 0 ? JSON.stringify(productIdxArray) : '' );
        //formData.append('memberProductIdx', 0)//this.state.lectureInfo.memberProductIdx);
        //formData.append('selectedOption', []);//this.state.optionList.length > 0 ? JSON.stringify(this.state.optionList) : null );
        //formData.append('paymentMethod', "");
        //formData.append('productType', "");
        //formData.append('eventCode', "");
        //console.log('productDataArray',productDataArray)
        let aPIsDomain = typeof this.props.myInterestCodeOne.info.apiDomain !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info.apiKey !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
        await CommonUtil.callAPI( aPIsDomain + '/v1/payment/orderNo/' + memberIdx,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'apiKey': aPIsAuthKey
        }), 
            body:formData
        },10000
        ).then(response => {
            
            if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                if ( response.code !== '0000' ) {
                    this.failCallAPi();
                }else{
                    if ( response.data.orderNo ) {

                        this.props.navigation.navigate('LectureSettleInputScreen',{
                            //lectureIdx : tis.state.lectureIdx,
                            //lectureInfo : this.state.lectureInfo,
                            productType : 'lecture',
                            productList　: productDataArray,
                            checkCartList : this.state.checkCartList,
                            optionSumPrice : 0,
                            isDeliveryPrice : 0,
                            orderNo :  response.data.orderNo
                        })
                        
                    }else{
                        let message = "일시적 오류가 발생하였습니다.\n 잠시후 이용해 주세요";
                        let timesecond = 2000;
                        CommonFuncion.fn_call_toast(message,timesecond);
                    }
                }
            }else{
                this.failCallAPi2()
            }
        })
        .catch(err => {
            console.log('login error222 => ', err);
            this.failCallAPi()
        });
        
    };

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {
            return(
                <View style={ styles.container }>
                    { Platform.OS == 'android' && <StatusBar backgroundColor={DEFAULT_COLOR.lecture_base} translucent={false}  barStyle="dark-content" />}
                    <View style={{flexDirection:'row',height:50,borderBottomWidth:1,borderBottomColor:DEFAULT_COLOR.base_color_ccc}}>
                        <View style={{flex:1,paddingHorizontal:20}}>
                            {this.state.checkCartList.length > 0 
                            ?
                            <TouchableOpacity 
                                onPress={() => this.checkAll(false)}
                                style={{flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-start',alignItems:'center'}}
                            >       
                                <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-0.7}}>
                                    {"  "}선택해제
                                </CustomTextR>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity 
                                onPress={() => this.checkAll(true)}
                                style={{flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-start',alignItems:'center'}}
                            >
                                <Icon name="check" size={15} color={DEFAULT_COLOR.lecture_base} /> 
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-0.7,justifyContent:'flex-start',alignItems:'flex-start'}}>{"  "}전체선택</CustomTextR>
                            </TouchableOpacity>
                            }                            
                        </View>
                        <View style={{flex:1,paddingHorizontal:20,alignItems:'flex-end'}}>
                            {this.state.checkCartList.length > 0 
                            &&
                            <TouchableOpacity 
                                onPress={() => this.checkRemove()}
                                style={{flex:1,flexDirection:'row',flexGrow:1,justifyContent:'flex-start',alignItems:'center'}}
                            >       
                                <Icon name="delete" size={15} color={DEFAULT_COLOR.base_color_222} /> 
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-0.7}}>
                                    {"  "}선택삭제
                                </CustomTextR>
                            </TouchableOpacity>
                            }
                        </View>                        
                    </View>
                    <ScrollView>
                        <View style={{marginBottom:150}}>

                            <View>
                                {this.state.cartItem.length > 0
                                ?
                                this.state.cartItem.map((item,index) => {
                                    
                                    let isIndexOf = this.state.checkCartList.findIndex(
                                        info => info.index === item.productIdx
                                    );  
                                    let bgColor = isIndexOf != -1 ?  '#f5f7f8': '#fff' ;
                                    return (
                                        <View style={[styles.itemWrap,{backgroundColor:bgColor}]} key={index}>  
                                            <View style={{paddingTop:15,paddingLeft:15}}>
                                                <TouchableOpacity 
                                                    onPress= {()=> this._checkCartList(index,item,isIndexOf != -1 ? 'remove' : null)}
                                                    style={{flex:1,alignItems:'center',borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}
                                                >
                                                    <CheckBox 
                                                        containerStyle={{padding:0,margin:0}}   
                                                        iconType='font-awesome'
                                                        checkedIcon='check-circle'
                                                        uncheckedIcon='circle-o'
                                                        checkedColor={DEFAULT_COLOR.lecture_base}
                                                        uncheckedColor={DEFAULT_COLOR.base_color_ccc}
                                                        onPress= {()=> this._checkCartList(index,item,isIndexOf != -1 ? 'remove' : null)}
                                                        checked={item.checked}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:5,marginRight:15,borderBottomColor:DEFAULT_COLOR.input_border_color,borderBottomWidth:1}}>
                                                <View style={{paddingTop:15,paddingRight:10}}>
                                                    <CustomTextR                                                
                                                        style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14),letterSpacing:-0.7,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}
                                                    >{item.productName}
                                                    </CustomTextR>
                                                </View>
                                                <View style={{paddingVertical:5,marginBottom:5,paddingRight:10}}>
                                                    {
                                                        
                                                        //typeof item.productList[0].freeOptionList !== 'undefined' && 
                                                        item.productList[0] && item.productList[0].freeOptionList &&
                                                        item.productList[0].freeOptionList.map((item2,index2) => {
                                                            return (
                                                                <View key={index2} style={{paddingVertical:5}}>
                                                                    <CustomTextR
                                                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}
                                                                    >{item2.title}
                                                                    </CustomTextR>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        //console.log('item.productList',item.productList)
                                                        //typeof item.productList[0].optionList !== 'undefined' && 
                                                        item.productList[0] && item.productList[0].optionList &&
                                                        item.productList[0].optionList.map((item2,index2) => {
                                                            return (
                                                                <View key={index2} style={{paddingVertical:5}}>
                                                                    <CustomTextR
                                                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize12),letterSpacing:-0.6,lineHeight:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}
                                                                    >{item2.title}
                                                                    </CustomTextR>
                                                                </View>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                <View style={{borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,paddingVertical:5,paddingRight:10}}>
                                                    <View style={{flexDirection:'row',paddingVertical:5}}>
                                                        <View style={{flex:1}} >
                                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{"• "}상품 금액</CustomTextR>
                                                        </View> 
                                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                                            <TextRobotoM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{CommonFuncion.currencyFormat(item.price)}원</TextRobotoM>
                                                        </View>                
                                                    </View>
                                                    <View style={{flexDirection:'row',paddingVertical:5}}>
                                                        <View style={{flex:1}} >
                                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{"• "}할인 금액</CustomTextR>
                                                        </View> 
                                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                                            <TextRobotoM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>-{CommonFuncion.currencyFormat(item.discountAmount)}원</TextRobotoM>
                                                        </View>                
                                                    </View>
                                                    <View style={{flexDirection:'row',paddingVertical:5}}>
                                                        <View style={{flex:1}} >
                                                            <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{"• "}결제 금액</CustomTextR>
                                                        </View> 
                                                        <View style={{flex:1,alignItems:'flex-end'}} >
                                                            <TextRobotoM style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{CommonFuncion.currencyFormat(item.paymentAmount)}원</TextRobotoM>
                                                        </View>                
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                                :
                                <View style={[{marginHorizontal:10,borderBottomWidth:1,borderBottomColor:'#ccc',marginVertical:10,paddingVertical:10,alignItems:'center'}]}>
                                    <CustomTextR                                                 
                                        style={{color:DEFAULT_COLOR.base_color_666,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize14)}}
                                    >진행 이력이 없습니다.
                                    </CustomTextR>
                                </View>
                            }  
                            </View>
                        </View>
                    </ScrollView>
                    { 
                    this.state.checkCartList.length > 0 &&
                        <View                    
                            style={{zIndex:3,position:'absolute',left:0,bottom:0,minHeight:Platform.OS === 'android' ? 50 :  CommonFuncion.isIphoneX() ? 70 : 50,width:SCREEN_WIDTH,backgroundColor:DEFAULT_COLOR.lecture_base,borderTopColor:DEFAULT_COLOR.input_border_color,borderTopWidth:1,justifyContent:'center',alignItems:'center',}}
                        >
                            
                            <View style={{flex:1,backgroundColor:DEFAULT_COLOR.lecture_base,justifyContent:'center',alignItems:'center',paddingVertical:15}}>
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_fff,letterSpacing:-1}}>최종 결제금액 = <TextRobotoB>{CommonFuncion.currencyFormat(this.state.checkeTotalSettlePrice)}</TextRobotoB>원</CustomTextM>                            
                            </View>
                            <View style={{height:1,backgroundColor:DEFAULT_COLOR.base_color_fff,paddingHorizontal:15,width:SCREEN_WIDTH*0.8}}></View>
                            <View style={{flex:1,flexDirection:'row',backgroundColor:DEFAULT_COLOR.lecture_base,justifyContent:'center',alignItems:'center',paddingVertical:10}}>
                                <CustomTextM style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize20),color:DEFAULT_COLOR.base_color_fff,letterSpacing:-1}}>예상적립포인트{' '}</CustomTextM>
                                <Icon9 name='alpha-p-circle' size={PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium)} color='#fff' />
                                <TextRobotoB style={{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),color:DEFAULT_COLOR.base_color_fff}}> {CommonFuncion.currencyFormat(this.state.checkeTotalPoint)}</TextRobotoB>
                            </View>
                            
                            <View style={{flex:1,backgroundColor:DEFAULT_COLOR.base_color_222,width:SCREEN_WIDTH,paddingBottom:Platform.OS === 'ios' ? 5 : 0}}>

                                <TouchableOpacity 
                                    onPress={()=>this.requestOrderNo()}
                                    style={{flex:1,justifyContent:'center',alignItems:'center'}}
                                >
                                    <CustomTextM style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18),letterSpacing:-0.9,paddingVertical:10}}>선택 상품 주문하기</CustomTextM>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
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
    itemWrap : {        
        flexDirection:'row',     
        
    },

    resultGoodsBodyResultWrapper : {
        backgroundColor:DEFAULT_COLOR.lecture_base
    },
    resultGoodsBodyResultHeader : {
        flex:1,alignItems:'center',justifyContent:'center',borderBottomColor:'#fff',borderBottomWidth:1
    },
    resultGoodsBodyResultHeaderText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:'#fff',fontWeight:'bold'
    },
    resultGoodsBodyResultFooter : {
        flex:1,flexDirection:'row',paddingVertical:10,alignItems:'center',justifyContent:'center'
    },
    resultGoodsBodyResultFooterText : {
        fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_medium),color:'#fff',fontWeight:'bold'
    },
   
    
});

function mapStateToProps(state) {
    return {
        myInterestCodeOne : state.GlabalStatus.myInterestCodeOne,
        userToken : state.GlabalStatus.userToken,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusNowScrollY:(number) => {
            dispatch(ActionCreator.updateStatusNowScrollY(number));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);
