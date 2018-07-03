/**
 * UserSports
 *
    <UserSports
        addAnotherSport={addAnotherSport}
        handleFormChange={handleSportsFormChange}
        sports={user.sports}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, UserAccount as UserAccountConstants } from '../../../constants';
import { FormInput, FormLabel, Text } from '../../custom';

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
});

/* Component ==================================================================== */
const UserSports = ({
    addAnotherSport,
    handleFormChange,
    sports,
}) => (
    sports.map((sport, i) => {
        return(
            <View key={i}>
                <View style={[styles.textWrapper]}>
                    <Text style={[styles.text]}>{`Sport #${i+1}`}</Text>
                </View>
                <View style={[styles.inlineWrapper]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel>{'Sport'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.sports}
                            onValueChange={(value) => handleFormChange(i, 'name', value)}
                            placeholder={{
                                label: 'Select a Sport...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
                            value={sport.name}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel>{'Level of Play'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.levelsOfPlay}
                            onValueChange={(value) => handleFormChange(i, 'competition_level', value)}
                            placeholder={{
                                label: 'Select a Level...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
                            value={sport.competition_level}
                        />
                    </View>
                </View>
                <FormLabel>{'Positions'}</FormLabel>
                <View style={styles.multiSelect}>
                    <SectionedMultiSelect
                        displayKey={'label'}
                        items={sport.name.length > 0 ? UserAccountConstants.positions[sport.name] : []}
                        onSelectedItemsChange={item => handleFormChange(i, 'positions', item)}
                        selectedItems={sport.positions}
                        selectText={'Select Positions...'}
                        showCancelButton={true}
                        uniqueKey={'value'}
                    />
                </View>
                <View style={[styles.inlineWrapper]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel>{'Start Date'}</FormLabel>
                        <DatePicker
                            cancelBtnText={'Cancel'}
                            confirmBtnText={'Confirm'}
                            customStyles={{dateInput: styles.reusableCustomSpacing}}
                            date={sport.start_date}
                            format={'MM/DD/YYYY'}
                            mode={'date'}
                            onDateChange={(date) => handleFormChange(i, 'start_date', date)}
                            showIcon={false}
                            style={{width: '100%'}}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel>{'End Date'}</FormLabel>
                        <DatePicker
                            cancelBtnText={'Cancel'}
                            confirmBtnText={'Confirm'}
                            customStyles={{dateInput: styles.reusableCustomSpacing}}
                            date={sport.end_date}
                            format={'MM/DD/YYYY'}
                            mode={'date'}
                            onDateChange={(date) => handleFormChange(i, 'end_date', date)}
                            showIcon={false}
                            style={{width: '100%'}}
                        />
                    </View>
                </View>
                <View style={[styles.inlineWrapper]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel>{'Season Start Month'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.seasonStartEndMonths}
                            onValueChange={(value) => handleFormChange(i, 'season_start_month', value)}
                            placeholder={{
                                label: 'Select Season Start Month...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
                            value={sport.season_start_month}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel>{'Season End Month'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={
                                sport.season_start_month.length > 0 ?
                                    UserAccountConstants.seasonStartEndMonths.slice(UserAccountConstants.seasonStartEndMonths.findIndex(month => month.value === sport.season_start_month) + 1)
                                    :
                                    []
                            }
                            onValueChange={(value) => handleFormChange(i, 'season_end_month', value)}
                            placeholder={{
                                label: 'Select Season End Month...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
                            value={sport.season_end_month}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => addAnotherSport(i)} style={[styles.textWrapper]}>
                    <Text style={[styles.text, {paddingLeft: 20}]}>{'+ ADD ANOTHER SPORT'}</Text>
                </TouchableOpacity>
            </View>
        )
    })
);

UserSports.propTypes = {
    addAnotherSport:    PropTypes.func.isRequired,
    handleFormChange:   PropTypes.func.isRequired,
    sports:             PropTypes.array.isRequired,
};
UserSports.defaultProps = {};
UserSports.componentName = 'UserSports';

/* Export Component ==================================================================== */
export default UserSports;
