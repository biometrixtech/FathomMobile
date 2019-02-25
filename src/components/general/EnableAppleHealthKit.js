/**
 * Enable Apple HealthKit Screen
 *
    <EnableAppleHealthKit
        handleEnableAppleHealthKit={this._handleEnableAppleHealthKit}
        handleSkip={this._handleHealthKitSkip}
        isLoading={this.state.isAppleHealthKitLoading}
        isModalOpen={!user.first_time_experience.includes('apple_healthkit') && !user.health_enabled && Platform.OS === 'ios'}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, StyleSheet, TouchableHighlight, View, } from 'react-native';

// import third-party libraries
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Button, Spacer, Text, } from '../custom';

const healthKitText = 'Sync with Apple Health to improve recovery recommendations.\n\nPlease tap \'All Categories On\' to allow.';
// const healthKitText = 'Sync with Apple Health to improve recovery recommendations by tracking your workouts.\n\nPlease tap \'All Categories On\' to allow.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    imageBackgroundStyle: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flex:            1,
        justifyContent:  'center',
    },
    linearGradientStyle: {
        alignItems:        'center',
        alignSelf:         'stretch',
        flex:              1,
        overflow:          'visible',
        paddingHorizontal: 50,
        paddingVertical:   50,
    },
});
/* Component ==================================================================== */
const EnableAppleHealthKit = ({
    handleEnableAppleHealthKit,
    handleSkip,
    isLoading,
    isModalOpen,
}) => (
    <Modal
        backdropColor={AppColors.transparent}
        backdropOpacity={1}
        backdropPressToClose={false}
        coverScreen={true}
        isOpen={isModalOpen}
        swipeToClose={false}
        useNativeDriver={false}
    >
        <View style={{flex: 1,}}>
            <ImageBackground
                source={require('../../../assets/images/standard/start_page_background.png')}
                style={[styles.imageBackgroundStyle]}
            >
                <LinearGradient
                    colors={['#ffffff00', 'white']}
                    start={{x: 0.0, y: 0.0}}
                    end={{x: 0.0, y: 0.1}}
                    style={[styles.linearGradientStyle]}
                >
                    <View style={{flex: 1, justifyContent: 'space-between',}}>
                        <View style={{flex: 1,}}>
                            <TouchableHighlight
                                onPress={() => isLoading ? null : handleSkip('apple_healthkit')}
                                underlayColor={AppColors.transparent}
                            >
                                <Text robotoBold style={{color: AppColors.zeplin.lightSlate, fontSize: AppFonts.scaleFont(15), textAlign: 'right',}}>{'Skip'}</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex: 9, justifyContent: 'space-between', paddingVertical: AppSizes.padding,}}>
                            <Text oswaldMedium style={{color: AppColors.zeplin.seaBlue, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'APPLE HEALTH'}</Text>
                            <Spacer size={AppSizes.paddingSml} />
                            <Text robotoLight style={{color: AppColors.zeplin.darkSlate, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{healthKitText}</Text>
                            <Spacer size={AppSizes.paddingSml} />
                            <View style={{flex: 6, paddingVertical: AppSizes.paddingSml,}}>
                                <ImageBackground
                                    imageStyle={{resizeMode: 'contain',}}
                                    source={require('../../../assets/images/standard/HealthKit_iOS.png')}
                                    style={[{height: '100%', marginHorizontal: AppSizes.padding,}]}
                                >
                                    <LinearGradient
                                        colors={['#ffffff00', 'white']}
                                        start={{x: 0.0, y: 0.0}}
                                        end={{x: 0.0, y: 0.75}}
                                        style={[styles.linearGradientStyle, {justifyContent: 'flex-end', overflow: 'hidden',}]}
                                    />
                                    <Button
                                        backgroundColor={AppColors.zeplin.yellow}
                                        buttonStyle={{borderRadius: 5, width: '100%',}}
                                        containerViewStyle={{marginLeft: 0, marginRight: 0, width: '100%',}}
                                        color={AppColors.white}
                                        fontFamily={AppStyles.robotoBold.fontFamily}
                                        fontWeight={AppStyles.robotoBold.fontWeight}
                                        loading={isLoading}
                                        loadingRight={isLoading}
                                        outlined={false}
                                        onPress={() => {
                                            if(!isLoading) {
                                                handleEnableAppleHealthKit('apple_healthkit', true);
                                            }
                                        }}
                                        raised={false}
                                        textStyle={{ flex: 1, fontSize: AppFonts.scaleFont(16), textAlign: 'center', }}
                                        title={'Enable Apple Health'}
                                    />
                                </ImageBackground>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    </Modal>
)

EnableAppleHealthKit.propTypes = {
    handleEnableAppleHealthKit: PropTypes.func.isRequired,
    handleSkip:                 PropTypes.func.isRequired,
    isLoading:                  PropTypes.bool,
    isModalOpen:                PropTypes.bool.isRequired,
};

EnableAppleHealthKit.defaultProps = {
    isLoading: false,
};

EnableAppleHealthKit.componentName = 'EnableAppleHealthKit';

/* Export Component ==================================================================== */
export default EnableAppleHealthKit;
