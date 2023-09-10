import { StyleSheet } from 'react-native';

import { SCREEN_WIDTH } from './constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'transparent'
  },
  scrollView: {
    backgroundColor: 'transparent'
  },
  background: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: SCREEN_WIDTH,
    resizeMode: 'cover'
  },
  content: {
    //shadowColor: '#222',
    //shadowOpacity: 0.3,
    //shadowRadius: 2,
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'column'
  },
  headerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#ff0000'
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
    position:'absolute',bottom:50,right:20,width:50,height:50,paddingTop:5,backgroundColor:'#fff',alignItems:'center',justifyContent:'center',zIndex:3,borderColor:'#ccc',borderWidth:1,borderRadius:25,opacity:0.5
},
});

export default styles;
