/**
 * Custom CalendarStrip
 *
    <CalendarStrip icon={'search'} selected={false} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

import { AppColors } from '@constants';

// import third-party libraries
import CalendarStrip from 'react-native-calendar-strip';

/* Component ==================================================================== */
const CustomCalendarStrip = ({ onDateSelected }) => (
    <CalendarStrip
        calendarAnimation={{type: 'sequence', duration: 30}}
        calendarColor={'#7743CE'}
        calendarHeaderStyle={{color: AppColors.white}}
        dateNameStyle={{color: AppColors.white}}
        dateNumberStyle={{color: AppColors.white}}
        // datesBlacklist={this.state.datesBlacklist}
        // datesWhitelist={this.state.datesWhitelist}
        daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: AppColors.white}}
        disabledDateNameStyle={{color: 'grey'}}
        disabledDateNumberStyle={{color: 'grey'}}
        highlightDateNameStyle={{color: 'yellow'}}
        highlightDateNumberStyle={{color: 'yellow'}}
        iconContainer={{flex: 0.1}}
        // iconLeft={require('./img/left-arrow.png')}
        // iconRight={require('./img/right-arrow.png')}
        onDateSelected={onDateSelected}
        // showMonth={false}
        style={{height: 100, paddingTop: 20, paddingBottom: 10}}
    />
);

CustomCalendarStrip.propTypes = {
    onDateSelected: PropTypes.func.isRequired,
};
CustomCalendarStrip.defaultProps = {
};

/* Export Component ==================================================================== */
export default CustomCalendarStrip;