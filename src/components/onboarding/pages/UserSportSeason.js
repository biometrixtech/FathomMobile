/**
 * UserSportSeason
 *
    <UserSportSeason
       handleSeasonChange={handleSeasonChange}
       index={{season: index, sport: i}}
       key={index}
       season={season}
       sport={sport}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, UserAccount as UserAccountConstants } from '../../../constants';
import { FormLabel, RadioButton, Text } from '../../custom';

// import third-party libraries
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    inlineWrapper: {
        flexDirection: 'row',
    },
    leftItem: {
        width: '50%',
    },
    multiSelect: {
        borderBottomWidth: 1,
        borderColor:       AppColors.primary.grey.thirtyPercent,
        paddingBottom:     10,
        paddingLeft:       10,
    },
    pickerSelectAndroid: {},
    pickerSelectIOS:     {
        height:         40,
        justifyContent: 'center',
    },
    reusableCustomSpacing: {
        alignItems:        'flex-start',
        borderBottomWidth: 1,
        borderColor:       AppColors.primary.grey.thirtyPercent,
        borderLeftWidth:   0,
        borderRightWidth:  0,
        borderTopWidth:    0,
        paddingLeft:       20,
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.primary.grey.thirtyPercent,
        width:           '50%',
    },
    text: {
        fontWeight: 'bold',
    },
    textWrapper: {
        alignItems:      'center',
        backgroundColor: AppColors.primary.grey.thirtyPercent,
        height:          50,
        justifyContent:  'center',
        marginTop:       10,
        width:           '100%',
    },
    wrapper: {},
});

/* Component ==================================================================== */
const UserSportSeason = ({ handleSeasonChange, index, season, sport }) => (
    <View>
        <View style={[styles.textWrapper]}>
            <Text style={[styles.text]}>{`Season #${index.season+1}`}</Text>
        </View>
        <FormLabel>{'Level of Play'}</FormLabel>
        <RNPickerSelect
            hideIcon={true}
            items={UserAccountConstants.levelsOfPlay}
            onValueChange={(value) => handleSeasonChange(index, 'levelOfPlay', value)}
            placeholder={{
                label: 'Select a Level...',
                value: null,
            }}
            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
            value={season.levelOfPlay}
        />
        <FormLabel>{'Position'}</FormLabel>
        <View style={styles.multiSelect}>
            <SectionedMultiSelect
                displayKey={'label'}
                items={sport.sport.length > 0 ? UserAccountConstants.positions[sport.sport] : []}
                onSelectedItemsChange={item => handleSeasonChange(index, 'positions', item)}
                selectedItems={season.positions}
                selectText={'Select Positions...'}
                showCancelButton={true}
                uniqueKey={'value'}
            />
        </View>
        <View style={[styles.inlineWrapper]}>
            <View style={[styles.leftItem]}>
                <FormLabel>{'Season Starts'}</FormLabel>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{dateInput: styles.reusableCustomSpacing}}
                    date={season.seasonStartDate}
                    format={'YYYY-MM-DD'}
                    mode={'date'}
                    onDateChange={(date) => handleSeasonChange(index, 'seasonStartDate', date)}
                    showIcon={false}
                    style={{width: '100%'}}
                />
            </View>
            <View style={[styles.rightItem]}>
                <FormLabel>{'Season Ends'}</FormLabel>
                <DatePicker
                    cancelBtnText={'Cancel'}
                    confirmBtnText={'Confirm'}
                    customStyles={{dateInput: styles.reusableCustomSpacing}}
                    date={season.seasonEndDate}
                    format={'YYYY-MM-DD'}
                    mode={'date'}
                    onDateChange={(date) => handleSeasonChange(index, 'seasonEndDate', date)}
                    showIcon={false}
                    style={{width: '100%'}}
                />
            </View>
        </View>
    </View>
);

UserSportSeason.propTypes = {
    handleSeasonChange: PropTypes.func.isRequired,
    index:              PropTypes.object.isRequired,
    season:             PropTypes.object.isRequired,
    sport:              PropTypes.object.isRequired,
};
UserSportSeason.defaultProps = {};
UserSportSeason.componentName = 'UserSportSeason';

/* Export Component ==================================================================== */
export default UserSportSeason;
