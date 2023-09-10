import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View,Image,Platform ,PermissionsAndroid} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";
import Toast from 'react-native-tiny-toast';

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Waiting</Text>
    </View>
);



export default class CameraScreen extends Component {

    constructor() {
        super();
        this.state  = {
            photourl : null
        }
    }


    UNSAFE_componentWillUnMount() {
        this.setState({
            photourl : null
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >
                    {({ camera, status, recordAudioPermissionStatus }) => {
                        if (status !== 'READY') return <PendingView />;
                        return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                                    <Text style={{ fontSize: 14 }}> Chee~~~~se </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                </RNCamera>
                <View style={styles.itemFlag}>
                    {this.state.photourl != null && <Image style={{height:"100%"}} source={{uri :this.state.photourl}} />}
                </View>
            </View>
        );
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

    takePicture = async function(camera) {
        /*const options = { quality: 0.5, base64: true };
        const data = await camera.takePictureAsync(options);
        console.log(data.uri);
        this.setState({ photourl : data.uri });*/

        if (camera) {
            if (Platform.OS === 'android'){
                await this.checkAndroidPermission();
            }
            const options = {
                quality: 1,
                fixOrientation: true
            };
            const data = await camera.takePictureAsync(options).then(data => {
                const toast = Toast.showLoading(data.uri,);
                setTimeout(() => {
                    Toast.hide(toast)
                }, 3000);
                CameraRoll.saveToCameraRoll(data.uri,"photo");
                this.setState({ photourl : data.uri });
                console.log(data.uri);
            });

        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    itemFlag: {
        position: "absolute",
        bottom:10,
        right:10,
        width:100,
        height:100,
        backgroundColor: '#4ba613',
    },
});

