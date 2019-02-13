/**
 * BackNextButtons
 *
      <BackNextButtons
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
import { Platform, StyleSheet, TouchableHighlight, View, } from 'react-native';

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
        borderRadius:    5,
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
        borderRadius:   5,
        justifyContent: 'center',
        marginLeft:     Platform.OS === 'ios' ? AppSizes.paddingSml : (AppSizes.paddingSml / 2),
        marginRight:    Platform.OS === 'ios' ? AppSizes.paddingXSml : (AppSizes.paddingXSml / 2),
        width:          addSubmitBtnWidth,
    },
});

/* Component ==================================================================== */
const BackNextButtons = ({
    handleFormSubmit,
    isValid,
    onBackClick,
    onNextClick,
    showAddBtn,
    showBackBtn,
    showSubmitBtn,
    submitBtnText,
}) => (
    <View style={[showAddBtn && showSubmitBtn ? styles.addSubmitWrapper : styles.backNextWrapper,]}>
        { showAddBtn ?
            <TouchableHighlight
                onPress={() => isValid && onBackClick ? onBackClick() : null}
                style={[AppStyles.paddingVerticalSml, styles.addBtn]}
                underlayColor={AppColors.transparent}
            >
                <View style={{alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                    <TabIcon
                        color={isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey}
                        icon={'add'}
                        size={AppFonts.scaleFont(18)}
                        style={{paddingRight: AppSizes.paddingMed,}}
                    />
                    <Text
                        robotoMedium
                        style={[
                            AppStyles.textCenterAligned,
                            {
                                color:    AppColors.zeplin.yellow,
                                fontSize: AppFonts.scaleFont(14),
                            }
                        ]}
                    >
                        {'Add another session'}
                    </Text>
                </View>
            </TouchableHighlight>
            : showBackBtn ?
                <TouchableHighlight
                    onPress={onBackClick}
                    style={[AppStyles.backNextCircleButtons, {
                        backgroundColor: AppColors.white,
                        borderColor:     AppColors.zeplin.yellow,
                        borderWidth:     1,
                        marginLeft:      AppSizes.paddingMed,
                    }]}
                    underlayColor={AppColors.transparent}
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
                </TouchableHighlight>
                :
                <View style={{flex: 1,}} />
        }
        { showSubmitBtn ?
            <TouchableHighlight
                onPress={() => isValid && handleFormSubmit ? handleFormSubmit() : null}
                style={[
                    AppStyles.paddingVerticalSml,
                    styles.submitBtn,
                    showAddBtn ? {} : { marginRight: AppSizes.paddingMed, },
                    isValid ? {} : { borderColor: AppColors.zeplin.lightGrey, borderWidth: 1, },
                    { backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.white, }
                ]}
                underlayColor={AppColors.transparent}
            >
                <Text
                    robotoMedium
                    style={[
                        AppStyles.textCenterAligned,
                        {
                            color:    isValid ? AppColors.white : AppColors.zeplin.lightGrey,
                            fontSize: AppFonts.scaleFont(14),
                        }
                    ]}
                >
                    {submitBtnText}
                </Text>
            </TouchableHighlight>
            :
            <TouchableHighlight
                onPress={isValid ? onNextClick : null}
                style={[AppStyles.backNextCircleButtons, {
                    backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.white,
                    borderColor:     isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey,
                    borderWidth:     1,
                    marginRight:     AppSizes.paddingMed,
                }]}
                underlayColor={AppColors.transparent}
            >
                <Text
                    robotoMedium
                    style={[
                        AppStyles.textCenterAligned,
                        isValid ? styles.shadowEffect : {},
                        Platform.OS === 'ios' ? {} : {elevation: 2,},
                        {
                            color:    isValid ? AppColors.white : AppColors.zeplin.lightGrey,
                            fontSize: AppFonts.scaleFont(12),
                        }
                    ]}
                >
                    {'Next'}
                </Text>
            </TouchableHighlight>
        }
    </View>
);

BackNextButtons.propTypes = {
    handleFormSubmit: PropTypes.func,
    isValid:          PropTypes.bool.isRequired,
    onBackClick:      PropTypes.func,
    onNextClick:      PropTypes.func.isRequired,
    showAddBtn:       PropTypes.bool,
    showBackBtn:      PropTypes.bool,
    showSubmitBtn:    PropTypes.bool,
    submitBtnText:    PropTypes.string,
};

BackNextButtons.defaultProps = {
    handleFormSubmit: null,
    onBackClick:      null,
    showAddBtn:       false,
    showBackBtn:      false,
    showSubmitBtn:    false,
    submitBtnText:    'Submit',
};

BackNextButtons.componentName = 'BackNextButtons';

/* Export Component ================================================================== */
export default BackNextButtons;