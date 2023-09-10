'use strict';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

import { StyleSheet, Platform, ViewPropTypes } from 'react-native';

import PropTypes from 'prop-types';

import { WebView } from 'react-native-webview';

import { reduceData, getWidth, isSizeChanged, shouldUpdate } from './utils';

const AutoHeightWebView = React.memo(
    forwardRef((props, ref) => {
        const { style, onMessage, onSizeUpdated, scrollEnabledWithZoomedin, scrollEnabled, injectedJavaScript } = props;

        let webView = useRef();
        useImperativeHandle(ref, () => ({
            stopLoading: () => webView.current.stopLoading(),
            goForward: () => webView.current.goForward(),
            goBack: () => webView.current.goBack(),
            reload: () => webView.current.reload(),
            injectJavaScript: script => webView.current.injectJavaScript(script)
        }));

        const [size, setSize] = useState({
            height: style && style.height ? style.height : 0,
            width: getWidth(style)
        });
        const [scrollable, setScrollable] = useState(false);
        const handleMessage = event => {
            //console.log('handleMessage', event.nativeEvent.data)
            onMessage && onMessage(event);
            /*
            if(onMessage) {
                onMessage(event);
                return;
            }
            */

            if (!event.nativeEvent) {
                return;
            }
            let data = {};
            // Sometimes the message is invalid JSON, so we ignore that case
            try {
                data = JSON.parse(event.nativeEvent.data);
            } catch (error) {
                console.error(error);
                return;
            }
            const { height, width, zoomedin } = data;
            !scrollEnabled && scrollEnabledWithZoomedin && setScrollable(!!zoomedin);
            const { height: previousHeight, width: previousWidth } = size;
            isSizeChanged({ height, previousHeight, width, previousWidth }) &&
            setSize({
                height,
                width
            });
        };

        const currentScrollEnabled = scrollEnabled === false && scrollEnabledWithZoomedin ? scrollable : scrollEnabled;

        const { currentSource, script } = reduceData(props);

        const { width, height } = size;
        useEffect(
            () =>
                onSizeUpdated &&
                onSizeUpdated({
                    height,
                    width
                }),
            [width, height, onSizeUpdated]
        );

        //console.log(script);

        return (
            <WebView
                {...props}
                ref={webView}
                onMessage={handleMessage}
                style={[
                    styles.webView,
                    {
                        width,
                        height
                    },
                    style
                ]}
                // 만약 자바스크립트 주입을 하는 경우, 아래 코드를 {script + injectedJavaScript}로 수정할 것
                injectedJavaScript={script}
                source={currentSource}
                scrollEnabled={currentScrollEnabled}
            />
        );
    }),
    (prevProps, nextProps) => !shouldUpdate({ prevProps, nextProps })
);

AutoHeightWebView.propTypes = {
    onSizeUpdated: PropTypes.func,
    files: PropTypes.arrayOf(
        PropTypes.shape({
            href: PropTypes.string,
            type: PropTypes.string,
            rel: PropTypes.string
        })
    ),
    style: ViewPropTypes.style,
    customScript: PropTypes.string,
    customStyle: PropTypes.string,
    viewportContent: PropTypes.string,
    scrollEnabledWithZoomedin: PropTypes.bool,
    // webview props
    originWhitelist: PropTypes.arrayOf(PropTypes.string),
    onMessage: PropTypes.func,
    scalesPageToFit: PropTypes.bool,
    source: PropTypes.object
};

let defaultProps = {
    showsVerticalScrollIndicator: false,
    showsHorizontalScrollIndicator: false,
    originWhitelist: ['*']
};

Platform.OS === 'android' &&
Object.assign(defaultProps, {
    scalesPageToFit: true
});

Platform.OS === 'ios' &&
Object.assign(defaultProps, {
    scalesPageToFit: true,
    viewportContent: 'width=device-width'
});

AutoHeightWebView.defaultProps = defaultProps;

const styles = StyleSheet.create({
    webView: {
        backgroundColor: 'transparent'
    }
});

export default AutoHeightWebView;