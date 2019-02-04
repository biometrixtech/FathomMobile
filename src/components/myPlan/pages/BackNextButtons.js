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
import { Button, TabIcon, Text, } from '../../custom';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    backNextWrapper: {
        alignItems:        'center',
        flexDirection:     'row',
        justifyContent:    'space-between',
        paddingBottom:     AppSizes.paddingMed,
        paddingHorizontal: AppSizes.paddingMed,
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
    <View style={[styles.backNextWrapper]}>
        { showAddBtn ?
            <Button
                backgroundColor={AppColors.white}
                buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontal, {borderColor: AppColors.zeplin.yellow, borderWidth: 1, justifyContent: 'center',}]}
                color={isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey}
                containerViewStyle={{alignItems: 'center', flex: 1, justifyContent: 'center',}}
                disabled={!isValid}
                disabledStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.lightGrey, borderWidth: 1,}}
                fontFamily={AppStyles.robotoMedium.fontFamily}
                fontWeight={AppStyles.robotoMedium.fontWeight}
                leftIcon={{
                    color: isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey,
                    name:  'add',
                    size:  AppFonts.scaleFont(18),
                }}
                onPress={() => isValid && onBackClick ? onBackClick() : null}
                raised={false}
                textColor={isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey}
                textStyle={{fontSize: AppFonts.scaleFont(14), textAlign: 'center', width: '100%',}}
                title={'Add another session'}
            />
            : showBackBtn ?
                <TouchableHighlight
                    onPress={onBackClick}
                    style={[AppStyles.backNextCircleButtons, {
                        backgroundColor: AppColors.white,
                        borderColor:     AppColors.zeplin.yellow,
                        borderWidth:     1,
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
                <View />
        }
        { showSubmitBtn ?
            <Button
                backgroundColor={isValid ? AppColors.zeplin.yellow : AppColors.white}
                buttonStyle={[AppStyles.paddingVerticalSml, AppStyles.paddingHorizontal, {justifyContent: 'center',}]}
                color={isValid ? AppColors.white : AppColors.zeplin.lightGrey}
                containerViewStyle={{alignItems: 'center', flex: 1, justifyContent: 'center',}}
                disabled={!isValid}
                disabledStyle={{backgroundColor: AppColors.white, borderColor: AppColors.zeplin.lightGrey, borderWidth: 1,}}
                fontFamily={AppStyles.robotoMedium.fontFamily}
                fontWeight={AppStyles.robotoMedium.fontWeight}
                onPress={() => isValid && handleFormSubmit ? handleFormSubmit() : null}
                raised={false}
                textColor={isValid ? AppColors.white : AppColors.zeplin.lightGrey}
                textStyle={{backgroundColor: 'green', fontSize: AppFonts.scaleFont(14), textAlign: 'center', width: '100%',}}
                title={submitBtnText}
            />
            :
            <TouchableHighlight
                onPress={isValid ? onNextClick : null}
                style={[AppStyles.backNextCircleButtons, {
                    backgroundColor: isValid ? AppColors.zeplin.yellow : AppColors.white,
                    borderColor:     isValid ? AppColors.zeplin.yellow : AppColors.zeplin.lightGrey,
                    borderWidth:     1,
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