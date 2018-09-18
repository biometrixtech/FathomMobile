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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles, MyPlan as MyPlanConstants, AppSizes, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Spacer, Text, } from '../../custom';

// Components
import { AreasOfSoreness, ScaleButton, SoreBodyPart, } from './';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

/* Component ==================================================================== */
class ReadinessSurvey extends Component {
    constructor(props) {
        super(props);
        this.scrollViewRef = {};
        this.myComponents = [];
    }

    _scrollTo = (index) => {
        let myComponentsLocation = this.myComponents[index];
        if(myComponentsLocation) {
            _.delay(() => {
                this.scrollViewRef.scrollTo({
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
                    animated: true,
                });
            }, 500);
        }
    }

    render = () => {
        const {
            dailyReadiness,
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            soreBodyParts,
            user,
        } = this.props;
        let split_afternoon = 12 // 24hr time to split the afternoon
        let split_evening = 17 // 24hr time to split the evening
        let hourOfDay = moment().get('hour');
        let partOfDay = hourOfDay >= split_afternoon && hourOfDay <= split_evening ? 'AFTERNOON' : hourOfDay >= split_evening ? 'EVENING' : 'MORNING';
        let filteredAreasOfSoreness = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length === 0;
        });
        let filteredSoreBodyParts = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length > 0;
        });
        let areQuestionsValid = dailyReadiness.readiness > 0 && dailyReadiness.sleep_quality > 0;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => o.severity > 0 || o.severity === 0).length > 0 : true;
        let areAreasOfSorenessValid = (
            _.filter(filteredAreasOfSoreness, o => o.severity > 0 || o.severity === 0).length > 0 ||
            (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood)
        );
        let isFormValid = areQuestionsValid && (areSoreBodyPartsValid || dailyReadiness.soreness.length === 0) && areAreasOfSorenessValid;
        let newSoreBodyParts = _.cloneDeep(soreBodyParts.body_parts);
        newSoreBodyParts = _.orderBy(newSoreBodyParts, ['body_part', 'side'], ['asc', 'asc']);
        return(
            <View style={{flex: 1}}>
                <ScrollView ref={ref => {this.scrollViewRef = ref}}>
                    <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, alignItems: 'center', width: AppSizes.screen.width}}>
                        <Text oswaldBold style={[AppStyles.h1, AppStyles.paddingHorizontalMed, AppStyles.paddingVerticalXLrg, {color: AppColors.black}]}>{`GOOD ${partOfDay}, ${user.personal_data.first_name.toUpperCase()}!`}</Text>
                    </View>
                    <View>
                        <Spacer size={50} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'1'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How mentally ready do you feel for today?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.overallReadiness, (value, key) => {
                                if(key === 0) { return; }
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={(dailyReadiness.readiness / 2) === key}
                                        key={value+key}
                                        keyLabel={key}
                                        sorenessPainMappingLength={MyPlanConstants.overallReadiness.length}
                                        updateStateAndForm={() => {
                                            handleFormChange('readiness', (key * 2));
                                            this._scrollTo(0);
                                        }}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                    </View>
                    <View onLayout={event => {this.myComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                        <Spacer size={100} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'2'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How well did you sleep last night?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            { _.map(MyPlanConstants.sleepQuality, (value, key) => {
                                if(key === 0) { return; }
                                /*eslint consistent-return: 0*/
                                return(
                                    <ScaleButton
                                        isSelected={(dailyReadiness.sleep_quality / 2) === key}
                                        key={value+key}
                                        keyLabel={key}
                                        sorenessPainMappingLength={MyPlanConstants.sleepQuality.length}
                                        updateStateAndForm={() => {
                                            handleFormChange('sleep_quality', (key * 2));
                                            this._scrollTo(1);
                                        }}
                                        valueLabel={value}
                                    />
                                )
                            })}
                        </View>
                    </View>
                    <Spacer size={100} />
                    { _.map(newSoreBodyParts, (bodyPart, i) =>
                        <View onLayout={event => {this.myComponents[i + 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}} key={i}>
                            <SoreBodyPart
                                bodyPart={bodyPart}
                                bodyPartSide={bodyPart.side}
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(i + 2);
                                    }
                                }}
                                index={i+3}
                                isPrevSoreness={true}
                                surveyObject={dailyReadiness}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[newSoreBodyParts ? newSoreBodyParts.length + 1 : 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {newSoreBodyParts && newSoreBodyParts.length > 0 ? newSoreBodyParts.length + 3 : '3'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
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
    }
}

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