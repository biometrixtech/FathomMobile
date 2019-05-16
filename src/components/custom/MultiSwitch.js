// inspiration from https://github.com/victorkvarghese/rn-slider-switch
/**
 * MultiSwitch
 *
    <MultiSwitch
        buttons={[]} // must be array of length 3 for now
        isDisabled={!firstExerciseFound}
        onStatusChanged={selectedIndex => this.setState({ priority: selectedIndex, })}
        selectedIndex={priority}
    />
 *
 */
import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// import third-party libraries
import _ from 'lodash';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// consts and custom components
import { AppColors, AppFonts, AppSizes, } from '../../constants';
import { Text, } from './';

// setup variables
const { width, } = Dimensions.get('window');
const Metrics = {
    containerWidth: (width - AppSizes.paddingLrg),
    switchWidth:    (width / 2.7),
};

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    buttonStyle: {
        alignItems:     'center',
        flex:           1,
        height:         30,
        justifyContent: 'center',
        width:          Metrics.containerWidth / 3,
    },
    container: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.superLight,
        borderRadius:    20,
        flexDirection:   'row',
        height:          30,
        justifyContent:  'center',
        marginVertical:  5,
        width:           Metrics.containerWidth,
    },
    containerWrapper: {
        height: 40,
    },
    switcher: {
        alignItems:      'center',
        backgroundColor: AppColors.zeplin.yellow,
        borderRadius:    20,
        elevation:       4,
        flexDirection:   'row',
        height:          40,
        justifyContent:  'center',
        left:            0,
        position:        'absolute',
        shadowColor:     AppColors.black,
        shadowOpacity:   0.31,
        shadowRadius:    10,
        top:             0,
        width:           Metrics.switchWidth,
    },
});

/* Component ==================================================================== */
export default class MultiSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStatus:     props.currentStatus,
            duration:          100,
            isComponentReady:  false,
            isPanning:         false,
            mainWidth:         (width - 30),
            posValue:          0,
            position:          new Animated.Value(0),
            selectedPosition:  props.selectedIndex,
            switcherWidth:     (width / 2.7),
            thresholdDistance: (width - 8 - width / 2.4),
        };
        this.isParentScrollDisabled = false;
    }

    componentWillMount = () => {
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant:         () => {
                // disable parent scroll if slider is inside a scrollview
                if (!this.isParentScrollDisabled) {
                    this.props.disableScroll(false);
                    this.isParentScrollDisabled = true;
                }
                this.setState({ isPanning: true, });
            },
            onPanResponderMove: (evt, gestureState) => {
                if (!this.props.disableSwitch) {
                    let finalValue = gestureState.dx + this.state.posValue;
                    if (finalValue >= 0 && finalValue <= this.state.thresholdDistance) {
                        this.state.position.setValue(this.state.posValue + gestureState.dx);
                    }
                }
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderRelease:            (evt, gestureState) => {
                if (!this.props.disableSwitch) {
                    let finalValue = gestureState.dx + this.state.posValue;
                    this.isParentScrollDisabled = false;
                    this.props.disableScroll(true);
                    if (gestureState.dx > 0) {
                        if (finalValue >= 0 && finalValue <= 30) {
                            this._onStatusChanged(0);
                        } else if (finalValue >= 30 && finalValue <= 121) {
                            this._onStatusChanged(1);
                        } else if (finalValue >= 121 && finalValue <= 280) {
                            if (gestureState.dx > 0) {
                                this._onStatusChanged(2);
                            } else {
                                this._onStatusChanged(1);
                            }
                        }
                    } else {
                        if (finalValue >= 78 && finalValue <= 175) {
                            this._onStatusChanged(1);
                        } else if (finalValue >= -100 && finalValue <= 78) {
                            this._onStatusChanged(0);
                        } else {
                            this._onStatusChanged(2);
                        }
                    }
                }
                this.setState({ isPanning: false, });
            },
            onPanResponderTerminate:      () => {},
            onShouldBlockNativeResponder: () => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
            onStartShouldSetPanResponder: () => false,
        });
        this._onStatusChanged(this.props.selectedIndex);
    }

    _onStatusChanged = index => {
        if (this.props.disableSwitch) { return; }
        if(index === 0) {
            Animated.timing(this.state.position, {
                duration: this.state.duration,
                toValue:  Platform.OS === 'ios' ? -2 : 0,
            }).start();
            setTimeout(() => {
                this.setState({
                    posValue:         Platform.OS === 'ios' ? -2 : 0,
                    selectedPosition: 0,
                });
            }, 100);
        } else if(index === 1) {
            Animated.timing(this.state.position, {
                duration: this.state.duration,
                toValue:  this.state.mainWidth / 2 - this.state.switcherWidth / 2,
            }).start();
            setTimeout(() => {
                this.setState({
                    posValue:         this.state.mainWidth / 2 - this.state.switcherWidth / 2,
                    selectedPosition: 1,
                });
            }, 100);
        } else if(index === 2) {
            Animated.timing(this.state.position, {
                duration: this.state.duration,
                toValue:  this.state.mainWidth - this.state.switcherWidth,
            }).start();
            setTimeout(() => {
                this.setState({
                    posValue:         this.state.mainWidth - this.state.switcherWidth,
                    selectedPosition: 2,
                });
            }, 100);
        }
        this.setState(
            { selectedPosition: index, },
            () => {
                const options = {
                    enableVibrateFallback:       false,
                    ignoreAndroidSystemSettings: false,
                };
                ReactNativeHapticFeedback.trigger('impactMedium', options);
                this.props.onStatusChanged(index);
            },
        );
    }

    render = () => {
        const { buttons, isDisabled, selectedIndex, } = this.props;
        const { isPanning, } = this.state;
        return (
            <View style={styles.containerWrapper}>
                <View style={styles.container}>
                    {_.map(buttons, (button, index) =>
                        <TouchableOpacity
                            key={index}
                            onPress={() => this._onStatusChanged(index)}
                            style={styles.buttonStyle}
                        >
                            <Text robotoRegular style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(12),}}>{button}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <Animated.View
                    {...this._panResponder.panHandlers}
                    style={[
                        styles.switcher,
                        {transform: [{ translateX: this.state.position, }]},
                        isPanning ? {backgroundColor: 'rgba(235, 186, 45, 0.75)',} : {},
                        isDisabled ? {backgroundColor: AppColors.zeplin.slate,} : {},
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {}}
                        style={styles.buttonStyle}
                    >
                        { !isPanning &&
                            <Text robotoBold style={{color: AppColors.white, fontSize: AppFonts.scaleFont(15),}}>{buttons[selectedIndex]}</Text>
                        }
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
}

MultiSwitch.propTypes = {
    buttons:         PropTypes.array.isRequired,
    disableScroll:   PropTypes.func,
    disableSwitch:   PropTypes.bool,
    isDisabled:      PropTypes.bool,
    onStatusChanged: PropTypes.func.isRequired,
    selectedIndex:   PropTypes.number,
};

MultiSwitch.defaultProps = {
    disableScroll: () => {},
    disableSwitch: false,
    isDisabled:    false,
    selectedIndex: 1,
};