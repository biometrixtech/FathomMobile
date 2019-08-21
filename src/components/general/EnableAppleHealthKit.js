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

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';

// Components
import { Button, FathomModal, Spacer, Text, } from '../custom';

const healthKitText = 'Sync with Apple Health to improve recovery recommendations by tracking your workouts.\n\nPlease tap \'All Categories On\' to allow.';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    imageBackgroundStyle: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flex:            1,
        justifyContent:  'center',
    },
});
/* Component ==================================================================== */
const EnableAppleHealthKit = ({
    handleEnableAppleHealthKit,
    handleSkip,
    isLoading,
    isModalOpen,
}) => (
    <FathomModal
        isVisible={isModalOpen}
    >
        <View style={{flex: 1,}}>
            <ImageBackground
                source={require('../../../assets/images/standard/tutorial_background_white.png')}
                style={[styles.imageBackgroundStyle]}
            >
                <View style={{flex: 1, justifyContent: 'space-between', paddingTop: AppSizes.statusBarHeight,}}>
                    <View style={{flex: 1,}}>
                        <TouchableHighlight
                            onPress={() => isLoading ? null : handleSkip('apple_healthkit')}
                            style={{paddingVertical: AppSizes.paddingMed,}}
                            underlayColor={AppColors.transparent}
                        >
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), textAlign: 'right',}}>{'Not now'}</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{flex: 9, justifyContent: 'space-between', marginBottom: AppSizes.iphoneXBottomBarPadding, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.padding,}}>
                        <Text oswaldMedium style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(40), textAlign: 'center',}}>{'APPLE HEALTH'}</Text>
                        <Spacer size={AppSizes.paddingSml} />
                        <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(15), textAlign: 'center',}}>{healthKitText}</Text>
                        <Spacer size={AppSizes.paddingSml} />
                        <View style={{alignItems: 'center', flex: 6, justifyContent: 'flex-end', marginVertical: AppSizes.paddingSml,}}>
                            <Image
                                resizeMode={'contain'}
                                source={require('../../../assets/images/standard/HealthKit_iOS.png')}
                                style={{height: '90%', marginHorizontal: AppSizes.padding, width: '100%',}}
                            />
                        </View>
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Button
                                buttonStyle={{backgroundColor: AppColors.zeplin.yellow, borderRadius: AppSizes.paddingLrg, paddingHorizontal: AppSizes.padding, paddingVertical: AppSizes.paddingMed, width: '100%',}}
                                containerStyle={{width: AppSizes.screen.widthTwoThirds,}}
                                onPress={() => !isLoading ? handleEnableAppleHealthKit('apple_healthkit', true) : {}}
                                raised={true}
                                title={'Enable Apple Health'}
                                titleStyle={{...AppStyles.robotoRegular, color: AppColors.white, fontSize: AppFonts.scaleFont(22), width: '100%',}}
                            />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    </FathomModal>
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
