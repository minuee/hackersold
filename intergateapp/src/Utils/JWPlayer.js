import * as React from 'react';

import WebView from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<style> 
        html, body { width: 100%; height: 100%; margin:0px; padding: 0px; background-color: #ececec; } 
        .jwvideo video { 
            /* -webkit-transform: none !important; transform: none !important; height:100% !important; width:100% !important;*/ 
        }
    </style>
    <script src="https://jwpsrv.com/library/z6oTREH8EeS+YSIACyaB8g.js"></script>
    <script>
        document.addEventListener("postMessage", function(data) {
            alert(data.movieurl);
        });
    </script>
</head>
<body>
    <div id="playerQCHsuyTviMgz" style="width:100%; min-height: 100%;"></div>	
    <script type="text/javascript">
		jwplayer("playerQCHsuyTviMgz").setup({
		file: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8",		
        width: '100%',
        autostart: "false",
		});
	</script>		
</body>
</html>
`;


const JWPlayer = (props) => {
    const {jsOptions, onSelected,movieurl, onError, ...otherProps} = props;
    
    const injectedJavaScript = React.useMemo(() => `initOnReady(${JSON.stringify(jsOptions)});void(0);`, [jsOptions]);

    const onMessage = React.useCallback(({nativeEvent}) => {  
    }, [onSelected]);

    passValues= () =>{                
        let data = {
            movieurl :movieurl
        }
        console.log("Platform.OS",Platform.OS);
        this.appWebview.postMessage(JSON.stringify(data));        
               
    }
    
    return (
        <WebView
            {...otherProps}
            ref={webview => this.appWebview = webview}
            source={{html, baseUrl: 'https://github.com'}}
            onMessage={onMessage}
            injectedJavaScript={injectedJavaScript}
            mixedContentMode={"compatibility"}
            useWebKit={true}
            onShouldStartLoadWithRequest={() => true}
            onLoadEnd={() => this.passValues()}
        />
    );

};

export default JWPlayer;