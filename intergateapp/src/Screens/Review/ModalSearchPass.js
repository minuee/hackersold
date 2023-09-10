import React, { Component } from 'react';
import {    
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    PixelRatio,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
Icon.loadFont();

//공통상수
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class ModalSearchPass extends Component {
    constructor(props) {
        super(props);

        this.state = {  
            loading : true,
            selectedcurrentNode : null,
            selectedRoute : [],     
            categoryIdx : this.props.screenState.categoryIdx,
            route : '',       
            filterData: [
                /*
                {index :1, title  : '사랑과 전쟁11111', teacher:'홍길순1'},
                {index :2, title  : '사랑과 전쟁2', teacher:'홍길순2'},
                {index :3, title  : '사랑과 전쟁3', teacher:'홍길순3'},
                {index :4, title  : '사랑과 전쟁4', teacher:'홍길순4'},
                {index :5, title  : '사랑과 전쟁5', teacher:'홍길순5'},
                {index :6, title  : '사랑과 전쟁6', teacher:'홍길순7'},
                {index :7, title  : '사랑과 전쟁7', teacher:'홍길순8'},
                {index :8, title  : '사랑과 전쟁8', teacher:'홍길순9'},
                {index :9, title  : '사랑과 전쟁9', teacher:'홍길순10'},
                */
            ]
        }
    }

    async UNSAFE_componentWillMount() {
        //await this.refreshTextBookInfo();
        
        this.setState({
            filterData :  this.props.screenState.formCategoryArrays,
            loading : false
        })
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
        /*
        const formData = new FormData();
        formData.append('page', 1);
        formData.append('paginate', 1000);
        
        await CommonUtil.callAPI( DEFAULT_CONSTANTS.apiTestDomain2 + '/v1/meta/pass',{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'apiKey': DEFAULT_CONSTANTS.apitestKey
            }), 
                body:null
            },10000
            ).then(response => {
                if (response && typeof response === 'object' || Array.isArray(response) === false) {                    
                    if ( response.code !== '0000' ) {
                        this.failCallAPi()
                    }else{
                        if ( typeof response.data !== 'undefined') {
                            this.setState({
                                loading : false,
                                filterData : response.data
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
        */
    }

    failCallAPi = () => {
     
        let message = "데이터를 가져오는중 오류가 발생하였습니다.\n잠시 뒤에 다시 이용해주세요";
        let timesecond = 2000;
        CommonFuncion.fn_call_toast(message,timesecond);

    }


    _onClick = ({ item, routes, currentNode }) => {
        //console.log('onclick : ',item.name, currentNode);
        //console.log('routes : ',routes);
        this.setState({
            route : item.name,
            selectedcurrentNode : null,
        });
      };
    
    _onClickLeaf = ({ item, routes, currentNode }) => {
        console.log(item.name, currentNode);
        //console.log('routes : ',routes);

        this.setState({
            selectedcurrentNode : currentNode,
            selectedRoute : routes
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
                    <View style={styles.searchDisplayWrap}>
                        <View style={styles.searchDisplayLeft}>
                            <Text style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color: DEFAULT_COLOR.lecture_base}}>
                                카테고리명 : {this.state.filterData.name} 
                            </Text>
                        </View>
                        { this.state.selectedcurrentNode &&
                            <TouchableOpacity 
                                onPress={()=>this.props.screenState.selectCategory(this.state.selectedRoute)}
                                style={styles.searchDisplayRightt}>
                                <Text style={{fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.head_small),color: DEFAULT_COLOR.lecture_base}}>
                                    적용
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                    
                    <ScrollView style={{marginBottom:50}}>
                    {
                        this.state.filterData.categoryList.map((data,index) => {
                            return (
                            <TouchableOpacity 
                                onPress={()=> this.props.screenState.selectCategory(data.categoryName)} 
                                key={index} 
                                style={styles.wrapItem}
                            >
                                <View>                            
                                    <Text style={styles.titleSubject}>{data.categoryName}</Text>
                                </View>
                            </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>

            );
        }
    }
}

export default ModalSearchPass;

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
    searchDisplayWrap:{
        flexDirection:'row',
        padding: 10,
        borderColor: '#CCC',
        borderWidth: 1
    },
    searchDisplayLeft :{
        flex:5,
        justifyContent:'center'

    },
    searchDisplayRight : {
        flex:1,
        justifyContent:'center'

    }
});