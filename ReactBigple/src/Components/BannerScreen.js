import React, {Component} from 'react';
import {StyleSheet, Linking, View, Image,TouchableHighlight} from 'react-native';

export default class BannerScreen extends Component {

    constructor(props) {
        super(props);                        
        this.state = {
            imgurl : null,
            url : 'http://m.champ.hackers.com',
            items : [
                {imgurl : '../../assets/images/banner.jpg',url : 'http://m.champ.hackers.com'},
                {imgurl : '../../assets/images/banner2.jpg',url : 'http://m.champ.hackers.com'}
            ]
        }
        
    }

    UNSAFE_componentWillMount() {
        let pickItem = this.random_item(this.state.items);   
        this.setState({ 
            imgurl: pickItem.imgurl,
            url: pickItem.url
        });     
    }    

    componentDidMount() {        
      //  console.log('componentDidMount');        
    }

    goBannerLink = () => {
      
        Linking.openURL(this.state.url);        
    }

    random_item = (items) => {  
        return items[Math.floor(Math.random()*items.length)];     
    }
    render() {
        return (
            this.state.imgurl ?
            <View style={styles.Bannercontainer} >
                <TouchableHighlight onPress= {()=> this.goBannerLink()}>
                    <Image 
                        source={require('../../assets/images/banner.jpg')} 
                        //source={require(this.state.imgurl)}
                        style={{
                            width: '100%',
                            height : 100,
                        }} 
                        resizeMode='cover'                         
                    />
                    
                </TouchableHighlight>
            </View>
            : null
        );
    }
}

const styles = StyleSheet.create({
    container: {      
        
        
    }

});
/*
    <Image ssource={require('../../assets/images/banner.jpg')} style={{ width: '100%',height : 100,tintColor: 'gray' }} />
    <Image source={require('../../assets/images/banner.jpg')} style={{ position: 'absolute', width: '100%',height : 100,opacity: 0.5}} />
*/
