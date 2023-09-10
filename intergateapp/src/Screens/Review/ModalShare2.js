import * as React from 'react';

import WebView from 'react-native-webview';

const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="description" content="Web Share API demo">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<meta property="og:url"           content="https://tchamp.hackers.com" />
<meta property="og:type"          content="website" />
<meta property="og:title"         content="Your Website Title" />
<meta property="og:description"   content="Your description" />
<meta property="og:image"         content="https://tchamp.hackers.com/path/image.jpg" />
<style> 
        html, body { width: 100%; height: 100%; margin:0px; padding: 0px; background-color: #ececec; } 
    </style>
    <script>
        document.addEventListener("postMessage", function(data) {
            alert(data.movieurl);
        });
    </script>

    <script>
    function naver_share() {
      var url = encodeURI(encodeURIComponent(myform.url.value));
      var title = encodeURI(myform.title.value);
      var shareURL = "https://share.naver.com/web/shareView.nhn?url=" + url + "&title=" + title;
      document.location = shareURL;
    }
  </script>

  <script>
    shareButton.addEventListener("click", () => share())
    shareFilesButton.addEventListener("click", () => shareFiles())

    function share() {
        console.log("23")
        if (navigator.share) {
            navigator.share({
                    title: title.value,
                    text: text.value,
                    url: url.value,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log("Web Share API is not available in your browser.")
        }
    }

    function shareFiles() {
        
        console.log(file.value)
        const files = [file]
        if (navigator.canShare && navigator.canShare({
                files: files
            })) {
            navigator.share({
                    title: title.value,
                    text: text.value,
                    file: files,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        } else {
            console.log("Web Share API is not available in your browser.")
        }
    }
</script>

</head>
<body>
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

    <!-- Your share button code -->
    <div class="fb-share-button" 
    data-href="https://champ.hackers.com/?c=event&evt_id=19101100&_ga=2.204850389.478465722.1583923027-525690528.1583467994" 
    data-layout="button_count">
    </div>

    <form id="myform">
    URL입력:  <input type="text" id="url" value="https://champ.hackers.com/?c=event&evt_id=19101100&_ga=2.204850389.478465722.1583923027-525690528.1583467994"><br/>
    Title입력:  <input type="text" id="title" value="해커스연구원"><br/>
  </form>
  <input type="button" value="네이버공유하기" onclick="naver_share()"/>
    <br />
    <div>
        <input type="text" placeholder="해커스연구원" id="title" />
        <input type="text" placeholder="해커스연구원해커스연구원해커스연구원해커스연구원" id="text" />
        <input type="text" placeholder="https://champ.hackers.com/?c=event&evt_id=19101100&_ga=2.204850389.478465722.1583923027-525690528.1583467994" id="url" />
        <input type="file" id="file" onClick="shareFiles" />
        <button onclick="share">Share</button>
    </div>
    <br />
    <script src="//developers.kakao.com/sdk/js/kakao.min.js"></script>
    <a id="kakao-link-btn" href="javascript:sendLink()">
      <img src="//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" width="50" height="50"/>
    </a>
    <script type='text/javascript'>
      Kakao.init('31c317dc87178e40d53515e3ce7b1930');
      function sendLink() {
        Kakao.Link.createDefaultButton({
          container: '#kakao-link-btn',
          objectType: 'feed',
          content: {
            title: {{ '해커스연구원' }},
            description: {{ "해커스연구원해커스연구원해커스연구원해커스연구원" }},
            imageUrl: '//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png',
            link: {
                mobileWebUrl: {{ .Permalink | absURL }},
                webUrl: {{ .Permalink | absURL}}
            }
          }
        });
      }
    </script>
    
</body>
</html>
`;


const ModalShare = (props) => {
    
    const {jsOptions, onSelected,onError, ...otherProps} = props;
    
    const injectedJavaScript = React.useMemo(() => `initOnReady(${JSON.stringify(jsOptions)});void(0);`, [jsOptions]);

    const onMessage = React.useCallback(({nativeEvent}) => {  
    }, [onSelected]);

    passValues= () =>{                
        let data = {
            movieurl :'http://mvod.hackers.co.kr/champstudymobile/wmv/sample_movie/5566_s.mp4'
        }
        console.log("Platform.OS",Platform.OS);
        //this.appWebview.postMessage(JSON.stringify(data));        
               
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

export default ModalShare;