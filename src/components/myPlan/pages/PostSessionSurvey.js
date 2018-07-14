/**
 * ReadinessSurvey
 *
    <PostSessionSurvey
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handlePostSessionSurveySubmit}
        postSession={this.state.postSession}
        soreBodyParts={this.state.soreBodyParts}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants } from '../../../constants';
import { FathomSlider, Text } from '../../custom';

// Components
import { AreasOfSoreness, SoreBodyPart } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
const PostSessionSurvey = ({
    handleAreaOfSorenessClick,
    handleFormChange,
    handleFormSubmit,
    postSession,
    soreBodyParts,
}) => (
    <View style={{flex: 1}}>
        <ScrollView>
            <View style={{backgroundColor: AppColors.primary.grey.twentyPercent}}>
                <Text style={[AppStyles.h1, AppStyles.paddingVerticalXLrg, AppStyles.paddingHorizontalLrg, {color: AppColors.black}]}>{'HOW WAS YOUR WORKOUT?'}</Text>
            </View>
            <View>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {'1'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                    {'How hard did that practice feel?'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.secondary.blue.hundredPercent}]}>
                    {`${postSession.RPE + 1} - ${MyPlanConstants.overallReadiness[postSession.RPE].toUpperCase()}`}
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
                    key={i}
                    surveyObject={postSession}
                />
            )}
            <View>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {soreBodyParts.body_parts.length ? soreBodyParts.body_parts.length + 2 : '2'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                    {'Did anything bother you?'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {'If yes, select area of soreness or pains'}
                </Text>
                <AreasOfSoreness
                    handleAreaOfSorenessClick={body => handleAreaOfSorenessClick(body, false)}
                    handleFormChange={handleFormChange}
                    soreBodyParts={soreBodyParts}
                    soreBodyPartsState={postSession.soreness}
                    surveyObject={postSession}
                />
            </View>
            <TouchableOpacity onPress={handleFormSubmit} style={[AppStyles.nextButtonWrapper, {margin: 10}]}>
                <Text style={[AppStyles.nextButtonText]}>{'Done'}</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
);

PostSessionSurvey.propTypes = {
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    handleFormSubmit:          PropTypes.func.isRequired,
    postSession:               PropTypes.object.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
};
PostSessionSurvey.defaultProps = {};
PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;