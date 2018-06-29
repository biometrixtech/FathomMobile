/**
 * UserSports
 *
    <UserSports
        addAnotherSeason={addAnotherSeason}
        addAnotherSport={addAnotherSport}
        handleFormChange={handleSportsFormChange}
        handleSeasonChange={handleSeasonChange}
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

// import components
import { UserSportSeason } from './';

// import third-party libraries
import RNPickerSelect from 'react-native-picker-select';

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
    wrapper: {},
});

/* Component ==================================================================== */
const UserSports = ({
    addAnotherSeason,
    addAnotherSport,
    handleFormChange,
    handleSeasonChange,
    sports,
}) => (
    sports.map((sport, i) => {
        return(
            <View key={i} style={[styles.wrapper]}>
                <View style={[styles.textWrapper]}>
                    <Text style={[styles.text]}>{`Sport #${i+1}`}</Text>
                </View>
                <View style={[styles.inlineWrapper]}>
                    <View style={[styles.leftItem]}>
                        <FormLabel>{'Sport'}</FormLabel>
                        <RNPickerSelect
                            hideIcon={true}
                            items={UserAccountConstants.sports}
                            onValueChange={(value) => handleFormChange(i, 'sport', value)}
                            placeholder={{
                                label: 'Select a Sport...',
                                value: null,
                            }}
                            style={{inputIOS: [styles.reusableCustomSpacing, styles.pickerSelectIOS]}}
                            value={sport.sport}
                        />
                    </View>
                    <View style={[styles.rightItem]}>
                        <FormLabel>{'Years of Playing'}</FormLabel>
                        <FormInput
                            containerStyle={{height: 30, marginLeft: 0, paddingLeft: 20}}
                            keyboardType={'numeric'}
                            onChangeText={(text) => handleFormChange(i, 'yearsInSport', text)}
                            returnKeyType={'next'}
                            value={sport.yearsInSport}
                        />
                    </View>
                </View>
                { sport.seasons.map((season, index) =>
                    <UserSportSeason
                        handleSeasonChange={handleSeasonChange}
                        index={{season: index, sport: i}}
                        key={index}
                        season={season}
                        sport={sport}
                    />
                )}
                <TouchableOpacity onPress={() => addAnotherSeason(i)} style={[styles.textWrapper]}>
                    <Text style={[styles.text, {paddingLeft: 20}]}>{'+ ADD ANOTHER SEASON'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addAnotherSport(i)} style={[styles.textWrapper]}>
                    <Text style={[styles.text, {paddingLeft: 20}]}>{'+ ADD ANOTHER SPORT'}</Text>
                </TouchableOpacity>
            </View>
        )
    })
);

UserSports.propTypes = {
    addAnotherSeason:   PropTypes.func.isRequired,
    addAnotherSport:    PropTypes.func.isRequired,
    handleFormChange:   PropTypes.func.isRequired,
    handleSeasonChange: PropTypes.func.isRequired,
    sports:             PropTypes.array.isRequired,
};
UserSports.defaultProps = {};
UserSports.componentName = 'UserSports';

/* Export Component ==================================================================== */
export default UserSports;
