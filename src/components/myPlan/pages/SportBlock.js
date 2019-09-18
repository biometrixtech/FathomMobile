/**
 * SportBlock
 *
    <SportBlock
        displayName={'More options'}
        filteredSession={{icon: 'add', iconType: 'material',}}
        isSelected={functionalStrength.current_sport_name === newSportName}
        onPress={() => this.setState({
            delayTimerId: _.delay(() => this._scrollTo(this._moreOptionsRef, 10))
        })}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, TouchableOpacity, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    sportBlockWrapper: (isSelected, filteredSession) => ({
        alignItems:      'center',
        backgroundColor: isSelected ? AppColors.zeplin.yellow : AppColors.white,
        borderRadius:    10,
        elevation:       2,
        flexDirection:   'row',
        marginBottom:    AppSizes.paddingMed,
        padding:         filteredSession ? AppSizes.paddingSml : AppSizes.padding,
        shadowColor:     'rgba(49, 56, 59, 0.08)',
        shadowOffset:    {  height: 3, width: 0, },
        shadowOpacity:   1,
        shadowRadius:    16,
        width:           AppSizes.screen.widthTwoThirds,
    }),
});

/* Component ==================================================================== */
const SportBlock = ({ displayName, filteredSession, isSelected, onPress, }) => (
    <TouchableOpacity
        onPress={() => onPress()}
        style={[styles.sportBlockWrapper(isSelected, filteredSession),]}
    >
        { filteredSession && filteredSession.icon && filteredSession.iconType ?
            <TabIcon
                containerStyle={[{paddingRight: AppSizes.paddingSml,}]}
                color={isSelected ? AppColors.white : AppColors.zeplin.splashLight}
                icon={filteredSession.icon}
                reverse={false}
                size={32}
                type={filteredSession.iconType}
            />
            : filteredSession && filteredSession.imagePath ?
                <Image
                    source={filteredSession.imagePath}
                    style={{height: 32, marginRight: AppSizes.paddingSml, tintColor: isSelected ? AppColors.white : AppColors.zeplin.splashLight, width: 32,}}
                />
                :
                null
        }
        <Text robotoMedium style={{color: isSelected ? AppColors.white : AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15),}}>{displayName}</Text>
    </TouchableOpacity>
);

SportBlock.propTypes = {
    displayName:     PropTypes.string.isRequired,
    filteredSession: PropTypes.object,
    isSelected:      PropTypes.bool,
    onPress:         PropTypes.func.isRequired,
};

SportBlock.defaultProps = {
    filteredSession: null,
    isSelected:      false,
};

SportBlock.componentName = 'SportBlock';

/* Export Component ================================================================== */
export default SportBlock;