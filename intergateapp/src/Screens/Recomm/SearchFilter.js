import React, { Component } from 'react';
import {PixelRatio, Dimensions, Text, TouchableOpacity, View,StyleSheet,ScrollView,Platform,ActivityIndicator,Alert} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ActionCreator from '../../Ducks/Actions/MainActions';

import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import {CustomTextR, CustomTextB, CustomTextM, TextRobotoM,TextRobotoR} from '../../Style/CustomText';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const smartFinderCode = DEFAULT_CONSTANTS.smartFinderLectureCode;

class SearchFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {       
            loading : true,
            attentionSelectCode : null,    
            listlevel03 : [],
            listlevel04 : [],
            listdifficulty : [],
            listteachers : [],            
            selectedFilterCodeList : [],
            isSetupFilter: false,
        }
    }

    async UNSAFE_componentWillMount() {
        if ( typeof this.props.screenProps.recommFilterData !== 'undefined' ) {
            if ( typeof this.props.screenProps.recommFilterData.listlevel03 !== 'undefined') {
                
                this.setState({
                    loading : false,
                    listlevel03: this.props.screenProps.recommFilterData.listlevel03,
                    listlevel04: this.props.screenProps.recommFilterData.listlevel04,
                    listdifficulty: this.props.screenProps.recommFilterData.listdifficulty,
                    listteachers: this.props.screenProps.recommFilterData.listteachers,
                })
            }else{
                await this.refreshTextBookInfo();
            }
        }else{ 
            await this.refreshTextBookInfo();
        }

        if ( typeof this.props.recommSelectData !== 'undefined' && this.props.recommSelectData.length > 0 ) {
            this.setState({
                selectedFilterCodeList: this.props.screenProps.recommSelectData
            })
        }
    }  

    componentDidUpdate(prevProps, prevState) { // 이전 props, state에 대한 정보 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    componentWillUnmount(){
        
    }

    refreshTextBookInfo = async() => {
        
        /*
        let url = 'http://tchamp.hackers.com/v1/meta/smartfinder';
        let options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: null
                };
        let response = await axios(options);
        let responseOK = response && response.status === 200 && response.statusText === 'OK';
        if (responseOK) {
            let data = await response.data;
            console.log('response : ',data);
            // do something with data
        }else{
            console.log('response : 22222');
            this.setState({loading:false})    
        }

        */

        let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain
        let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey
        CommonUtil.callAPI( aPIsDomain + '/v1/meta/smartfinder',{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': aPIsAuthKey
            }), 
                body:null
            },5000
            ).then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        //console.log('response2 : ',response.data.SmartFinder[smartFinderCode]);
                        //this.setState({attentionItems2:response.data.SmartFinder[smartFinderCode]})

                        const sf = CommonUtil.getSFallListNoh(response.data.SmartFinder);
                        console.log('level03 : ', sf.level03);
                        //console.log('level04 : ', sf.level04);
                        //console.log('difficulty: ', sf.difficulty);
                        //console.log('teachers : ', sf.teachers);
                        this.setState({
                            loading : false,
                            listlevel03: sf.level03[smartFinderCode],
                            listlevel04: sf.level04[smartFinderCode],
                            listdifficulty: sf.difficulty[smartFinderCode],
                            listteachers: sf.teachers[smartFinderCode],
                        })

                        this.props._updaterecommFilterData({
                            listlevel03: sf.level03[smartFinderCode],
                            listlevel04: sf.level04[smartFinderCode],
                            listdifficulty: sf.difficulty[smartFinderCode],
                            listteachers: sf.teachers[smartFinderCode], 
                        })

                        
                    }

                }else{
                    this.failCallAPi()
                }
                this.setState({loading:false})   
            })
            .catch(err => {
                failCallAPi
                console.log('login error => ', err);
                /*
                    Alert.alert(
                    'Hackers',
                    '시스템오류: 관리자에게 문의해 주세요.',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                    {cancelable: false},
                );
                */
            });
            
        /*
        await fetch( 'https://tchamp.hackers.com/v1/meta/smartfinder',{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json; charset=UTF-8',
                apiKey: '83F7E0BF28C2D9917F515694B21900BF'
                
                
                
            }), 
                //body: JSON.stringify({'apiKey': DEFAULT_CONSTANTS.apitestKey})
                body:null
            })
            .then(response => response.json())
            .then(responseJson => {
                console.log('responseJson',responseJson)        
                this.setState({loading:false})                            
            })
            .catch(error => {                
                console.error(error);
            });
            */
    }

    failCallAPi = () => {
        const alerttoast = Toast.show('데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요');
        setTimeout(() => {
            Toast.hide(alerttoast);       
            this.props.screenState._closeModal()  
        }, 2000)
    }

    _closeModal = () => {
        this.setState({ showModal: false })
    };
    _showModal = async(mode) => {        
        await this.setState({ modalContent: mode })        
        this.setState({ showModal: true })
    }

    setChecked = async(index,index2,thischeck,thisCode,thisText) => {
        this.state.attentionItems[index].sublist[index2].checked = !thischeck;

        let selectedFilterCodeList = this.state.selectedFilterCodeList;                  
        if ( thischeck ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.code !== thisCode);        
        }else{ //추가
            selectedFilterCodeList.push({code : thisCode,name : thisText});
            
        }
        
        return selectedFilterCodeList;

    }
    
    checkCartList = async(idx,idx2,thischeck,thisCode,thisText) =>{
        let returArray = await this.setChecked(idx,idx2,thischeck,thisCode,thisText);     
        // 중복제거
        Array.from(new Set(returArray));
        //Array.from(new Set(data.selectedFilterNameList));       
        
        this.setState({
            selectedFilterCodeList : returArray
        })
        /*
        attentionItems: attentionItems.map(
            items => items[idx].sublist[idx2].code === cod
            ? {...items, ...items[idx].sublist[idx2].checked = !val } 
            : items // 기존의 값을 그대로 유지
        )
        */
    }

    setChecked2 = async(type,index,thischeck,thisCode,thisText) => {
        if ( type === 1 ) {
            this.state.listlevel03[index].checked = !thischeck;
        }else if ( type === 2 ) {
            this.state.listlevel04[index].checked = !thischeck;
        }else if ( type === 3 ) {
            this.state.listdifficulty[index].checked = !thischeck;
        }else if ( type === 4 ) {
            this.state.listteachers[index].checked = !thischeck;
        }

        let selectedFilterCodeList = this.state.selectedFilterCodeList;                  
        if ( thischeck ) { //제거            
            selectedFilterCodeList = selectedFilterCodeList.filter((info) => info.code !== thisCode);
        }else{ //추가
            selectedFilterCodeList.push({'type' : type, 'code' : thisCode,'name' : thisText});
            
        }
        
        return selectedFilterCodeList;

    }
      
    checkCartList2 = async(type,idx,thischeck,thisCode,thisText) =>{
        if (this.state.selectedFilterCodeList.length >= 10) {
            Alert.alert('', '최대 10개까지 선택할 수 있습니다.');
            return;
        }

        let returArray = await this.setChecked2(type,idx,thischeck,thisCode,thisText);
        // 중복제거
        Array.from(new Set(returArray));
        //Array.from(new Set(data.selectedFilterNameList));
        
        await this.setState({
            selectedFilterCodeList: Array.from(new Set(returArray))
        });
        /*
        attentionItems: attentionItems.map(
            items => items[idx].sublist[idx2].code === cod
            ? {...items, ...items[idx].sublist[idx2].checked = !val } 
            : items // 기존의 값을 그대로 유지
        )
        */
    }

    setupClearFilter = async() => {
        
        let sendData2 = [];
        await this.setState({
            selectedFilterCodeList: []
        });
        //this.props._updatemyTopFilter(sendData);
        this.props._updaterecommFilterData(sendData2);
        this.props._updaterecommSelectData(sendData2);
        this.refreshTextBookInfo();
    }
    setupFilter = async () => {
        this.setState({loading: true, isSetupFilter: true});
        let foreData = this.props.recommSelectData;
        //this.props._updatemyTopFilter(sendData);
        await this.props._updaterecommSelectData(this.state.selectedFilterCodeList);
        if ( foreData !== this.state.selectedFilterCodeList) {
            await this.props.screenState.refreshTextBookInfo(1);
        }
        setTimeout(() => {
            this.setState({loading: false, isSetupFilter: false});
            this.props.screenState._closeModal();
        }, 300)

    

        
    }

   

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.IndicatorContainer}>
                    <ActivityIndicator size="large" />
                    {this.state.isSetupFilter &&
                    <CustomTextR style={{marginTop: 10}}>검색 필터 적용 중...</CustomTextR>
                    }
                </View>
            )
        } else {
        
            return(
                <View style={ styles.container }>                
                    <View style={{paddingTop:5,paddingBottom:10,alignItems:'center',justifyContent:'center',borderBottomColor:'#ccc',borderBottomWidth:1}}>
                        <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                            검색필터
                        </CustomTextR>
                        <TouchableOpacity
                            onPress= {()=> {
                                this.props.screenState._closeModal();
                                }
                            }
                            style={{position:'absolute',top:0,right:15,width:30,height:30}}>
                            <Icon name="close" size={25} color={DEFAULT_COLOR.base_color_666} />
                        </TouchableOpacity>
                    </View>
            
                    <ScrollView 
                        style={{flex:1,backgroundColor:'#fff',marginBottom:100}}
                    >
                        { typeof this.state.listlevel03 === 'object' && this.state.listlevel03.length > 0 &&
                        <View style={{flex:1,padding:10}}>
                            <View style={{flex:1,marginVertical : 10}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>과목</CustomTextR>
                            </View>
                            <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                {
                                    this.state.listlevel03.map((data1,index1) => {
                                    var isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                        info => info.code === data1.Code
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={index1}
                                            // onPress= {()=> this.checkCartList2(1,index1,data1.checked,data1.Code,data1.Name)}
                                            onPress= {()=> this.checkCartList2(1,index1,isIndexOf > -1,data1.Code,data1.Name)}
                                            style={isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}>
                                            <CustomTextR style={[{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)},isIndexOf !== -1 ? styles.textWhite : styles.textGray]}
                                            >{data1.Name}</CustomTextR>
                                        </TouchableOpacity>
                                        )
                                    })
                                }
                                         
                            </View>
                        </View>
                        }
                        { typeof this.state.listlevel04 === 'object' && this.state.listlevel04.length > 0 &&
                        <View style={{flex:1,padding:10}}>
                            <View style={{flex:1,marginVertical : 10}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>유형</CustomTextR>
                            </View>
                            <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                {
                                    this.state.listlevel04.map((data2,index2) => {
                                    var isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                        info => info.code === data2.Code
                                    );                                        
                                    return (
                                        <TouchableOpacity 
                                            key={index2}
                                            // onPress= {()=> this.checkCartList2(2,index2,data2.checked,data2.Code,data2.Name)}
                                            onPress= {()=> this.checkCartList2(2,index2,isIndexOf > -1,data2.Code,data2.Name)}
                                            style={isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}>
                                            <CustomTextR style={[{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)},isIndexOf !== -1 ? styles.textWhite : styles.textGray]}
                                            >{data2.Name}</CustomTextR>
                                        </TouchableOpacity>
                                        )
                                    })
                                }
                                        
                            </View>
                        </View>
                        }
                        { typeof this.state.listdifficulty === 'object' && this.state.listdifficulty.length > 0 &&
                        <View style={{flex:1,padding:10}}>
                            <View style={{flex:1,marginVertical : 10}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>난이도</CustomTextR>
                            </View>
                            <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                {
                                    this.state.listdifficulty.map((data3,index3) => {
                                    var isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                        info => info.code === data3.Code
                                    );                                        
                                    return (
                                        <TouchableOpacity 
                                            key={index3}
                                            // onPress= {()=> this.checkCartList2(3,index3,data3.checked,data3.Code,data3.Name)}
                                            onPress= {()=> this.checkCartList2(3,index3,isIndexOf > -1,data3.Code,data3.Name)}
                                            style={isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}>
                                            <CustomTextR style={[{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)},isIndexOf !== -1 ? styles.textWhite : styles.textGray]}
                                            >{data3.Name}</CustomTextR>
                                        </TouchableOpacity>
                                        )
                                    })
                                }
                                        
                            </View>
                        </View>
                        }
                        { typeof this.state.listteachers === 'object' && this.state.listteachers.length > 0 &&
                        <View style={{flex:1,padding:10}}>
                            <View style={{flex:1,marginVertical : 10}}>
                                <CustomTextR style={{color:DEFAULT_COLOR.base_color_222,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)}}>선생님</CustomTextR>
                            </View>
                            <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                {
                                    this.state.listteachers.map((data4,index4) => {
                                    var isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                        info => info.code === data4.Code
                                    );                                        
                                    return (
                                        <TouchableOpacity 
                                            key={index4}
                                            // onPress= {()=> this.checkCartList2(4,index4,data4.checked,data4.Code,data4.Name)}
                                            onPress= {()=> this.checkCartList2(4,index4,isIndexOf > -1,data4.Code,data4.Name)}
                                            style={isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}>
                                            <CustomTextR style={[{fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)},isIndexOf !== -1 ? styles.textWhite : styles.textGray]}
                                            >{data4.Name}</CustomTextR>
                                        </TouchableOpacity>
                                        )
                                    })
                                }
                                        
                            </View>
                        </View>
                        }
                        { /*
                        this.state.attentionItems.map((data1, index1) => { 
                            return (
                                <View style={{flex:1,padding:10}} key={index1}>
                                    <View style={{flex:1,marginVertical : 10}}>
                                        <Text style={{fontSize:18}}>{data1.depth1Title}</Text>
                                    </View>
                                    <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',flexGrow:1,alignContent:'stretch'}}>
                                        
                                        {
                                         data1.sublist.map((data2,index2) => {
                                            var isIndexOf = this.state.selectedFilterCodeList.findIndex(
                                                info => info.code === data2.code
                                            );                                        
                                            return ( //attentionSelectCode
                                                <TouchableOpacity 
                                                    key={index2}
                                                    onPress= {()=> this.checkCartList(index1,index2,data2.checked,data2.code,data2.depth2Title)}
                                                    style={data2.checked || isIndexOf !== -1 ? styles.selectedAttention : styles.unselectedAttention}>
                                                    <Text 
                                                        style={data2.checked || isIndexOf !== -1 ? styles.textWhite : styles.textGray}
                                                    >{data2.depth2Title}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                        }
                                        
                                    </View>
                                </View>
                            )
                            })
                        */}
                        
                    </ScrollView>
                    <View style={{position:'absolute',left:0,bottom:0,width:SCREEN_WIDTH,minHeight:10}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            <TouchableOpacity 
                                onPress={()=>this.setupClearFilter()}
                                style={{flex:1,padding:20,alignItems:'center',justifyContent:'center',backgroundColor:'#222'}}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                                    초기화
                                </CustomTextB>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={{flex:1,flexDirection:'row',flexGrow:1,padding:20,alignItems:'center',justifyContent:'center',backgroundColor:DEFAULT_COLOR.lecture_base}}
                                onPress={()=>this.setupFilter()}
                            >
                                <CustomTextB style={{color:DEFAULT_COLOR.base_color_fff,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize18)}}>
                                    적용
                                </CustomTextB>
                                <View style={{position:'absolute',right:'30%',top:15,width:25,height:25,borderRadius:15,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',marginLeft:10}}>
                                    <CustomTextR style={{color:DEFAULT_COLOR.lecture_base,fontSize:PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize13)}}>{this.state.selectedFilterCodeList.length}</CustomTextR>
                                </View>
                            </TouchableOpacity>
                        </View>
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
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },  
    unselectedAttention : {
        margin:5,backgroundColor:'#fff',paddingHorizontal:20,
        alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10,
        ...Platform.select({
            ios: {
                paddingVertical: 10
            },
            android: {
                paddingVertical: 0
            },
            default: {              
                paddingVertical: 10
            }
          })
    },
    selectedAttention : {
        margin:5,backgroundColor:DEFAULT_COLOR.lecture_base,paddingHorizontal:20,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:DEFAULT_COLOR.input_border_color,borderRadius:10,
        ...Platform.select({
            ios: {
                paddingVertical: 10
            },
            android: {
                paddingVertical: 0
            },
            default: {              
                paddingVertical: 10
            }
          })
    },
    textWhite  :{
        color : DEFAULT_COLOR.base_color_fff
    },
    textGray  :{
        color : DEFAULT_COLOR.base_color_666
    }
    
    
});

function mapStateToProps(state) {
    return {
        selectBook: state.GlabalStatus.selectBook,    
        topFavoriteMenu: state.GlabalStatus.topFavoriteMenu,   
        showBottomBar: state.GlabalStatus.showBottomBar,
        textBookFocusHeight : state.GlabalStatus.textBookFocusHeight,
        myTopFilter : state.GlabalStatus.myTopFilter,
        recommSelectData : state.GlabalStatus.recommSelectData,
        recommFilterData : state.GlabalStatus.recommFilterData,
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
    };
}


function mapDispatchToProps(dispatch) {
    return {
        _updateStatusNowScroll:(boolen) => {
            dispatch(ActionCreator.updateStatusNowScroll(boolen));
        },
        _updateStatusShowBottomBar:(boolen) => {
            dispatch(ActionCreator.updateStatusShowBottomBar(boolen));
        },
        _updateTextBookFocusHeight:(number) => {
            dispatch(ActionCreator.updateTextBookFocusHeight(number));
        },
        _updatemyTopFilter:(object) => {
            dispatch(ActionCreator.updatemyTopFilter(object));
        },
        _updaterecommFilterData:(object) => {
            dispatch(ActionCreator.updaterecommFilterData(object));
        },
        _updaterecommSelectData:(object) => {
            dispatch(ActionCreator.updaterecommSelectData(object));
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchFilter);