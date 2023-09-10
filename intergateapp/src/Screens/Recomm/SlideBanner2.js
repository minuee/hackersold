import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  ActivityIndicator,
  PixelRatio
} from 'react-native';
import Swiper from 'react-native-swiper'
import { NavigationEvents } from 'react-navigation';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");
import  * as getDEFAULT_CONSTANTS   from '../../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;
const DEFAULT_TEXT = getDEFAULT_CONSTANTS.DEFAULT_TEXT;
const DEFAULT_COLOR = getDEFAULT_CONSTANTS.DEFAULT_COLOR;
import {CustomTextM,CustomTextR, CustomTextB, TextRobotoM,TextRobotoR} from '../../Style/CustomText';


export default class SlideBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {     
            loading : true,
            banners : [],
            autoplay : true,
            isLoop : true,
        };
    } 

    UNSAFE_componentWillMount() {        
        this.setState({banners: this.props.screenState.bannerList});
        setTimeout(
            () => {
                this.setState({loading : false});   
            },500
        )
    }

    
    UNSAFE_componentWillReceiveProps(nextProps) {
        
    }

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextProps',nextProps );
        
        
        return true;
    }

    UNSAFE_componentWillUnmount(){
        this.setState({
            autoplay:false,
            isLoop : false
        })
    }

    _onTouchStart = () => {        
        if ( Platform.OS === 'android') {
            //this.props.screenState.setTopScrollDisable(true);// disabed parent scroll            
        }
    }

    _onTouchEnd = () => {        
        if ( Platform.OS === 'android') {
            //this.props.screenState.setTopScrollDisable(false); // enables parent scroll
        }
    }

    goSite = async(type,url) => {       
        console.log('type',type);
        console.log('url',url);
        if ( type === 'link' && url !== '') {
            Linking.openURL(url);
        }else{
            
        }
    }

    renderPagination = (index, total, context) => {
        return (
          <View style={styles.paginationStyle}>
            <TextRobotoM style={styles.paginationText2}>
              <TextRobotoM style={styles.paginationText}>{index + 1}</TextRobotoM>/{total}
            </TextRobotoM>
          </View>
        )
    }
    
    
    render () {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
         }else {
            return (
                <View>
                     <NavigationEvents
                        onWillFocus={payload => {     
                            console.log('slide onWillFocus')                       
                            
                        }}
                        onWillBlur={payload => {          
                            console.log('slide onWillBlur')      
                            
                        }}
                    />
                
                    <Swiper
                        style={[{margin:0,padding:0,backgroundColor:'transparent',height:SCREEN_WIDTH/4*3}]}
                        renderPagination={this.renderPagination}
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                        onTouchStart={()=>this._onTouchStart()}
                        onMomentumScrollEnd={()=>this._onTouchEnd()}
                        loop={this.state.isLoop}
                        autoplay={this.state.autoplay}            
                        autoplayTimeout={5}
                    >
                        {this.state.banners.map((imageItem,index) => {
                            return (
                                <TouchableOpacity 
                                    key={index} 
                                    onPress= {()=> this.goSite(imageItem.linkType,imageItem.linkUrl)}
                                    style={{                                    
                                        width : SCREEN_WIDTH,
                                        height : SCREEN_WIDTH/4*3,
                                        justifyContent:'center',
                                        alignItems:'center'
                                        
                                    }}
                                >
                                    <Image
                                        style={styles.imagewrap} source={{uri:imageItem.image}} 
                                        resizeMode='cover'
                                    />
                                </TouchableOpacity>
                                )
                        })}
                        
                    </Swiper>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    IndicatorContainer : {
        flex: 1,
        width:'100%',        
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        flex: 1,
        alignItems :'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        //padding:5
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    imagewrap: {
        width : SCREEN_WIDTH,
        height : SCREEN_WIDTH/4*3,
        flex: 1,
    },
    paginationStyle: {
        position: 'absolute',
        top: 20,
        right: 15,
        backgroundColor:'#000',
        paddingHorizontal:6,
        borderRadius:12
    },
    paginationText: {
        color: '#fff',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    },
    paginationText2: {
        color: '#ccc',
        fontSize: PixelRatio.roundToNearestPixel(DEFAULT_TEXT.fontSize15)
    }
})

/*
return (
        <TouchableOpacity 
            key={index} 
            onPress= {()=> this.goSite(imageItem.linkType,imageItem.linkUrl)}
            style={{                                    
                width : SCREEN_WIDTH,
                height : SCREEN_WIDTH/4*3,
                justifyContent:'center',
                alignItems:'center'
                
            }}
        >
            <Image 
                
                
                style={styles.imagewrap} source={{uri:imageItem.image}} 
                resizeMode={'contain'}
            />
        </TouchableOpacity>
    )
    */