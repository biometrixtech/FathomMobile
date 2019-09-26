/**
 * BackNextButtons
 *
      <BackNextButtons
          addBtnText={'Add another session'}
          handleFormSubmit={() => handleFormSubmit()}
          isValid={isFormValidItems.willTrainLaterValid}
          onBackClick={() => this._renderNextPage(8, isFormValidItems, true, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, null, areaOfSorenessClicked)}
          onNextClick={() => this._renderNextPage(8, isFormValidItems, false, isFirstFunctionalStrength, isSecondFunctionalStrength)}
          showAddBtn={true}
          showSubmitBtn={!isSecondFunctionalStrength}
          submitBtnText={'Submit'}
      />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../../constants';
import { TabIcon, Text, } from '../../custom';

const addSubmitBtnWidth = Platform.OS === 'ios' ?
    ((AppSizes.screen.width - ((AppSizes.paddingSml * 2) + (AppSizes.paddingXSml * 2))) / 2)
    :
    ((AppSizes.screen.width - (AppSizes.paddingSml + AppSizes.paddingXSml)) / 2);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: AppColors.white,
        borderColor:     AppColors.zeplin.yellow,
        borderRadius:    AppSizes.paddingLrg,
        borderWidth:     1,
        marginLeft:      Platform.OS === 'ios' ? AppSizes.paddingSml : (AppSizes.paddingSml / 2),
        marginRight:     Platform.OS === 'ios' ? AppSizes.paddingXSml : (AppSizes.paddingXSml / 2),
        width:           addSubmitBtnWidth,
    },
    addSubmitWrapper: {
        flex:          1,
        flexDirection: 'row',
        paddingBottom: AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.paddingMed,
    },
    backNextWrapper: {
        alignItems:     'center',
        flexDirection:  'row',
        justifyContent: 'space-between',
        paddingBottom:  AppSizes.iphoneXBottomBarPadding > 0 ? AppSizes.iphoneXBottomBarPadding : AppSizes.paddingMed,
    },
    submitBtn: {
        borderRadius:   AppSizes.paddingLrg,
        justifyContent: 'center',
        marginLeft:     Platform.OS === 'ios' ? AppSizes.paddingSml : (AppSizes.paddingSml / 2),
        marginRight:    Platform.OS === 'ios' ? AppSizes.paddingXSml : (AppSizes.paddingXSml / 2),
        width:          addSubmitBtnWidth,
    },
});

/* Component ==================================================================== */
const BackNextButtons = ({
    addBtnText,
    handleFormSubmit,
    isSubmitBtnSubmitting,
    isValid,
    onBackClick,
    onNextClick,
    showAddBtn,
    showAddBtnDisabledStyle,
    showBackBtn,
    showBackIcon,
    showSubmitBtn,
    submitBtnText,
}) => (
    <View style={[showAddBtn && showSubmitBtn ? styles.addSubmitWrapper : styles.backNextWrapper,]}>
        { showAddBtn ?
            <TouchableOpacity
                onPress={() => isValid && onBackClick ? onBackClick() : null}
                style={[AppStyles.paddingVerticalSml, styles.addBtn, showAddBtnDisabledStyle ? {borderColor: AppColors.zeplin.slateXLight,} : {}]}
            >
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    { showBackIcon ?
                        <TabIcon
                            color={isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight}
                            icon={'add'}
                            size={AppFonts.scaleFont(18)}
                            style={{paddingRight: AppSizes.paddingMed,}}
                        />
                        :
                        null
                    }
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            {
                                color:    showAddBtnDisabledStyle ? AppColors.zeplin.slateXLight : AppColors.zeplin.yellow,
                                fontSize: AppFonts.scaleFont(14),
                            }
                        ]}
                    >
                        {addBtnText}
                    </Text>
                </View>
            </TouchableOpacity>
            : showBackBtn ?
                <TouchableOpacity
                    onPress={onBackClick}
                    style={[AppStyles.backNextCircleButtons, {
                        backgroundColor: AppColors.white,
                        borderColor:     AppColors.zeplin.yellow,
                        borderWidth:     1,
                        marginLeft:      AppSizes.paddingMed,
                    }]}
                >
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            {
                                color:    AppColors.zeplin.yellow,
                                fontSize: AppFonts.scaleFont(12),
                            }
                        ]}
                    >
                        {'Back'}
                    </Text>
                </TouchableOpacity>
                :
                <View style={{flex: 1,}} />
        }
        { showSubmitBtn ?
            <TouchableOpacity
                onPress={() => isValid && handleFormSubmit ? handleFormSubmit() : null}
                style={[
                    AppStyles.paddingVerticalSml,
                    styles.submitBtn,
                    showAddBtn ? {} : { marginRight: AppSizes.paddingMed, },
                    {
                        backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.white,
                        borderColor:     isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,
                        borderWidth:     1,
                    }
                ]}
            >
                <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                    { (Platform.OS === 'ios' && isSubmitBtnSubmitting) &&
                        <ActivityIndicator
                            color={AppColors.white}
                            size={'small'}
                        />
                    }
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            Platform.OS === 'ios' ? { lineHeight: 20, } : {},
                            {
                                color:      isValid ? AppColors.white : AppColors.zeplin.slateXLight,
                                fontSize:   AppFonts.scaleFont(14),
                                marginLeft: isSubmitBtnSubmitting ? AppSizes.paddingXSml : 0,
                            }
                        ]}
                    >
                        {submitBtnText}
                    </Text>
                </View>
            </TouchableOpacity>
            :
            <TouchableOpacity
                onPress={isValid ? onNextClick : null}
                style={[AppStyles.backNextCircleButtons, {
                    backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.white,
                    borderColor:     isValid ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight,
                    borderWidth:     1,
                    marginRight:     AppSizes.paddingMed,
                }]}
            >
                <Text
                    robotoMedium
                    style={[
                        AppStyles.textCenterAligned,
                        isValid ? styles.shadowEffect : {},
                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                        {
                            color:    isValid ? AppColors.white : AppColors.zeplin.slateXLight,
                            fontSize: AppFonts.scaleFont(12),
                        }
                    ]}
                >
                    {'Next'}
                </Text>
            </TouchableOpacity>
        }
    </View>
);

BackNextButtons.propTypes = {
    addBtnText:              PropTypes.string,
    handleFormSubmit:        PropTypes.func,
    isSubmitBtnSubmitting:   PropTypes.bool,
    isValid:                 PropTypes.bool.isRequired,
    onBackClick:             PropTypes.func,
    onNextClick:             PropTypes.func,
    showAddBtn:              PropTypes.bool,
    showAddBtnDisabledStyle: PropTypes.bool,
    showBackBtn:             PropTypes.bool,
    showBackIcon:            PropTypes.bool,
    showSubmitBtn:           PropTypes.bool,
    submitBtnText:           PropTypes.string,
};

BackNextButtons.defaultProps = {
    addBtnText:              'Add another session',
    handleFormSubmit:        null,
    isSubmitBtnSubmitting:   false,
    onBackClick:             null,
    onNextClick:             null,
    showAddBtn:              false,
    showAddBtnDisabledStyle: false,
    showBackBtn:             false,
    showBackIcon:            true,
    showSubmitBtn:           false,
    submitBtnText:           'Submit',
};

BackNextButtons.componentName = 'BackNextButtons';

/* Export Component ================================================================== */
export default BackNextButtons;