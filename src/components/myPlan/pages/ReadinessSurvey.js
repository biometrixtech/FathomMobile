/**
 * ReadinessSurvey
 *
    <ReadinessSurvey
        dailyReadiness={this.state.dailyReadiness}
        handleAreaOfSorenessClick={this._handleAreaOfSorenessClick}
        handleFormChange={this._handleFormChange}
        handleFormSubmit={this._handleReadinessSurveySubmit}
        soreBodyParts={this.state.soreBodyParts}
        soreBodyPartsState={this.state.dailyReadiness.soreness}
        user={user}
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
const ReadinessSurvey = ({
    dailyReadiness,
    handleAreaOfSorenessClick,
    handleFormChange,
    handleFormSubmit,
    soreBodyParts,
    soreBodyPartsState,
    user,
}) => (
    <View style={{flex: 1}}>
        <ScrollView>
            <View style={{backgroundColor: AppColors.primary.grey.twentyPercent}}>
                <Text style={[AppStyles.h1, AppStyles.paddingVerticalXLrg, AppStyles.paddingHorizontalLrg, {color: AppColors.black}]}>{`GOOD MORNING, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
            </View>
            <View>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {'1'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                    {'How ready do you feel to attack the day?'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.secondary.blue.hundredPercent}]}>
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
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {'2'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                    {'How well did you sleep last nights?'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.secondary.blue.hundredPercent}]}>
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
                    bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                    dailyReadiness={dailyReadiness}
                    handleFormChange={handleFormChange}
                    index={i+3}
                    key={i}
                />
            )}
            <View>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {Object.keys(soreBodyParts).length > 0 ? Object.keys(soreBodyParts).length + 3 : '3'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.h3, AppStyles.bold, {color: AppColors.black}]}>
                    {'Is anything bothering you?'}
                </Text>
                <Text style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, AppStyles.bold, {color: AppColors.primary.grey.thirtyPercent}]}>
                    {'If yes, select area of soreness or pains'}
                </Text>
                <AreasOfSoreness
                    dailyReadiness={dailyReadiness}
                    handleAreaOfSorenessClick={handleAreaOfSorenessClick}
                    handleFormChange={handleFormChange}
                    soreBodyParts={soreBodyParts}
                    soreBodyPartsState={soreBodyPartsState}
                />
            </View>
            <TouchableOpacity onPress={handleFormSubmit} style={[AppStyles.nextButtonWrapper, {margin: 10}]}>
                <Text style={[AppStyles.nextButtonText]}>{'Done'}</Text>
            </TouchableOpacity>
        </ScrollView>
    </View>
);

ReadinessSurvey.propTypes = {
    dailyReadiness:            PropTypes.object.isRequired,
    handleAreaOfSorenessClick: PropTypes.func.isRequired,
    handleFormChange:          PropTypes.func.isRequired,
    handleFormSubmit:          PropTypes.func.isRequired,
    soreBodyParts:             PropTypes.object.isRequired,
    soreBodyPartsState:        PropTypes.array.isRequired,
    user:                      PropTypes.object.isRequired,
};
ReadinessSurvey.defaultProps = {};
ReadinessSurvey.componentName = 'ReadinessSurvey';

/* Export Component ================================================================== */
export default ReadinessSurvey;