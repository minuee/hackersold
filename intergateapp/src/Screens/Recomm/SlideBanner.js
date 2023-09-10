import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  Linking,
  Platform,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import Swiper from './Swiper';
const {width: SCREEN_WIDTH,height: SCREEN_HEIGHT} = Dimensions.get("window");

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      <Text style={{ color: 'white' }}>
        <Text style={styles.paginationText}>{index + 1}</Text>/{total}
      </Text>
    </View>
  )
}

export default class SlideBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {     
            loading : true,
            banners : [],
            autoplay : false,
            isLoop : false,
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
       
        if ( type === 'link' && url !== '') {
            Linking.openURL(url);
        }else{
            
        }
    }
    
    render () {
        if ( this.state.loading ) {
            return (
                <View style={styles.IndicatorContainer}><ActivityIndicator size="large" /></View>
            )
         }else {
            return (
                <Swiper
                    style={[{margin:0,padding:0,backgroundColor:'transparent',height:SCREEN_WIDTH/4*3-40},Platform.OS === 'android' && {width:SCREEN_WIDTH}]}
                    renderPagination={renderPagination}
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
                            <Image 
                                key={index}
                                onPress= {()=> this.goSite(imageItem.linkType,imageItem.linkUrl)}
                                style={styles.imagewrap} source={{uri:imageItem.image}} 
                                resizeMode={'cover'}
                            />
                        )
                    })}
                    
                </Swiper>
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
        fontSize: 15
    }
})