import React, {Component} from 'react';
import {
    StyleSheet, Text, View, ScrollView, Button, Image, FlatList, TouchableOpacity, Modal,
    PermissionsAndroid, Platform,Dimensions
} from 'react-native';
import FetchingIndicator from 'react-native-fetching-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
import CameraRoll from "@react-native-community/cameraroll";
import Toast from "react-native-tiny-toast";

export default class SampleScreen01 extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            showItem : 2,
            photos : [],
            imageuri: '',
            ModalVisibleStatus: false,
            isLoadmore : false,
            isLoadImages : false,
            contentHeigjht: 0,
        }
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    componentWillUnmount(){
        console.log("is out");
    }

    checkAndroidPermission = async () => {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            await PermissionsAndroid.request(permission);
            Promise.resolve();
        } catch (error) {
            Promise.reject(error);
        }
    };


    onPhotosFetchedSuccess(data) {
        console.log(data);
    }

    onPhotosFetchError(err) {
        // Handle error here
        console.error(err);
    }

    _handleButtonPress = async () => {

        if (Platform.OS === 'android'){
            await this.checkAndroidPermission();
        }

        CameraRoll.getPhotos({
            first: 100,
            type : 'Photos'
        }, this.onPhotosFetchedSuccess.bind(this), this.onPhotosFetchError.bind(this))
            .then(r => {
                this.setState({ photos: r.edges });
                this.setState({
                    totalphoto: r.edges.length,
                    isLoadImages : true
                });
                r.edges.length > this.state.showItem  ? this.setState({isLoadmore: true}) : this.setState({isLoadmore: false});
            })
            .catch((err) => {
                //Error Loading Images
            });
    };

    ShowModalFunction(visible, imageURL) {
        //handler to handle the click on image of Grid
        //and close button on modal
        this.setState({
            ModalVisibleStatus: visible,
            imageuri: imageURL,
        });
    }

    _LoadClear = async() => {
        this.setState({
            isLoadImages : false,
            showItem: 2,
            photos: null,
            totalphoto: 0,
            ModalVisibleStatus: false,
            isLoadmore: false,
            isLoading : false,
            contentHeigjht : 0
        });
    }

    _LoadMore = async(data) => {
        if ( this.state.isLoadmore ) {
            this.setState({
                isLoading: true
            });
            const limitcount = parseInt(this.state.showItem + 3);
            if (this.state.totalphoto <= limitcount) {
                this.setState({
                    showItem: parseInt(data + 3),
                    isLoadmore: false
                });
                const alerttoast = Toast.show('모든 이미지를 불러왔습니다');
                setTimeout(() => {
                    Toast.hide(alerttoast)
                }, 2000)
            } else if (this.state.totalphoto > this.state.showItem) {
                this.setState({
                    showItem: parseInt(data + 3),
                    isLoadmore: true                    });
            } else {
                this.setState({
                    isLoadmore: false
                });
            }

            setTimeout(() => {
                this.refs.FlatList_Reference.scrollToEnd({animated: true});
                this.setState({isLoading: false});
            }, 500);



        }

    }
    find_dimesions = event => {
        let {width, height} = event.nativeEvent.layout
        console.log("height",height);
        this.setState({contentHeigjht: height});
    }


    render() {
        if (this.state.ModalVisibleStatus) {
            return (
                <Modal
                    transparent={false}
                    animationType={'fade'}
                    visible={this.state.ModalVisibleStatus}
                    onRequestClose={() => {
                        this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                    }}>
                    <View style={styles.modelStyle}>
                        <Image
                            style={styles.fullImageStyle}
                            source={{ uri: this.state.imageuri }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.closeButtonStyle}
                            onPress={() => {
                                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                            }}>
                            <Icon name="times" size={25} color="#fff"
                                  onPress={() => this.ShowModalFunction(!this.state.ModalVisibleStatus, '')} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            );
        } else {
            return (
                <View style={styles.container}>
                    { !this.state.isLoadImages ?
                        <View style={styles.header_style}>
                            <Button title="Load Images" onPress={this._handleButtonPress}/>
                        </View>
                        :
                        <View style={styles.header_style}>
                            <Button title="Clear All Images" onPress={()=>{this._LoadClear()}} />
                        </View>
                    }
                    <View style={styles.content_style} >
                        <FlatList
                            ref='FlatList_Reference'
                            data={this.state.photos}
                            renderItem={({item, index}) => (
                                this.state.showItem >= index &&
                                <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                                    <TouchableOpacity
                                        key={index}
                                        style={{flex: 1}}
                                        onPress={() => {
                                            this.ShowModalFunction(true, item.node.image.uri);
                                        }}>
                                        <Image
                                            style={styles.image}
                                            source={{
                                                uri: item.node.image.uri,
                                            }}
                                            placeholder={{index}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            //Setting the number of column
                            numColumns={3}
                            keyExtractor={(item, index) => index.toString()}
                            //onScroll={()=>{this._LoadMore(this.state.showItem)}}
                        />
                    </View>
                    { this.state.isLoadmore &&
                        <View style={styles.footer_style}>
                            {this.state.isLoading ? <Button title="Loading" icon={
                                <Icon
                                    name="spinner"
                                    size={25}
                                    color="white"
                                />
                            }/> :
                                <Button title="More Load Images" onPress={()=>{this._LoadMore(this.state.showItem)}} />
                            }
                        </View>
                    }

                        {/*{this.state.photos.map((p, i) => {
                        return (
                            <View style={styles.gridView}>
                                <Image
                                    key={i}
                                    style={{ width: 100, height: 100}}
                                    source={{ uri: p.node.image.uri }}
                                />
                            </View>
                        );
                    })}*/}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    image: {
        height: 150,
        width: '100%',
    },
    fullImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '98%',
        resizeMode: 'contain',
    },
    modelStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    closeButtonStyle: {
        width: 25,
        height: 25,
        top:15,
        right: 9,
        position: 'absolute',
    },
    header_style:{
        width: '100%',
        color: '#fff',
        fontSize: 25,
        padding: 10,

    },
    content_style: {
        flex: 1,
        width : "100%"
    },
    footer_style:{
        width: '100%',
        color: '#fff',
        fontSize: 25,
        padding: 10,
    },

});
