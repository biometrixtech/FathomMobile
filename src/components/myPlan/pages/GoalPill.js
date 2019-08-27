/**
 * GoalPill
 *
    <GoalPill
        extraStyles={{marginTop: AppSizes.paddingSml, marginRight: AppSizes.paddingSml,}}
        goal={goal}
        key={key}
        onPress={() => isSubmitting ? null : this._toggleGoal(key)}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';
import { PlanLogic, } from '../../../lib';

/* Styles ==================================================================== */
const customStyles = StyleSheet.create({
    goalPillWrapper: isSelected => ({
        backgroundColor:   isSelected ? AppColors.white : `${AppColors.white}${PlanLogic.returnHexOpacity(0.6)}`,
        borderRadius:      20,
        marginBottom:      AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingMed,
        paddingVertical:   AppSizes.paddingXSml,
    }),
    textStyle: isSelected => ({
        color:        AppColors.zeplin.splash,
        fontSize:     AppFonts.scaleFont(14),
        paddingRight: AppSizes.paddingSml,
    }),
});

/* Component ==================================================================== */
class GoalPill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            androidStyle: {
                transform: [{rotate: '45deg',}],
            },
        };
        this._animatedValue = props.goal.isSelected ? new Animated.Value(1) : new Animated.Value(0);
    }

    componentDidUpdate = prevProps => {
        if(prevProps.goal.isSelected !== this.props.goal.isSelected && this.props.goal.isSelected) {
            if(Platform.OS === 'ios') {
                Animated.timing(this._animatedValue, {
                    duration: 250,
                    toValue:  1,
                }).start();
            } else {
                this.setState({ androidStyle: { transform: [{rotate: '45deg',}], }, });
            }
        } else if(prevProps.goal.isSelected !== this.props.goal.isSelected && !this.props.goal.isSelected) {
            if(Platform.OS === 'ios') {
                Animated.timing(this._animatedValue, {
                    duration: 250,
                    toValue:  0,
                }).start();
            } else {
                this.setState({ androidStyle: { transform: [{rotate: '0deg',}], }, });
            }
        }
    }

    render = () => {
        const { extraStyles, goal, onPress, } = this.props;
        const interpolateRotation = this._animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '45deg'],
        });
        const animatedStyle = Platform.OS === 'ios' ? {transform: [{rotate: interpolateRotation,}]} : this.state.androidStyle;
        let imageSource = null;
        switch (goal.goal_type) {
        case 0:
            imageSource = require('../../../../assets/images/standard/care.png');
            break;
        case 1:
            imageSource = require('../../../../assets/images/standard/care.png');
            break;
        case 2:
            imageSource = require('../../../../assets/images/standard/care.png');
            break;
        case 6:
            imageSource = require('../../../../assets/images/standard/prevention.png');
            break;
        case 20:
            imageSource = require('../../../../assets/images/standard/recovery.png');
            break;
        case 21:
            imageSource = require('../../../../assets/images/standard/prevention.png')
            break;
        default:
            imageSource = null;
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                style={[
                    customStyles.goalPillWrapper(goal.isSelected),
                    extraStyles,
                ]}
            >
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                    { imageSource &&
                        <Image
                            source={imageSource}
                            style={{height: 15, marginRight: AppSizes.paddingSml, width: 15,}}
                        />
                    }
                    <Text
                        robotoBold
                        style={[customStyles.textStyle(goal.isSelected),]}
                    >
                        {goal.text}
                    </Text>
                    { Platform.OS === 'ios' ?
                        <Animated.View style={[animatedStyle,]}>
                            <TabIcon
                                color={AppColors.zeplin.splash}
                                icon={'add'}
                                size={AppFonts.scaleFont(20)}
                            />
                        </Animated.View>
                        :
                        <View style={[animatedStyle,]}>
                            <TabIcon
                                color={AppColors.zeplin.splash}
                                icon={'add'}
                                size={AppFonts.scaleFont(20)}
                            />
                        </View>
                    }
                </View>
            </TouchableOpacity>
        );
    }
}

GoalPill.propTypes = {
    extraStyles: PropTypes.object.isRequired,
    goal:        PropTypes.object.isRequired,
    onPress:     PropTypes.func.isRequired,
};

GoalPill.defaultProps = {
    text: '',
};

GoalPill.componentName = 'GoalPill';

/* Export Component ================================================================== */
export default GoalPill;