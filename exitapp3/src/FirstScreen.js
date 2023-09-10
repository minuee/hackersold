import React from 'react';
import { SafeAreaView, createAppContainer} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Text ,View,StyleSheet,AsyncStorage } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import IntroScreen from './IntroScreen';
import LogoutScreen from './LogoutScreen';
import LoginScreen from './LoginScreen';
import BlueScreen from './BlueScreen';
import BottomTabs from './Component/BottomTabs';

const styles = StyleSheet.create({
    NavContainer: {
        flex : 1,
        padding: 10,
        marginTop: 20
    },
});


const HamburgerNavigation = createDrawerNavigator(
    {
        Tabs: BottomTabs
    },
    {

        initialRouteName: 'Tabs',
        contentComponent: props => {

            return (
                <ScrollView>
                    <SafeAreaView
                        forceInset={{ top: 'always', horizontal: 'never' }}
                    >
                        <View style={styles.NavContainer}>
                            <Text
                                onPress={() => {
                                    props.navigation.navigate('IntroScreen');
                                    props.navigation.closeDrawer();
                                }}
                            >
                                <Ionicons name="ios-home" size={20} /> Home
                            </Text>
                            <Text
                                onPress={() => {
                                    props.navigation.navigate('BlueScreen');
                                    props.navigation.closeDrawer();
                                }}
                            >
                                <Ionicons name="ios-settings" size={20} /> 설정
                            </Text>
                            <View>
                                {   props.screenProps.LoginToken === null  ?
                                    <View>

                                        <Text  onPress={() => {
                                            //let moveAuthScreen = props.LoginToken == ""  ? 'LoginScreen' : 'LogoutScreen';
                                            props.navigation.navigate("LoginScreen");
                                            props.navigation.closeDrawer();
                                        }}>
                                            <Ionicons name="md-log-in" size={20} /> 로그인
                                        </Text>
                                    </View>
                                    :
                                    <View>

                                        <Text   onPress={() => {
                                            AsyncStorage.removeItem('userToken');

                                        }}><Ionicons name="md-log-out" size={20} /> 로그아웃</Text>
                                    </View>
                                }
                            </View>
                            <Text
                                onPress={() => {
                                    props.screenProps.Fn_Close();
                                }}
                            >
                                <Ionicons name="ios-settings" size={20} /> 앱종료
                            </Text>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            )
        }
    }
);


const Stack = createStackNavigator(
    {

        Drawer: {
            screen: HamburgerNavigation,
            navigationOptions: {
                header: null,
            },
        },
        BlueScreen: {screen: BlueScreen},
        IntroScreen: {screen: IntroScreen},
        LogoutScreen: { screen: LogoutScreen},
        LoginScreen: { screen: LoginScreen}
    }
);

export default createAppContainer(Stack);