/**
 * SingleSensorSession
 *
    <SingleSensorSession
        handleFormChange={handleHealthDataFormChange}
        handleNextStep={(isHealthKitValid, isHKNextStep) => this._checkNextStep(0, isHealthKitValid, isHKNextStep)}
        handleTogglePostSessionSurvey={handleTogglePostSessionSurvey}
        session={sensorSession}
        user={user}
    />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, ScrollView, StyleSheet, View, } from 'react-native';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Checkbox, Spacer, Text, } from '../../custom';
import { AppUtil, PlanLogic, } from '../../../lib';
import { BackNextButtons, ProgressPill, ScaleButton, } from './';

// import third-party libraries
import _ from 'lodash';
import AppleHealthKit from 'rn-apple-healthkit';
import moment from 'moment';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    shadowEffect: {
        shadowColor:   'rgba(0, 0, 0, 0.16)',
        shadowOffset:  {  height: 3, width: 0, },
        shadowOpacity: 1,
        shadowRadius:  6,
    },
});

/* Component ==================================================================== */
class SingleSensorSession extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayTimerId:          null,
            isHKRetrieveChecked:   Platform.OS === 'ios',
            isHKRetrieveModalOpen: false,
        };
        this.scrollViewRef = {};
    }

    _handleHeartRateDataCheck = currentPage => {
        const { isHKRetrieveChecked, } = this.state;
        const { handleFormChange, handleNextStep, session, } = this.props;
        if(isHKRetrieveChecked) {
            return this.setState(
                { isHKRetrieveModalOpen: true, },
                async () => {
                    let appleHealthKitPerms = AppUtil._getAppleHealthKitPerms();
                    return await AppUtil._getHeartRateSamples(
                        appleHealthKitPerms,
                        moment(session.event_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').subtract(1, 'minutes').toISOString(),
                        session.end_date ?
                            moment(session.end_date.replace('Z', ''), 'YYYY-MM-DDThh:mm:ss.SSS').add(1, 'minutes').toISOString()
                            :
                            moment().add(1, 'minutes').toISOString()
                        ,
                        false,
                        AppleHealthKit
                    )
                        .then(res =>
                            handleFormChange('hr_data', res, () =>
                                this.setState(
                                    { isHKRetrieveModalOpen: false, },
                                    () => _.delay(() => handleNextStep(true, 'continue'), 250),
                                )
                            )
                        );
                }
            );
        }
        return handleNextStep(true, 'continue');
    }

    _scrollToBottom = scrollViewRef => {
        if(scrollViewRef) {
            this.setState({ delayTimerId: _.delay(() => scrollViewRef.scrollToEnd({ animated: true, }), 500) });
        }
    }

    render = () => {
        const { handleFormChange, handleTogglePostSessionSurvey, session, user, } = this.props;
        const { isHKRetrieveChecked, isHKRetrieveModalOpen, } = this.state;
        let { sportImage, sportText, } = PlanLogic.handleSingleHealthKitWorkoutPageRenderLogic([session]);
        return (
            <View style={{flex: 1,}}>

                <ProgressPill
                    currentStep={1}
                    onClose={handleTogglePostSessionSurvey}
                    totalSteps={3}
                />

                <ScrollView
                    nestedScrollEnabled={true}
                    ref={ref => {this.scrollViewRef = ref;}}
                >
                    <View style={{flex: 1,}}>
                        <View style={{paddingHorizontal: AppSizes.paddingLrg,}}>
                            <View style={{alignItems: 'center', marginVertical: AppSizes.paddingMed,}}>
                                <Image
                                    source={sportImage}
                                    style={[styles.shadowEffect, {height: AppSizes.screen.widthThird, tintColor: AppColors.zeplin.splash, width: AppSizes.screen.widthThird,}]}
                                />
                            </View>
                            <Text robotoLight style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(26), textAlign: 'center',}}>
                                {sportText[0]}
                                <Text robotoMedium>{sportText[1]}</Text>
                                {sportText[2]}
                            </Text>
                        </View>
                        <Spacer size={AppSizes.padding} />
                        { _.map(MyPlanConstants.postSessionFeel, (scale, key) => {
                            let RPEValue = session.post_session_survey.RPE;
                            let isSelected = RPEValue === scale.value;
                            return(
                                <ScaleButton
                                    isSelected={isSelected}
                                    key={key}
                                    scale={scale}
                                    updateStateAndForm={() => {
                                        handleFormChange(
                                            'post_session_survey.RPE',
                                            scale.value === RPEValue ? null : scale.value,
                                            () => this._scrollToBottom(this.scrollViewRef),
                                        );
                                    }}
                                />
                            )
                        })}
                        { (Platform.OS === 'ios' && user.health_enabled) &&
                            <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'center',}}>
                                <Checkbox
                                    checked={isHKRetrieveChecked}
                                    onPress={() => isHKRetrieveModalOpen ? {} : this.setState({ isHKRetrieveChecked: !this.state.isHKRetrieveChecked, })}
                                />
                                <Text robotoMedium style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{'Retrieve Heart Rate Data if available'}</Text>
                            </View>
                        }
                        { (session && session.post_session_survey && session.post_session_survey.RPE) &&
                            <BackNextButtons
                                handleFormSubmit={() => isHKRetrieveModalOpen ? {} : this._handleHeartRateDataCheck(0)}
                                isSubmitBtnSubmitting={isHKRetrieveModalOpen}
                                isValid={true}
                                showBackIcon={false}
                                showSubmitBtn={true}
                                submitBtnText={isHKRetrieveModalOpen ? 'Loading...' : 'Continue'}
                            />
                        }
                    </View>
                </ScrollView>

            </View>
        );
    }
}

SingleSensorSession.propTypes = {
    handleFormChange:              PropTypes.func.isRequired,
    handleNextStep:                PropTypes.func.isRequired,
    handleTogglePostSessionSurvey: PropTypes.func.isRequired,
    session:                       PropTypes.object.isRequired,
    user:                          PropTypes.object.isRequired,
};

SingleSensorSession.defaultProps = {};

SingleSensorSession.componentName = 'SingleSensorSession';

/* Export Component ================================================================== */
export default SingleSensorSession;