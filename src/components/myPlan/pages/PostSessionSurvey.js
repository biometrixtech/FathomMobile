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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, TouchableOpacity, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppSizes, AppStyles, MyPlan as MyPlanConstants, AppFonts, } from '../../../constants';
import { Button, FathomSlider, Spacer, TabIcon, Text, } from '../../custom';

// Components
import { AreasOfSoreness, ScaleButton, SoreBodyPart, } from './';

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
            setTimeout(() => {
                this.scrollViewRef.scrollTo({
                    animated: true,
                    x:        myComponentsLocation.x,
                    y:        myComponentsLocation.y,
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
        } = this.props;
        let isFormValid = _.filter(postSession.soreness, o => o.severity > 0).length > 0 || (this.areasOfSorenessRef && this.areasOfSorenessRef.state.isAllGood);
        return (
            <View style={{flex: 1}}>
                <ScrollView ref={ref => {this.scrollViewRef = ref}}>
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
                        <Spacer size={50} />
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {'1'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {'How hard was your training session?'}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', paddingTop: AppSizes.padding, paddingHorizontal: AppSizes.paddingLrg}}>
                            <View style={{alignItems: 'flex-end', flex: 5, justifyContent: 'center',}}>
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
                                                this._scrollTo(0);
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
                    { _.map(soreBodyParts.body_parts, (bodyPart, i) =>
                        <View onLayout={event => {this.myComponents[i] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}} key={i}>
                            <SoreBodyPart
                                bodyPart={MyPlanConstants.bodyPartMapping[bodyPart.body_part]}
                                bodyPartSide={bodyPart.side}
                                handleFormChange={(location, value, bodyPartMapIndex, bodyPartSide, shouldScroll) => {
                                    handleFormChange(location, value, bodyPartMapIndex, bodyPartSide);
                                    if(shouldScroll) {
                                        this._scrollTo(i + 1);
                                    }
                                }}
                                index={i+2}
                                isPrevSoreness={true}
                                surveyObject={postSession}
                            />
                            <Spacer size={100} />
                        </View>
                    )}
                    <View onLayout={event => {this.myComponents[soreBodyParts.body_parts ? soreBodyParts.body_parts.length : 1] = {x: event.nativeEvent.layout.x, y: event.nativeEvent.layout.y - 100}}}>
                        <Text robotoRegular style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGreyText, fontSize: AppFonts.scaleFont(15),}]}>
                            {soreBodyParts.body_parts.length ? soreBodyParts.body_parts.length + 2 : '2'}
                        </Text>
                        <Text robotoLight style={[AppStyles.textCenterAligned, AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml, {color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(32),}]}>
                            {`Is anything${soreBodyParts.body_parts && soreBodyParts.body_parts.length > 0 ? ' else ' : ' '}bothering you?`}
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
};
PostSessionSurvey.defaultProps = {};
PostSessionSurvey.componentName = 'PostSessionSurvey';

/* Export Component ================================================================== */
export default PostSessionSurvey;