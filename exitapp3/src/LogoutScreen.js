import React, { Component } from 'react';
import {
    Text,AsyncStorage
} from 'react-native';
import { NavigationActions,StackActions } from 'react-navigation'

const logoutAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
});

class LogoutScreen extends Component {

    constructor(props) {
        super(props);
    }


    //NativeModules.DevSettings.reload();
    static navigationOptions = () => {
        return {
            headerRight : <Text>로그아웃</Text>
        };
    };



    state = {
        token: '',
        removeToken: async () => {
            try {
                const resp = await AsyncStorage.removeItem('userToken');
                return resp
            }
            catch (error) {
                this.setState({ error })
            }
        }
    };

    componentDidMount() {
        this.state.removeToken();
        this.props.navigation.dispatch(logoutAction);
    }

    render() {
        return (
            <>
            </>
        );
    }
}


export default LogoutScreen;