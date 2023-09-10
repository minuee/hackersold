# reactnativetest
# 2019-12-16 created

# 2019년 12월 18일
writed by nohseongnam

1. navigation install
"react-navigation": "^4.0.10",
"react-navigation-drawer": "^2.3.3",
"react-navigation-stack": "^1.10.3",
"react-navigation-tabs": "^2.6.2",
위의 Navigation을 설치후에는 반드시 아래도 함께 설치가 필요하다
"react-native-gesture-handler": "^1.5.2",
"react-native-reanimated": "^1.4.0",
"react-native-screens": "^1.0.0-alpha.23",

2. navigation drawer Android를 위한 setting
    - android/app/src/main/java/MainActivity.java 
    import com.facebook.react.ReactActivityDelegate;
    import com.facebook.react.ReactRootView;
    import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView; // 이상 추가

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
        };
    }  MainActivity안에 추가

    - android/app/build.gradle
    implementation 'androidx.appcompat:appcompat:1.1.0-rc01'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'

    - index.js 또는 app.js안에
    import 'react-native-gesture-handler'; 추가


    # 2019년 12월 18일 
    writed by nohseongnam
    추가 모듈  @valdio/react-native-scrollable-tabview


    # 2019년 12월 19일 
    writed by nohseongnam
    추가모듈 
    react-native-svg
    react-native-svg-flagkit
    react-native-fetching-indicator
    react-native-webview@^7.5.2

    #react-native link react-native-webview //안되면 시도