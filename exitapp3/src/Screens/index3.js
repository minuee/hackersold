import React from 'react';

import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems} from 'react-navigation-drawer';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'native-base';

const HomeScreen = () => (
    <View style={styles.container}>
        <Text>Home Screen!</Text>
    </View>
);


const ProfileScreen = () => (
    <View style={styles.container}>
        <Text>Profile Screen!</Text>
    </View>
);


const SettingsScreen = () => (
    <View style={styles.container}>
        <Text>Settings Screen!</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuOpen: {
        marginLeft: 10,
        marginTop: 10
    },
    menuClose: {
        marginLeft: 14,
        marginTop: 10
    }
});


const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Home Screen',
            drawerLabel: 'Home',
            drawerIcon: () => (
                <Icon name="ios-home" size={20} />
            )
        })
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Profile Screen',
            drawerLabel: 'Profile',
            drawerIcon: () => (
                <Icon name="ios-person" size={20} />
            )
        })
    },
    Settings: {
        screen: SettingsScreen,
        navigationOptions: ({ navigation }) => ({
            drawerIcon: () => (
                <Icon name="ios-settings" size={20} />
            )
        })
    }
});


const StackNavigator = createStackNavigator({
    DrawerNavigator: {
        screen: DrawerNavigator,
        navigationOptions: ({ navigation }) => {
            const { state } = navigation;

            if(state.isDrawerOpen) {
                return {
                    headerRight: () => (
                        <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())}}>
                            <Icon name="close" style={styles.menuClose} size={36}  />
                        </TouchableOpacity>
                    )
                }
            }
            else {
                return {
                    headerRight: () => (
                        <TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())}}>
                            <Icon name="menu" style={styles.menuOpen} size={32}  />
                        </TouchableOpacity>
                    )
                }
            }
        }
    }
});

export default App = createAppContainer(StackNavigator);
