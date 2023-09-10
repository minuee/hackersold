import React from 'react';
import {View,Text,StyleSheet,Image} from "react-native";
import Swiper from "react-native-web-swiper";


import sampleimg01 from '../assets/images/sample01.jpg';
import sampleimg02 from '../assets/images/sample02.jpg';
import sampleimg03 from '../assets/images/sample03.jpg';
import sampleimg04 from '../assets/images/sample04.jpg';

export default class IntroScreen extends React.Component {

    constructor(props) {
        super(props);
        console.log("IntroScreen Is Loading");
        this.state = {
            LoginToken: null
        };
    }


    render() {
        return (
            <View style={styles.container}>
                <Swiper>
                    <View style={[styles.slideContainer]}>
                        <Image style={{height:'100%',width:'100%'}} source={sampleimg01} />
                    </View>
                    <View style={[styles.slideContainer]}>
                        <Image style={{height:'100%',width:'100%'}} source={sampleimg02} />
                    </View>
                    <View style={[styles.slideContainer]}>
                        <Image style={{height:'100%',width:'100%'}} source={sampleimg03} />
                    </View>
                    <View style={[styles.slideContainer]}>
                        <Image style={{height:'100%',width:'100%'}} source={sampleimg04} />
                    </View>
                </Swiper>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width : "100%"
    },
    slideContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    slide1: {
        backgroundColor: "rgba(20,20,200,0.3)"
    },
    slide2: {

    },
    slide3: {
        backgroundColor: "rgba(200,20,20,0.3)"
    },
});