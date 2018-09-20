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
        typicalSessions={this.props.plan.typicalSessions}
    />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Spacer, TabIcon, Text, } from '../../custom';

// Components
import { AreasOfSoreness, ScaleButton, SoreBodyPart, SportScheduleBuilder, } from './';

// import third-party libraries
import _ from 'lodash';

/* Component ==================================================================== */
class PostSessionSurvey extends Component {
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
            handleAreaOfSorenessClick,
            handleFormChange,
            handleFormSubmit,
            handleTogglePostSessionSurvey,
            postSession,
            soreBodyParts,
            typicalSessions,
        } = this.props;
        let filteredAreasOfSoreness = _.filter(postSession.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length === 0;
        });
        let filteredSoreBodyParts = _.filter(postSession.soreness, o => {
            let doesItInclude = _.filter(soreBodyParts.body_parts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length > 0;
        });
        let areQuestionsValid = postSession.RPE > 0 && postSession.event_date;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => o.severity > 0 || o.severity === 0).length > 0 : true;
        let areAreasOfSorenessValid = (
            _.filter(filteredAreasOfSoreness, o => o.severity > 0 || o.severity === 0).length > 0 ||
            (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood)
        );
        let isFormValid = areQuestionsValid && (areSoreBodyPartsValid || postSession.soreness.length === 0) && areAreasOfSorenessValid;
        let newSoreBodyParts = _.cloneDeep(soreBodyParts.body_parts);
        newSoreBodyParts = _.orderBy(newSoreBodyParts, ['body_part', 'side'], ['asc', 'asc']);
        return (
            <View style={{flex: 1}}>
                <ScrollView ref={ref => {this.scrollViewRef = ref}}>
                    <View style={{backgroundColor: AppColors.primary.grey.twentyPercent, width: AppSizes.screen.width}}>
                        <TabIcon
                            containerStyle={[{alignSelf: 'flex-end', paddingBottom: AppSizes.padding, paddingHorizontal: AppSizes.padding, paddingTop: (AppSizes.paddingSml + AppSizes.statusBarHeight),}]}
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
                        <Spacer size={50} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'1'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(22),}]}>
                            {'Build the sentence'}
                        </Text>
                        <Spacer size={24} />
                        <SportScheduleBuilder
                            handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                            }}
                            postSession={postSession}
                            scrollTo={() => this._scrollTo(0)}
                            typicalSessions={typicalSessions}
                        />
                    </View>
                    <View onLayout={event => {this.myComponents[0] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y}}}>
                        <Spacer size={100} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'2'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How hard was your training session?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            <View style={{alignItems: 'flex-end', flex: 5, justifyContent: 'center', paddingHorizontal: AppSizes.paddingSml}}>
                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                    if(key === 0) { return; }
                                    /*eslint consistent-return: 0*/
                                    return(
                                        <ScaleButton
                                            isSelected={postSession.RPE === key}
                                            key={value+key}
                                            keyLabel={key}
                                            sorenessPainMappingLength={MyPlanConstants.postSessionFeel.length}
                                            updateStateAndForm={() => {
                                                handleFormChange('RPE', key);
                                                this._scrollTo(1);
                                            }}
                                        />
                                    )
                                })}
                            </View>
                            <View style={{alignItems: 'flex-start', flex: 5, justifyContent: 'space-between', paddingHorizontal: AppSizes.paddingMed}}>
                                { _.map(MyPlanConstants.postSessionFeel, (value, key) => {
                                    if(key === 0 || value.length === 0) { return; }
                                    const isLast = (MyPlanConstants.postSessionFeel.length - 1) === key;
                                    const isFirst = (MyPlanConstants.postSessionFeel.length - 1) === 1;
                                    /*eslint consistent-return: 0*/
                                    return(
                                        <Text
                                            oswaldRegular
                                            style={[
                                                AppStyles.textCenterAligned,
                                                {
                                                    color:           AppColors.primary.grey.fiftyPercent,
                                                    fontSize:        AppFonts.scaleFont(16),
                                                    paddingVertical: AppSizes.paddingSml,
                                                },
                                                isLast ?
                                                    {paddingVertical: AppSizes.paddingMed}
                                                    : isFirst ?
                                                        {paddingVertical: AppSizes.paddingXSml}
                                                        :
                                                        {},
                                            ]}
                                            key={value+key}
                                        >
                                            {value.toUpperCase()}
                                        </Text>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                    <Spacer size={100} />
                    { _.map(newSoreBodyParts, (bodyPart, i) =>
                        <View onLayout={event => {this.myComponents[i + 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}} key={i}>
                            <SoreBodyPart
                                bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                                bodyPartSide={bodyPart.side}
                                handleFormChange={(location, value, isPain, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, isPain, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(i + 2);
                                    }
                                }}
                                index={i+2}
                                isPrevSoreness={true}
                                surveyObject={postSession}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[newSoreBodyParts ? newSoreBodyParts.length + 1 : 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {newSoreBodyParts.length ? newSoreBodyParts.length + 2 : '2'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${newSoreBodyParts && newSoreBodyParts.length > 0 ? ' else ' : ' '}bothering you?`}
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
    }
}

PostSessionSurvey.propTypes = {
    handleAreaOfSorenessClick:     PropTypes.func.isRequired,
    handleFormChange:              PropTypes.func.isRequired,
    handleFormSubmit:              PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func.isRequired,
    postSession:                   PropTypes.object.isRequired,
    soreBodyParts:                 PropTypes.object.isRequired,
    typicalSessions:               PropTypes.array.isRequired,
};
PostSessionSurvey.defaultProps = {};
PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;