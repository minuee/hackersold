import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //borderColor: 'transparent',
        //backgroundColor: '#FF0000',
    },
    scrollView: {
        backgroundColor: 'transparent'
        //backgroundColor: '#0000FF',
    },
    background: {
        position: 'absolute',
        backgroundColor: '#000000',
        width: SCREEN_WIDTH,
        resizeMode: 'cover'
    },
    content: {
        //shadowColor: '#222',
        //shadowOpacity: 0.3,
        //shadowRadius: 2,
        backgroundColor: 'transparent',
        //backgroundColor: '#0000FF',
        flexDirection: 'column',
    },
    headerView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    listView: {
        backgroundColor: 'rgba(247,247, 250, 1)'
    },
    logoutText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    btnGoTopWrap : {
        position:'absolute',
        bottom:20,
        right:20,
        width:50,
        height:50,
        paddingTop:5,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
        zIndex:3,
        //borderColor:'#ccc',
        //borderWidth:1,
        //borderRadius:25,
        //opacity:0.5
    },
});

export default styles;