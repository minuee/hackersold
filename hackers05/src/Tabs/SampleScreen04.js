import React from 'react'
import { View, Text, Image, Button } from 'react-native'
import ImagePicker from 'react-native-image-picker'

const createFormData = (photo, body) => {
    const fdata = new FormData();

    console.log("photo". photo);

    fdata.append("photo", {
        name: photo.fileName,
        type: photo.type,
        uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
        fdata.append(key, body[key]);
    });
    console.log("returdata". fdata);
    return fdata;
};

export default class SampleScreen04 extends React.Component {

    state = {
        photo: null,
    }

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photo: response })
            }
        })
    }



    handleUploadPhoto = async() => {

        fetch("https://reactserver.hackers.com:3001/api/imgupload", {
            method: "POST",
            body: createFormData(this.state.photo, { userId: "123" })
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", this.state.photo);
                alert("Upload success!");
                this.setState({ photo: null });
            })
            .catch(error => {
                console.log("upload error", error);
                alert("Upload failed!");
            });
    };

    render() {
        const { photo } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {photo && (
                    <React.Fragment>
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: "80%", height: 300 }}
                        />
                        <Button title="Upload" onPress={this.handleUploadPhoto} />
                    </React.Fragment>
                )}
                <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
            </View>
        )
    }
}
