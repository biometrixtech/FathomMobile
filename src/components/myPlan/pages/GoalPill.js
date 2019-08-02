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
import { Animated, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

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
        this.state = {
            androidStyle: {
                transform: [{rotate: '45deg',}],
            },
        };
        this._animatedValue = props.isSelected ? new Animated.Value(1) : new Animated.Value(0);
    }

    componentDidUpdate = prevProps => {
        if(prevProps.isSelected !== this.props.isSelected && this.props.isSelected) {
            if(Platform.OS === 'ios') {
                Animated.timing(this._animatedValue, {
                    duration: 250,
                    toValue:  1,
                }).start();
            } else {
                this.setState({ androidStyle: { transform: [{rotate: '45deg',}], }, });
            }
        } else if(prevProps.isSelected !== this.props.isSelected && !this.props.isSelected) {
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
        const { isSelected, onPress, text, } = this.props;
        const interpolateRotation = this._animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '45deg'],
        });
        const animatedStyle = Platform.OS === 'ios' ? {transform: [{rotate: interpolateRotation,}]} : this.state.androidStyle;
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
                    { Platform.OS === 'ios' ?
                        <Animated.View style={[animatedStyle,]}>
                            <TabIcon
                                color={isSelected ? AppColors.zeplin.slate : AppColors.white}
                                icon={'add'}
                                size={AppFonts.scaleFont(20)}
                            />
                        </Animated.View>
                        :
                        <View style={[animatedStyle,]}>
                            <TabIcon
                                color={isSelected ? AppColors.zeplin.slate : AppColors.white}
                                icon={'add'}
                                size={AppFonts.scaleFont(20)}
                            />
                        </View>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}

GoalPill.propTypes = {
    isSelected: PropTypes.bool.isRequired,
    onPress:    PropTypes.func.isRequired,
    text:       PropTypes.string,
};

GoalPill.defaultProps = {
    text: '',
};

GoalPill.componentName = 'GoalPill';

/* Export Component ================================================================== */
export default GoalPill;