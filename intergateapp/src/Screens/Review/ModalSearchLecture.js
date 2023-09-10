import React, { Component, useDebugValue } from 'react';
import {    
    ScrollView,
    View,
    StyleSheet,
    Text,
    PixelRatio,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import SearchInput, { createFilter } from '../../Utils/SearchInput'
//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import CommonUtil from '../../Utils/CommonUtil';
import CommonFuncion from '../../Utils/CommonFunction';
import {CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';
import {TARGET} from "../MyClass/Modal/ModalConstant";
import LinearGradient from "react-native-linear-gradient";



const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const KEYS_TO_FILTERS = ['title']; 

class ModalSearchLecture extends Component {
    constructor(props) {
        super(props);

        this.state = {  
            loading : true,
            searchTerm : '',          
            userName : '',
            memberIdx : this.props.screenState.formMemberIdx,
            filterData: []
        }
    }
    
    async UNSAFE_componentWillMount() {        
        await this.refreshTextBookInfo();
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
        
        let memberIdx = this.state.memberIdx;        
        if ( memberIdx > 0 ) {
            console.log('memberIdx',this.state.memberIdx)
            let aPIsDomain = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiDomain : DEFAULT_CONSTANTS.apiTestDomain;
            let aPIsAuthKey = typeof this.props.myInterestCodeOne.info !== 'undefined' ? this.props.myInterestCodeOne.info.apiKey : DEFAULT_CONSTANTS.apitestKey;        
            await CommonUtil.callAPI( aPIsDomain + '/v1/myClass/class/'+memberIdx,{
                method: 'GET', 
                headers: new Headers({
                    Accept: 'application/json',                
                    'Content-Type': 'multipart/form-data',
                    'apiKey': aPIsAuthKey
                }), 
                    body:null
                },10000
                ).then(response => {
                    
                    if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                        if ( response.code !== '0000' ) {
                            this.failCallAPi()
                        }else{
                            if ( typeof response.data.class !== 'undefined') {
                                this.setState({
                                    loading : false,
                                    filterData : response.data.class
                                })
                            }else{
                                this.setState({
                                    loading : false,
                                    filterData : []
                                })
                            }
                            
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
        }else{
            this.failCallAPi('로그인후 이용해주세요')
        }
    }

    failCallAPi = (tmpmessage = null) => {
     
        let message = tmpmessage === null ? "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요" : tmpmessage;
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }

    

    searchUpdated = (term) => {        
        this.setState({ searchTerm: term })
    }

    render() {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
        }else {            
            let filteredList = this.state.filterData.length > 0 ? this.state.filterData.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS)) : []
            return(
                <View style={styles.modalWrapper}>
                    <View style={styles.modalContent}>
                        <ScrollView
                            style={styles.modalScroll}
                            //onLayout={(event) => this.onLayoutScrollView(event)}
                            indicatorStyle='black'>
                            {
                                filteredList.map((data, index) => {
                                    return (
                                        <View style={styles.modalItem} key={index}>
                                            <TouchableOpacity
                                                style={styles.modalItemWrapper}
                                                onPress={() =>
                                                    this.props.screenState.selectLecture({
                                                        lecture : data.className,
                                                        classIdx : data.classIdx,
                                                        memberClassIdx: data.memberClassIdx,
                                                        teacher : data.teacherName
                                                    })
                                                }
                                                >
                                                <View style={styles.modalItemIconSelectedWrapperLeft}>
                                                </View>

                                                <View style={styles.modalItemIconSelectedWrapperCenter}>
                                                    <CustomTextR
                                                        style={
                                                            this.props.screenState.fromMemberClassIdx === data.memberClassIdx
                                                                ? styles.modalItemTextSelected
                                                                : styles.modalItemText
                                                        }
                                                        numberOfLines={1}
                                                    >
                                                        {data.className}
                                                        {/* {
                                                        this.props.screenState.getLecTargetItemTitle(
                                                            this.props.screenState.ownLecItems[index].index
                                                        )
                                                    } */}
                                                    </CustomTextR>
                                                </View>
                                                <View style={styles.modalItemIconSelectedWrapperRight}>
                                                    {
                                                        this.props.screenState.fromMemberClassIdx === data.memberClassIdx
                                                        &&
                                                        <Image
                                                            style={styles.modalItemIconSelected}
                                                            source={require('../../../assets/icons/btn_check_list.png')}/>
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                            }
                            <LinearGradient
                                pointerEvents={'none'}
                                colors={["rgba(255,255,255,0.00)", "rgba(255,255,255,0.80)", "rgba(255,255,255,0.99)"]}
                                locations={[0.70, 0.99, 1]}
                                style={{position: "absolute", bottom: 0, height: this.state.heightScrollView, width: "100%", }}/>
                        </ScrollView>
                        <View style={styles.cancelButton}>
                            <TouchableOpacity
                                style={styles.cancelButtonWrapper}
                                onPress={() => this.props.screenState.closeModal()}>
                                <CustomTextR styles={styles.cancelButtonText}>취소</CustomTextR>
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
        backgroundColor: '#fff',
        justifyContent:'flex-start'
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapItem:{
        borderBottomWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.3)',
        padding: 10
      },
    titleSubject: {
        color: 'rgba(0,0,0,0.5)'
      },
      searchInput:{
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
      },

    /** Modal **/
    modalWrapper: {
        flex: 1,
        //backgroundColor: '#00000055',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: DEFAULT_COLOR.base_color_fff,
    },
    modalScroll: {
        flex: 1,
    },
    modalItem: {
        height: 65,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    modalItemWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalItemText: {
        color: DEFAULT_COLOR.base_color_000,
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemTextSelected: {
        textAlign: 'center',
        color: DEFAULT_COLOR.lecture_base,
        fontWeight: 'bold',
        fontSize: PixelRatio.roundToNearestPixel(16)
    },
    modalItemIconSelectedWrapperCenter: {
        flex: 5,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperLeft: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },
    modalItemIconSelectedWrapperRight: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
    },
    modalItemIconSelected: {
        width: 15,
        height: 15,
    },
    cancelButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonWrapper: {
        width: SCREEN_WIDTH - 34,
        height: 50,
        backgroundColor: DEFAULT_COLOR.input_bg_color,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginTop: 17,
        marginBottom: 17,
    },
    cancelButtonText: {
        color: DEFAULT_COLOR.base_color_888,
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize16),
        lineHeight: PixelRatio.roundToNearestPixel(51),
        letterSpacing: -0.8,
    },

});

function mapStateToProps(state) {
    return {
        myInterestCodeOne: state.GlabalStatus.myInterestCodeOne,   
        userToken: state.GlabalStatus.userToken
    };
}


export default connect(mapStateToProps, null)(ModalSearchLecture);


/* https://github.com/mjsolidarios/react-native-search-filter  참조 */