/**
 * ReadinessSurvey
 *
    <ReadinessSurvey
        dailyReadiness={this.state.dailyReadiness}
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleReadinessSurveySubmit}
        soreBodyParts={this.state.soreBodyParts}
        user={user}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants, AppSizes, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Text, } from '../../custom';

// Components
import { AreasOfSoreness, SoreBodyPart, } from './';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

/* Component ==================================================================== */
const ReadinessSurvey = ({
    dailyReadiness,
    handleAreaOfSorenessClick,
    handleFormChange,
    handleFormSubmit,
    soreBodyParts,
    user,
}) => {
    let hourOfDay = moment().get('hour');
    let partOfDay = hourOfDay >= 12 ? 'AFTERNOON' : 'MORNING';
    let isFormValid = _.filter(dailyReadiness.soreness, o => o.severity > 0 && o.severity).length > 0 || (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood);
    return(
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, alignItems: 'center', width: AppSizes.screen.width}}>
                    <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, AppStyles.paddingVerticalXLrg, {color: AppColors.black}]}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                </View>
                <View>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                        {'1'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {'How mentally ready do you feel for today?'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.secondary.blue.hundredPercent}]}>
                        {`${dailyReadiness.readiness + 1} - ${MyPlanConstants.overallReadiness[dailyReadiness.readiness].toUpperCase()}`}
                    </Text>
                    <FathomSlider
                        handleFormChange={handleFormChange}
                        maximumValue={9}
                        minimumValue={0}
                        name={'readiness'}
                        value={dailyReadiness.readiness}
                    />
                </View>
                <View>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                        {'2'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {'How well did you sleep last night?'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.secondary.blue.hundredPercent}]}>
                        {`${dailyReadiness.sleep_quality + 1} - ${MyPlanConstants.sleepQuality[dailyReadiness.sleep_quality].toUpperCase()}`}
                    </Text>
                    <FathomSlider
                        handleFormChange={handleFormChange}
                        maximumValue={9}
                        minimumValue={0}
                        name={'sleep_quality'}
                        value={dailyReadiness.sleep_quality}
                    />
                </View>
                { _.map(soreBodyParts.body_parts, (bodyPart, i) =>
                    <SoreBodyPart
                        bodyPart={bodyPart}
                        bodyPartSide={bodyPart.side}
                        handleFormChange={handleFormChange}
                        index={i+3}
                        isPrevSoreness={true}
                        key={i}
                        surveyObject={dailyReadiness}
                    />
                )}
                <View>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                        {soreBodyParts.body_parts && soreBodyParts.body_parts.length > 0 ? soreBodyParts.body_parts.length + 3 : '3'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {`Is anything ${soreBodyParts.body_parts && soreBodyParts.body_parts.length > 0 ? 'else' : ''} bothering you?`}
                    </Text>
                    <AreasOfSoreness
                        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, true, isAllGood)}
                        handleFormChange={handleFormChange}
                        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                        soreBodyParts={soreBodyParts}
                        soreBodyPartsState={dailyReadiness.soreness}
                        surveyObject={dailyReadiness}
                    />
                </View>
                { isFormValid ?
                    <Button
                        backgroundColor={AppColors.primary.yellow.hundredPercent}
                        buttonStyle={{
                            alignSelf:       'center',
                            borderRadius:    5,
                            marginBottom:    AppSizes.padding,
                            paddingVertical: AppSizes.paddingMed,
                            width:           AppSizes.screen.widthTwoThirds
                        }}
                        color={AppColors.white}
                        fontFamily={AppStyles.robotoMedium.fontFamily}
                        fontWeight={AppStyles.robotoMedium.fontWeight}
                        onPress={handleFormSubmit}
                        raised={false}
                        textStyle={{ fontSize: AppFonts.scaleFont(18) }}
                        title={'Continue'}
                    />
                    :
                    <Button
                        backgroundColor={AppColors.white}
                        buttonStyle={{
                            alignSelf:       'center',
                            borderRadius:    5,
                            marginBottom:    AppSizes.padding,
                            paddingVertical: AppSizes.paddingMed,
                            width:           AppSizes.screen.widthTwoThirds
                        }}
                        color={AppColors.zeplin.lightGrey}
                        fontFamily={AppStyles.robotoMedium.fontFamily}
                        fontWeight={AppStyles.robotoMedium.fontWeight}
                        onPress={() => null}
                        outlined
                        textStyle={{ fontSize: AppFonts.scaleFont(18) }}
                        title={'Select an Option'}
                    />
                }
            </ScrollView>
        </View>
    )
};

ReadinessSurvey.propTypes = {
    dailyReadiness:            PropTypes.object.isRequired,
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    handleFormSubmit:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    user:                      PropTypes.object.isRequired,
};
ReadinessSurvey.defaultProps = {};
ReadinessSurvey.componentName = 'ReadinessSurvey';

/* Export Component ================================================================== */
export default ReadinessSurvey;