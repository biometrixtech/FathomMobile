/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 15:04:37 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-23 15:04:37 
 */

import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import { AppStyles } from '../../../../../theme/';

const STYLESHEET_ID = 'stylesheet.calendar.header';

export default function(theme={}) {
    const appStyle = {...defaultStyle, ...theme};
    return StyleSheet.create({
        header: {
            flexDirection: 'row',
        },
        arrow: {
            ...AppStyles.containerCentered,
            ...AppStyles.flex1
        },
        week: {
            marginTop:      7,
            flexDirection:  'row',
            justifyContent: 'space-around'
        },
        dayHeader: {
            marginTop:    2,
            marginBottom: 7,
            width:        32,
            textAlign:    'center',
            fontSize:     appStyle.textDayHeaderFontSize,
            fontFamily:   appStyle.textDayHeaderFontFamily,
            color:        appStyle.textSectionTitleColor
        },
        ...(theme[STYLESHEET_ID] || {})
    });
}
