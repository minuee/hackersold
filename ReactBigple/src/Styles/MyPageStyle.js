import {StyleSheet, Dimensions} from 'react-native';

let dimensions = Dimensions.get('window');
let imageHeight = Math.round(dimensions.width*0.35);
let imageWidth = dimensions.width;

const MyPageStyles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        alignContent: 'center',
        backgroundColor: '#e1e2e1',
    },
    container: {
        backgroundColor: '#fff',
    },
    bannerContainer: {
        width: '100%',
        height: imageHeight,
    },
    banerImage: {
        height: imageHeight,
        width: imageWidth,
    },
    txtSubTitle: {
        color: '#3a78d6',
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingTop: 12,
        paddingBottom: 12,
    },
    touchableOpacity: {
        justifyContent: 'center',
        // backgroundColor: 'red',
    },
    txtTouchable: {
        color: '#4e89e1',
        fontSize: 12,
        alignItems: 'center',
        alignContent: 'center',
    },
    menuItemTop: {
        borderTopWidth: 1,
        borderTopColor: '#999',
    },
    menuItem: {
        height: 35,
        borderBottomWidth: 1,
        borderBottomColor: '#999',
    },
    menuItemTitle: {
        color: '#555',
        paddingLeft: 5,
    },
    menuItemLeft: {
        borderRightWidth: 1,
        borderRightColor: '#999',
    },
    menuItemRight: {
        paddingRight: 5,
    },
    flexRow: {
        flexDirection: 'row',
    },
    flexSB: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noDataBox: {
        height: 50,
        borderWidth: 1,
        justifyContent: 'center',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#999',
    },
    loginMenuItem: {
        flex: 1,
        alignItems: 'center',
        height: 40,
    },
    appIconItem: {
        width: 80,
        height: 80,
    },
    appIconImage: {
        width: 80,
        height: 80,
    },
    appIconTitle: {
        textAlign: 'center',
        fontSize: 12,
        paddingTop: 5,
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
});

export default MyPageStyles;
