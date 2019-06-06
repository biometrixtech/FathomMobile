/**
 * GoalPill
 *
     <GoalPill
         isSelected={goal.isSelected}
         key={key}
         onPress={() => this._toggleRecoveryGoal(key)}
         text={goal.text}
     />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    goalPillWrapper: {
        borderColor:       AppColors.white,
        borderRadius:      20,
        borderWidth:       1,
        marginBottom:      AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingXSml,
    },
});

/* Component ==================================================================== */
class GoalPill extends Component {
    constructor(props) {
        super(props);
        this._animatedValue = props.isSelected ? new Animated.Value(1) : new Animated.Value(0);
    }

    componentDidUpdate = prevProps => {
        if(prevProps.isSelected !== this.props.isSelected && this.props.isSelected) {
            Animated.timing(this._animatedValue, {
                duration: 250,
                toValue:  1,
            }).start();
        } else if(prevProps.isSelected !== this.props.isSelected && !this.props.isSelected) {
            Animated.timing(this._animatedValue, {
                duration: 250,
                toValue:  0,
            }).start();
        }
    }

    render = () => {
        const { isSelected, onPress, text, } = this.props;
        const interpolateRotation = this._animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '45deg'],
        });
        const animatedStyle = {transform: [{rotate: interpolateRotation,}]};
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                style={[customStyles.goalPillWrapper, {backgroundColor: isSelected ? AppColors.white : AppColors.transparent,}]}
            >
                <View style={{alignItems: 'center', flexDirection: 'row',}}>
                    <Text
                        robotoBold
                        style={{
                            color:        isSelected ? AppColors.zeplin.slate : AppColors.white,
                            fontSize:     AppFonts.scaleFont(14),
                            paddingRight: AppSizes.paddingSml,
                        }}
                    >
                        {text}
                    </Text>
                    <Animated.View style={[animatedStyle,]}>
                        <TabIcon
                            color={isSelected ? AppColors.zeplin.slate : AppColors.white}
                            icon={'add'}
                            size={AppFonts.scaleFont(20)}
                        />
                    </Animated.View>
                </View>
            </TouchableOpacity>
        )
    }
}

GoalPill.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onPress:    PropTypes.func.isRequired,
    text:       PropTypes.string.isRequired,
};

GoalPill.defaultProps = {};

GoalPill.componentName = 'GoalPill';

/* Export Component ================================================================== */
export default GoalPill;