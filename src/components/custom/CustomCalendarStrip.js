/**
 * CustomCalendarStrip
 *
    <CustomCalendarStrip />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
 import { StyleSheet, View } from 'react-native';

// import third-parties libraries
import CalendarStrip from 'react-native-calendar-strip';

// Consts
import { AppColors, } from '../../constants';
// import { AppFonts, AppStyles, } from '../../constants';

/* Styles ==================================================================== */
const styles = StyleSheet.create({});

/* Component ==================================================================== */
const CustomCalendarStrip = ({  }) => (
    <View>
        <CalendarStrip
            calendarAnimation={{type: 'sequence', duration: 30,}}
            daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white',}}
            style={{height: 100, paddingTop: 20, paddingBottom: 10,}}
            calendarHeaderStyle={{color: 'white',}}
            calendarColor={AppColors.transparent}
            dateNumberStyle={{color: AppColors.zeplin.slateLight,}}
            dateNameStyle={{color: AppColors.zeplin.slateLight,}}
            highlightDateNumberStyle={{color: AppColors.zeplin.slateLight,}}
            highlightDateNameStyle={{color: AppColors.zeplin.slateLight,}}
            // disabledDateNameStyle={{color: 'grey',}}
            // disabledDateNumberStyle={{color: 'grey',}}
            datesWhitelist={[{
                end:   new Date().addDays(3),  // total 4 days enabled
                start: new Date(),
            }]}
            datesBlacklist={[ new Date().addDays(1), ]}
            // iconLeft={require('./img/left-arrow.png')}
            // iconRight={require('./img/right-arrow.png')}
            iconContainer={{flex: 0.1,}}
            showDayName={false}
            showMonth={false}
            shouldAllowFontScaling={false}
        />
    </View>
)

CustomCalendarStrip.propTypes = {};

CustomCalendarStrip.defaultProps = {};

/* Export Component ==================================================================== */
export default CustomCalendarStrip;
