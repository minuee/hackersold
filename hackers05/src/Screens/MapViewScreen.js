import React, {Component} from 'react';
import {StyleSheet,ScrollView, TouchableOpacity,Text, View,Platform} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Flag } from 'react-native-svg-flagkit';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();

export default class MapViewScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            latitude: 37.566536,
            longitude: 126.977966,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            mapType : 'standard',
            mapTypeIcon : 'wpexplorer',
            items : [
                { flag :"KR",latitude: 37.566536,longitude: 126.977966 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421},
                { flag :"JP",latitude: 35.689487,longitude: 139.691711 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"US",latitude: 38.892060,longitude: -77.019910 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"GB",latitude: 51.507351,longitude: -0.127758 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"CN",latitude: 39.904202,longitude: 116.407394 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"HK",latitude: 22.278096,longitude: 114.164439 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"FR",latitude: 48.856613,longitude: 2.352222 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421},
                { flag :"DE",latitude: 52.520008,longitude: 13.404954 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"ES",latitude: 40.416775,longitude: -3.703790 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"VN",latitude: 21.027763,longitude: 105.834160 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
                { flag :"EG",latitude: 30.044420,longitude: 31.235712 ,atitudeDelta: 0.0922,ongitudeDelta: 0.0421 },
            ]
        }
    }

    _changMapType = async () => {
        
        this.setState({
            mapType : this.state.mapType =='standard' ? 'satellite' : 'standard',
            mapTypeIcon: this.state.mapType =='standard' ? 'street-view' : 'wpexplorer',
        })   
    }
          
    _updateGeodata = async (x,y,d1,d2) => {
        console.log('xxx',x);
       
        this.setState({
            latitude : x ? x : 37.78825,
            longitude : y ? y : 126.977966,
            atitudeDelta : d1 ? d1 : 0.0922,
            ongitudeDelta : d2 ? d2 : 0.0421
        })   
    }

    render() {
        return (
            <View style={styles.container}>      
                <View style={styles.header_container}>
                    <Icon name={this.state.mapTypeIcon} size={30} color="#ff00ff" style={{textAlign: 'center'}} 
                    onPress={() => this._changMapType()} />
                </View>
                <MapView                     
                    style={styles.map} 
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta
                    }}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta
                    }}
                    mapType={this.state.mapType}
                >
                    <MapView.Marker coordinate={this.state} />
                </MapView>
                <View style={styles.footer_container}>
                    <ScrollView horizontal={true}>
                        {this.state.items.map((data, index) => {
                            return (
                                <TouchableOpacity style={styles.itemContainer} onPress= {()=> this._updateGeodata(data.latitude,data.longitude,data.latitudeDelta,data.longitudeDelta)}>
                                    <Flag id={data.flag} size={0.2} />
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 15,
        fontWeight: '700',
        color: '#59656C',
        paddingVertical:20
    },
    map: {
        width: null,
        height: '100%',
        width : '100%',
        flex: 1,
        
    },
    header_container : {
        position :"absolute",
        top:10,
        right:10,
        zIndex : 10,
        width: 50,
        height: 50,
        color: '#fff',
        fontSize: 22,
        padding: 5
    },
    footer_container:{
        width: '100%',
        height: 45,
        backgroundColor: '#20d2bb',
        justifyContent:'flex-start'
    },
    itemContainer: {                
        padding: 7,
        height: 35,
    },
    itemFlag: {
        position: "absolute",
        top:10,
        right:10
    },
});
