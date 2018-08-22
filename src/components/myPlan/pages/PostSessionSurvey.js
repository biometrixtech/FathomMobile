/**
 * ReadinessSurvey
 *
    <PostSessionSurvey
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handlePostSessionSurveySubmit}
        handleTogglePostSessionSurvey={this._handleTogglePostSessionSurvey}
        postSession={this.state.postSession}
        soreBodyParts={this.state.soreBodyParts}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts, } from '../../../constants';
import { Button, FathomSlider, TabIcon, Text, } from '../../custom';

// Components
import { AreasOfSoreness, SoreBodyPart, } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const PostSessionSurvey = ({
    handleAreaOfSorenessClick,
    handleFormChange,
    handleFormSubmit,
    handleTogglePostSessionSurvey,
    postSession,
    soreBodyParts,
}) => {
    let isFormValid = _.filter(postSession.soreness, o => o.severity > 0).length > 0 || (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood);
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, width: AppSizes.screen.width}}>
                    <TabIcon
                        containerStyle={[{alignSelf: 'flex-end'}, AppStyles.padding]}
                        icon={'close'}
                        iconStyle={[{color: AppColors.black}]}
                        onPress={handleTogglePostSessionSurvey}
                        reverse={false}
                        size={30}
                        type={'material-community'}
                    />
                    <Text oswaldRegular style={[AppStyles.h1, AppStyles.paddingVerticalSml, {color: AppColors.black, paddingTop: 0, alignSelf: 'center', textAlign: 'center'}]}>{'HOW WAS YOUR WORKOUT?'}</Text>
                </View>
                <View>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                        {'1'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {'How hard did that practice feel?'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.secondary.blue.hundredPercent}]}>
                        {`${postSession.RPE + 1} - ${MyPlanConstants.postSessionFeel[postSession.RPE].toUpperCase()}`}
                    </Text>
                    <FathomSlider
                        handleFormChange={handleFormChange}
                        maximumValue={9}
                        minimumValue={0}
                        name={'RPE'}
                        value={postSession.RPE}
                    />
                </View>
                { _.map(soreBodyParts.body_parts, (bodyPart, i) =>
                    <SoreBodyPart
                        bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                        bodyPartSide={bodyPart.side}
                        handleFormChange={handleFormChange}
                        index={i+2}
                        isPrevSoreness={true}
                        key={i}
                        surveyObject={postSession}
                    />
                )}
                <View>
                    <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                        {soreBodyParts.body_parts.length ? soreBodyParts.body_parts.length + 2 : '2'}
                    </Text>
                    <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                        {'Is anything else bothering you?'}
                    </Text>
                    <AreasOfSoreness
                        handleAreaOfSorenessClick={(body, isAllGood) => handleAreaOfSorenessClick(body, false, isAllGood)}
                        handleFormChange={handleFormChange}
                        ref={areasOfSorenessRef => {this.areasOfSorenessRef = areasOfSorenessRef;}}
                        soreBodyParts={soreBodyParts}
                        soreBodyPartsState={postSession.soreness}
                        surveyObject={postSession}
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

PostSessionSurvey.propTypes = {
    handleAreaOfSorenessClick:     PropTypes.func.isRequired,
    handleFormChange:              PropTypes.func.isRequired,
    handleFormSubmit:              PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func.isRequired,
    postSession:                   PropTypes.object.isRequired,
    soreBodyParts:                 PropTypes.object.isRequired,
};
PostSessionSurvey.defaultProps = {};
PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;