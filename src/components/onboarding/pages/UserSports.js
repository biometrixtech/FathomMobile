/**
 * UserSports
 *
    <UserSports
        addAnotherSport={addAnotherSport}
        handleFormChange={handleSportsFormChange}
        removeSport={removeSport}
        sports={user.sports}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppStyles, UserAccount as UserAccountConstants } from '../../../constants';
import { Button, FormInput, FormLabel, TabIcon, Text } from '../../custom';
import { onboardingUtils } from '../../../constants/utils';

// import third-party libraries
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    androidViewContainer: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        height:            40,
        justifyContent:    'center',
        marginRight:       20,
        paddingLeft:       10,
        width:             '100%',
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
        borderColor:       AppColors.border,
        borderLeftWidth:   0,
        borderRightWidth:  0,
        borderTopWidth:    0,
        paddingLeft:       20,
    },
    rightItem: {
        borderLeftWidth: 1,
        borderLeftColor: AppColors.border,
        width:           '50%',
    },
    text: {
        color:      AppColors.primary.grey.hundredPercent,
        fontFamily: AppFonts.base.family,
        fontWeight: 'bold',
    },
    textWrapper: {
        alignItems:      'center',
        backgroundColor: '#F5F5F5',
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
    removeSport,
    sports,
}) => (
    sports.map((sport, i) => {
        return(
            <View key={i}>
                <View style={[AppStyles.row, styles.textWrapper]}>
                    <Text style={[styles.text]}>
                        {`SEASON ${onboardingUtils.numToWords(i+1).toUpperCase()}`}
                    </Text>
                    { i > 0 ?
                        <Button
                            backgroundColor={'#fff'}
                            small
                            onPress={() => removeSport(i)}
                            textColor={'#000'}
                            title={'X'}
                        />
                        :
                        null
                    }
                </View>
                <View style={[AppStyles.row]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel labelStyle={{color: AppColors.border}}>{'Sport'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.sports}
                            onValueChange={(value) => handleFormChange(i, 'name', value)}
                            placeholder={{
                                label: 'Select a Sport...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS], viewContainer: [styles.androidViewContainer] , inputAndroid: [styles.pickerSelectAndroid]}}
                            value={sport.name}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel labelStyle={{color: AppColors.border}}>{'Level of Play'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.levelsOfPlay}
                            onValueChange={(value) => handleFormChange(i, 'competition_level', value)}
                            placeholder={{
                                label: 'Select a Level...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS], viewContainer: [styles.androidViewContainer] , inputAndroid: [styles.pickerSelectAndroid]}}
                            value={sport.competition_level}
                        />
                    </View>
                </View>
                <FormLabel labelStyle={{color: AppColors.border}}>{'Positions'}</FormLabel>
                <View style={{borderBottomWidth: 1, borderBottomColor: AppColors.border}}>
                    <SectionedMultiSelect
                        displayKey={'label'}
                        items={sport.name.length > 0 ? UserAccountConstants.positions[sport.name] : []}
                        onSelectedItemsChange={item => handleFormChange(i, 'positions', item)}
                        selectedItems={sport.positions}
                        selectText={'Select sport position(s)...'}
                        selectToggleIconComponent={
                            <TabIcon
                                color={AppColors.border}
                                icon={'add'}
                                size={24}
                            />
                        }
                        showCancelButton={true}
                        styles={{
                            chipContainer: [{borderColor: AppColors.border}],
                        }}
                        uniqueKey={'value'}
                    />
                </View>
                <View style={[AppStyles.row]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel labelStyle={{color: AppColors.border}}>{'Start Date'}</FormLabel>
                        <DatePicker
                            cancelBtnText={'Cancel'}
                            confirmBtnText={'Confirm'}
                            customStyles={{dateInput: styles.reusableCustomSpacing}}
                            date={sport.start_date || ''}
                            format={'MM/DD/YYYY'}
                            mode={'date'}
                            onDateChange={(date) => handleFormChange(i, 'start_date', date)}
                            placeholder={' '}
                            showIcon={false}
                            style={{width: '100%'}}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel labelStyle={{color: AppColors.border}}>{'End Date'}</FormLabel>
                        <DatePicker
                            cancelBtnText={'Cancel'}
                            confirmBtnText={'Confirm'}
                            customStyles={{dateInput: styles.reusableCustomSpacing}}
                            date={sport.end_date || ''}
                            format={'MM/DD/YYYY'}
                            mode={'date'}
                            onDateChange={(date) => handleFormChange(i, 'end_date', date)}
                            placeholder={' '}
                            showIcon={false}
                            style={{width: '100%'}}
                        />
                    </View>
                </View>
                <Text
                    onPress={() => addAnotherSport(i)}
                    style={[AppStyles.paddingVertical, AppStyles.continueButton]}
                >{'+ ADD ANOTHER TRAINING SEASON'}</Text>
            </View>
        )
    })
);

UserSports.propTypes = {
    addAnotherSport:  PropTypes.func.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    removeSport:      PropTypes.func.isRequired,
    sports:           PropTypes.array.isRequired,
};
UserSports.defaultProps = {};
UserSports.componentNa = 'UserSports';

/* Export Component ================================================================== */
export default UserSports;
