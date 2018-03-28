import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

export default function styleConstructor(theme={}) {
    const appStyle = {...defaultStyle, ...theme};
    return StyleSheet.create({
        base: {
            alignItems: 'center'
        },
        text: {
            marginTop: 4,
        },
        alignedText: {
            marginTop: Platform.OS === 'android' ? 4 : 6
        },
        selected: {
            backgroundColor: appStyle.selectedDayBackgroundColor,
            borderRadius:    16
        },
        todayText: {
            color: appStyle.todayTextColor
        },
        selectedText: {
            color: appStyle.selectedDayTextColor
        },
        disabledText: {
            color: appStyle.textDisabledColor
        },
        dot: {
            width:        4,
            height:       4,
            marginTop:    1,
            borderRadius: 2,
            opacity:      0
        },
        visibleDot: {
            opacity:         1,
            backgroundColor: appStyle.dotColor
        },
        selectedDot: {
            backgroundColor: appStyle.selectedDotColor
        },
        ...(theme[STYLESHEET_ID] || {})
    });
}
