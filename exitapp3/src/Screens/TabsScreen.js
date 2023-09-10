import React from 'react';
import {
    createAppContainer
} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { StyleSheet } from 'react-native';

import BottomTabs from './BottomTabs';

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
        navigationOptions: () => ({
            header: null
        })
    }
);

export default createAppContainer(Stack);
