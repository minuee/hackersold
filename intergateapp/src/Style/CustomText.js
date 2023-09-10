import React from 'react';
import { StyleSheet, Text  } from 'react-native';

import  * as getDEFAULT_CONSTANTS   from '../Constants';
const DEFAULT_CONSTANTS = getDEFAULT_CONSTANTS.DEFAULT_CONSTANTS;


export const CustomText = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.text,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textLight,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextDL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textDemiLight,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextM = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textMedium,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextR = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textregular,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}
export const CustomTextB = ( props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.textbold,style, (style && style.fontSize) && {lineHeight: style.fontSize * 1.42}]} {...otherProps}>{props.children}</Text>
    )
}


export const TextRobotoL = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoLight,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoR = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoRegular,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoM = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoMedium,style]} {...otherProps}>{props.children}</Text>
    )
}
export const TextRobotoB = (props) => {
    const {style, ...otherProps} = props;
    return (
        <Text style={[styles.robotoBold,style]} {...otherProps}>{props.children}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamily
    },
    textLight: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyLight
    },
    textDemiLight: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyDemiLight
    },
    textMedium: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyMedium
    },
    textregular: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyRegular
    },
    textbold: {
        fontFamily: DEFAULT_CONSTANTS.defaultFontFamilyBold
    },
    robotoLight: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyLight
    },
    robotoMedium: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyMedium
    },
    robotoRegular: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyRegular
    },
    robotoBold: {
        fontFamily: DEFAULT_CONSTANTS.robotoFontFamilyBold
    },
});