import React, { Component } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';

import Video from 'react-native-video';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

class TitleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVideoStart: false,
        }
    }

    onVideoStart = () => {
        console.log('onVideoStart()');
        this.setState({isVideoStart: true})
    }

    render() {
        return(
            <View style={ styles.container }>
                <View style={ styles.areaVideo }>
                    {
                        this.state.isVideoStart
                            ?
                            <Video
                                source={{uri: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}}   // Can be a URL or a local file.
                                ref={(ref) => {
                                    this.player = ref
                                }}                                      // Store reference
                                controls={true}
                                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                onError={this.videoError}               // Callback when video cannot be loaded
                                resizeMode='cover'
                                style={styles.video} />
                            :
                                <View style={ styles.cover }>
                                    <TouchableOpacity onPress={ () => this.onVideoStart() }>
                                        <Image
                                            style={ styles.coverIcon }
                                            source={ require('../../../assets/icons/play-button.png') } />
                                    </TouchableOpacity>
                                </View>
                    }
                </View>

                <View style={ styles.areaInfo }>
                    <View style={ styles.areaInfoTop }>
                        <Text style={ styles.infoTopTitle }>
                            해커스 신토익 1000제 3 READING
                        </Text>
                    </View>
                    <View style={ styles.areaInfoBottom }>
                        <View style={ styles.infoBottomCategory }>
                            <Text style={ styles.infoBottomCategoryText }>해설</Text>
                        </View>
                        <Text style={ styles.infoBottomNumber }>TEST1 131번</Text>
                        <Text style={ styles.infoBottomAuthor }>  |  주대명</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default TitleComponent;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E2E2E2',
        marginBottom: 10,
    },
    areaVideo: {
        margin: 10,
    },
    video: {
        width: '100%',
        height: SCREEN_HEIGHT / 3,
    },
    cover: {
        width: '100%',
        height: SCREEN_HEIGHT / 3,
        backgroundColor: '#EBEBEB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverIcon: {
    },
    areaInfo: {
        margin: 10,
    },
    areaInfoTop: {

    },
    infoTopTitle: {

    },
    areaInfoBottom: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 30,
        marginBottom: 30,
    },
    infoBottomCategory: {
        color: '#FFFFFF',
        backgroundColor: '#357FE1',
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },
    infoBottomCategoryText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 10
    },
    infoBottomNumber: {
        color: '#357FE1',
    },
    infoBottomAuthor: {
        color: '#6A6A6A',
    },
});