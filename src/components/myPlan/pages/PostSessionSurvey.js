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
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts } from '../../../constants';
import { FathomSlider, TabIcon, Text } from '../../custom';

// Components
import { AreasOfSoreness, SoreBodyPart } from './';

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
    let isAnythingBotheringText = !postSession.RPE && !postSession.soreness.length ?
        'No, nothing is bothering me'
        :
        'Done';
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
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.primary.grey.thirtyPercent}]}>
                        {'1'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.h3, AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.black}]}>
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
                        key={i}
                        surveyObject={postSession}
                    />
                )}
                <View>
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.primary.grey.thirtyPercent}]}>
                        {soreBodyParts.body_parts.length ? soreBodyParts.body_parts.length + 2 : '2'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.h3, AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.black}]}>
                        {'Did anything bother you?'}
                    </Text>
                    <Text oswaldBold style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.primary.grey.thirtyPercent}]}>
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
                    <Text robotoBold style={[AppStyles.nextButtonText, { fontSize: AppFonts.scaleFont(16) }]}>{isAnythingBotheringText}</Text>
                </TouchableOpacity>
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