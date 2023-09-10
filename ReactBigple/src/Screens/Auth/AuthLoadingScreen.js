import React from 'react';
import { View,ActivityIndicator,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        //this._bootstrapAsync();
    }
    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        console.log("boot",userToken);

        this.props.navigation.navigate(userToken ? 'MainApp' : 'MainAuth');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
