import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
    const appStyle = {...defaultStyle, ...theme};
    return StyleSheet.create({
        container: {
            backgroundColor: appStyle.calendarBackground
        },
        week: {
            flexDirection:  'row',
            justifyContent: 'space-around'
        },
        ...(theme[STYLESHEET_ID] || {})
    });
}

