/* global it expect jest */
import 'react-native';

// import third-party libraries
import moment from 'moment';

// import logic file(s)
import { PlanLogic, } from '../';

// Consts and Libs
import { MyPlan as MyPlanConstants, } from '../../constants';

const helperFunctions = {

    getPushNotificationHelperProps: (notificationString, preRecoveryCompleted, postRecoveryCompleted, isReadinessSurveyCompleted) => {
        let pushNotificationHelperProps = {};
        pushNotificationHelperProps.notification = notificationString;
        pushNotificationHelperProps.plan = {};
        pushNotificationHelperProps.plan.dailyPlan = [];
        pushNotificationHelperProps.plan.dailyPlan[0] = {};
        pushNotificationHelperProps.plan.dailyPlan[0].pre_recovery_completed = preRecoveryCompleted;
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery = {};
        pushNotificationHelperProps.plan.dailyPlan[0].post_recovery.completed = postRecoveryCompleted;
        pushNotificationHelperProps.plan.dailyPlan[0].daily_readiness_survey_completed = isReadinessSurveyCompleted;
        return pushNotificationHelperProps;
    },

    getPushNotificationHelperState: (notificationString, helperProps) => {
        let pushNotificationHelperState = {};
        pushNotificationHelperState.prepare = {
            finishedRecovery:           helperProps.plan && helperProps.plan.dailyPlan[0] && helperProps.plan.dailyPlan[0].pre_recovery_completed ? true : false,
            isActiveRecoveryCollapsed:  true,
            isReadinessSurveyCollapsed: true,
            isReadinessSurveyCompleted: false,
        };
        pushNotificationHelperState.recover = {
            finished:                  false,
            isActiveRecoveryCollapsed: true,
        };
        return pushNotificationHelperState;
    },

    getPushNotificationAPExpectedResult: () => {
        let expectedResult = {
            newStateFields: {
                finishedRecovery:           false,
                isActiveRecoveryCollapsed:  false,
                isReadinessSurveyCollapsed: true,
                isReadinessSurveyCompleted: false
            },
            page:                       0,
            stateName:                  'prepare',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationARExpectedResult: () => {
        let expectedResult = {
            newStateFields:             { finished: false, isActiveRecoveryCollapsed: false },
            page:                       2,
            stateName:                  'recover',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationReadinessExpectedResult: () => {
        let expectedResult = {
            newStateFields:             true,
            page:                       0,
            stateName:                  'isReadinessSurveyModalOpen',
            updateExerciseList:         false,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationPlanExpectedResult: () => {
        let expectedResult = {
            newStateFields:             '',
            page:                       null,
            stateName:                  '',
            updateExerciseList:         true,
            updatePushNotificationFlag: true
        };
        return expectedResult;
    },

    getPushNotificationIgnoreExpectedResult: () => {
        let expectedResult = {
            newStateFields:             '',
            page:                       0,
            stateName:                  '',
            updateExerciseList:         false,
            updatePushNotificationFlag: false
        };
        return expectedResult;
    },

    getDailyReadinessDefaultState: () => {
        let dailyReadinessDefaultState = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return dailyReadinessDefaultState;
    },

    getDailyReadinessDefaultStateWithBodyPart: (bodyPartIndex, side) => {
        let dailyReadinessDefaultState = {
            current_position:   null,
            current_sport_name: null,
            readiness:          0,
            sleep_quality:      0,
            soreness:           [
                {body_part: bodyPartIndex, pain: false, severity: null, side: side}
            ],
            wants_functional_strength: null,
        };
        return dailyReadinessDefaultState;
    },

    getPostSessionDefaultStateWithBodyPart: (bodyPartIndex, side) => {
        let dailyReadinessDefaultState = {
            RPE:          0,
            description:  '',
            duration:     0,
            event_date:   null,
            session_type: null,
            soreness:     [
                {body_part: bodyPartIndex, pain: false, severity: null, side: side}
            ],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return dailyReadinessDefaultState;
    },

    getPostSessionDefaultState: () => {
        let postSessionState = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return postSessionState;
    },

    getDailyReadinessReadinessInputExpectedResult: key => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 (key * 2),
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessSleepQualityInputExpectedResult: key => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             (key * 2),
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessFSInputExpectedResult: wantsFS => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: wantsFS,
        };
        return expectedResult;
    },

    getDailyReadinessCurrentPositionInputExpectedResult: value => {
        let expectedResult = {
            current_position:          value,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessCurrentSportNameInputExpectedResult: value => {
        let expectedResult = {
            current_position:          null,
            current_sport_name:        value,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [],
            wants_functional_strength: null,
        };
        return expectedResult;
    },

    getDailyReadinessNewBodyPartSorenessWithPainInputExpectedResult: (bodyPartIndex, side) => {
        let expectedResult = {
            current_position:   null,
            current_sport_name: null,
            readiness:          0,
            sleep_quality:      0,
            soreness:           [
                {body_part: bodyPartIndex, pain: true, severity: null, side: side}
            ],
            wants_functional_strength: null
        };
        return expectedResult;
    },

    getDailyReadinessNewBodyPartSorenessWithoutPainInputExpectedResult: (bodyPartIndex, side) => {
        let expectedResult = {
            current_position:   null,
            current_sport_name: null,
            readiness:          0,
            sleep_quality:      0,
            soreness:           [
                {body_part: bodyPartIndex, pain: false, severity: null, side: side}
            ],
            wants_functional_strength: null
        };
        return expectedResult;
    },

    getPostSessionRPEInputExpectedResult: key => {
        let expectedResult = {
            RPE:                            key,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionEventDateInputExpectedResult: date => {
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     date,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionDurationInputExpectedResult: duration => {
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       duration,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionSessionTypeInputExpectedResult: sessionType => {
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   sessionType,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionSportNameInputExpectedResult: sportName => {
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     sportName,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionStrengthAndConditioningTypeInputExpectedResult: strengthConditioningType => {
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [],
            sport_name:                     null,
            strength_and_conditioning_type: strengthConditioningType,
        };
        return expectedResult;
    },

    getPostSessionNewBodyPartSorenessWithoutPainInputExpectedResult: (bodyPartIndex, side) => {
        let expectedResult = {
            RPE:          0,
            description:  '',
            duration:     0,
            event_date:   null,
            session_type: null,
            soreness:     [
                {body_part: bodyPartIndex, pain: false, severity: null, side: side}
            ],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionNewBodyPartSorenessWithPainInputExpectedResult: (bodyPartIndex, side) => {
        let expectedResult = {
            RPE:          0,
            description:  '',
            duration:     0,
            event_date:   null,
            session_type: null,
            soreness:     [
                { body_part: bodyPartIndex, pain: true, severity: null, side: side }
            ],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getAreaOfSorenessAddingNonBilateralBodyPartExpectedResult: bodyPartIndex => {
        let expectedResult = [];
        return expectedResult;
    },

    getAreaOfSorenessAddingNonBilateralBodyPartStateObject: bodyPartIndex => {
        let expectedResult = {
            soreness: [
                { body_part: bodyPartIndex, pain: false, severity: null, side: 0 }
            ],
        };
        return expectedResult;
    },

    getAreaOfSorenessNonBilateralAreaClicked: () => {
        let nonBilateralAreaClicked = {
            bilateral:    false,
            group:        'muscle',
            helping_verb: 'are',
            image:        {0: 'Abs.svg',},
            index:        3,
            label:        'Abdominals',
            location:     'front',
            order:        1
        };
        return nonBilateralAreaClicked;
    },

    getAreaOfSorenessAddingBilateralBodyPartExpectedResult: bodyPartIndex => {
        let expectedResult = [
            { body_part: bodyPartIndex, pain: false, severity: null, side: 1 },
            { body_part: bodyPartIndex, pain: false, severity: null, side: 2 },
        ];
        return expectedResult;
    },

    getAreaOfSorenessAddingBilateralBodyPartStateObject: bodyPartIndex => {
        let expectedResult = {
            soreness: [],
        };
        return expectedResult;
    },

    getAreaOfSorenessBilateralAreaClicked: () => {
        let bilateralAreaClicked = {
            bilateral:    true,
            group:        'joint',
            helping_verb: 'is',
            image:        {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'},
            index:        7,
            label:        'knee',
            location:     'front',
            order:        7
        };
        return bilateralAreaClicked;
    },

    getAreaOfSorenessRemovingNonBilateralBodyPartExpectedResult: bodyPartIndex => {
        let expectedResult = [];
        return expectedResult;
    },

    getAreaOfSorenessRemovingNonBilateralBodyPartStateObject: bodyPartIndex => {
        let expectedResult = {
            soreness: [
                { body_part: bodyPartIndex, pain: false, severity: null, side: 0 }
            ],
        };
        return expectedResult;
    },

    getAreaOfSorenessRemovingBilateralBodyPartExpectedResult: bodyPartIndex => {
        let expectedResult = [];
        return expectedResult;
    },

    getAreaOfSorenessRemovingBilateralBodyPartStateObject: bodyPartIndex => {
        let expectedResult = {
            soreness: [
                { body_part: bodyPartIndex, pain: false, severity: null, side: 1 },
                { body_part: bodyPartIndex, pain: false, severity: null, side: 2 }
            ],
        };
        return expectedResult;
    },

    getFunctionalStrengthOptionsSession: (sport_name, strength_and_conditioning_type) => {
        return { sport_name, strength_and_conditioning_type };
    },

    getFunctionalStrengthOptionsExpectedResult: (isSport, isStrengthConditioning, sessionName) => {
        return { isSport, isStrengthConditioning, sessionName };
    },

    getSportScheduleBuilderDateTimeDurationFromStateExpectedResult: (duration, event_date, timeValueGroups) => {
        if(event_date) {
            return {
                duration,
                event_date
            };
        }
        let now = moment();
        now = now.set('second', 0);
        now = now.set('millisecond', 0);
        let hoursIn24 = timeValueGroups.amPM === 0 ? (timeValueGroups.hours + 1) : ((timeValueGroups.hours + 1) + 12);
        hoursIn24 = hoursIn24 === 12 ? 0 : hoursIn24;
        hoursIn24 = hoursIn24 === 24 ? 12 : hoursIn24;
        now = now.set('hour', hoursIn24);
        now = now.set('minute', Number(MyPlanConstants.timeOptionGroups.minutes[timeValueGroups.minutes]));
        return {
            duration,
            event_date: now
        };
    },

    getDefaultDurationValuesFromState: (durationMinutes, durationLabel) => {
        return {
            durationValueGroups: {
                minutes: durationMinutes,
                label:   durationLabel,
            }
        };
    },

    getDefaulTimeValuesFromState: (timeHours, timeMinutes, TimeAMPM) => {
        return {
            timeValueGroups: {
                hours:   timeHours,
                minutes: timeMinutes,
                amPM:    TimeAMPM,
            }
        };
    },

    handleGetFinalSportTextString: (durationText, sportText, startTimeText) => {
        return {
            durationText,
            sportText,
            startTimeText,
        };
    },

    handleAreasOfSorenessBodyPartExpectedResult: (bodyImage, isSelected, mainBodyPartName) => {
        return {
            bodyImage,
            isSelected,
            mainBodyPartName,
        };
    },

    handleSoreBodyParts: bodyPartIndex => {
        return {
            body_parts: [
                {
                    body_part: bodyPartIndex,
                    side:      0,
                }
            ]
        };
    },

    getAreaOfSorenessAddingNonBilateralBodyPart: bodyPartIndex => {
        return [
            {
                body_part: bodyPartIndex,
                pain:      false,
                severity:  null,
                side:      0
            }
        ];
    },

    getAreaOfSorenessFullGroupedBodyPartMap: () => {
        return {
            back: [
                {index: 12, order: 11, label: 'Lower Back', location: 'back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'is'},
                {index: 14, order: 12, label: 'Glutes', location: 'back', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'are'},
                {index: 15, order: 13, label: 'Hamstrings', location: 'back', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'are'},
                {index: 16, order: 14, label: 'Calves', location: 'back', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'are'},
                {index: 17, order: 15, label: 'Achilles', location: 'back', group: 'joint', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'are'},
                {index: 18, order: 10, label: 'Upper Back', location: 'back', group: 'muscle', image: {0: 'UpperBackNeck.svg'}, bilateral: false, helping_verb: 'is'},
            ],
            front: [
                {index: 3, order: 1, label: 'Abdominals', location: 'front', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'are'},
                {index: 4, order: 3, label: 'Hip', location: 'front', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 5, order: 2, label: 'Groin', location: 'front', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 6, order: 4, label: 'Quads', location: 'front', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'are'},
                {index: 7, order: 6, label: 'Knee', location: 'front', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 8, order: 7, label: 'Shin', location: 'front', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 9, order: 8, label: 'Ankle', location: 'front', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 10, order: 9, label: 'Foot', location: 'front', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'is'},
                {index: 11, order: 5, label: 'IT Band', location: 'front', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'is'},
            ],
        }
    },

};

it('Area Of Soreness Render Logic - On Enter, NO Previous Soreness', () => {
    let soreBodyParts =  {body_parts: []};
    let soreBodyPartsState = [];
    let expectedResult = {areaOfSorenessClicked: [], groupedNewBodyPartMap: helperFunctions.getAreaOfSorenessFullGroupedBodyPartMap()};
    expect(PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState)).toEqual(expectedResult);
});

it('Area Of Soreness Render Logic - Selected Abs, NO Previous Soreness', () => {
    let soreBodyParts =  {body_parts: []};
    let soreBodyPartsState = helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartStateObject(3).soreness;
    let expectedResult = {areaOfSorenessClicked: helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartStateObject(3).soreness, groupedNewBodyPartMap: helperFunctions.getAreaOfSorenessFullGroupedBodyPartMap()};
    expect(PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState)).toEqual(expectedResult);
});

it('Area Of Soreness Render Logic - Selected Glutes, NO Previous Soreness', () => {
    let soreBodyParts =  {body_parts: []};
    let soreBodyPartsState = helperFunctions.getAreaOfSorenessAddingBilateralBodyPartExpectedResult(14);
    let expectedResult = {areaOfSorenessClicked: helperFunctions.getAreaOfSorenessAddingBilateralBodyPartExpectedResult(14), groupedNewBodyPartMap: helperFunctions.getAreaOfSorenessFullGroupedBodyPartMap()};
    expect(PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState)).toEqual(expectedResult);
});

it('Areas of Soreness Body Part - NOT Selected Joint (Knee)', () => {
    let areaOfSorenessClicked = [];
    let kneeBodyParts = helperFunctions.getAreaOfSorenessBilateralAreaClicked();
    let soreBodyParts = helperFunctions.handleSoreBodyParts(18);
    let expectedResult = helperFunctions.handleAreasOfSorenessBodyPartExpectedResult('Knee.svg', false, 'KNEE');
    expect(PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, kneeBodyParts, soreBodyParts)).toEqual(expectedResult);
});

it('Areas of Soreness Body Part - Selected Joint (Knee)', () => {
    let areaOfSorenessClicked = helperFunctions.getAreaOfSorenessAddingBilateralBodyPartExpectedResult(7);
    let kneeBodyParts = helperFunctions.getAreaOfSorenessBilateralAreaClicked();
    let soreBodyParts = helperFunctions.handleSoreBodyParts(18);
    let expectedResult = helperFunctions.handleAreasOfSorenessBodyPartExpectedResult('Knee.svg', true, 'KNEE');
    expect(PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, kneeBodyParts, soreBodyParts)).toEqual(expectedResult);
});

it('Areas of Soreness Body Part - NOT Selected Muscle (Abs)', () => {
    let areaOfSorenessClicked = [];
    let absBodyParts = helperFunctions.getAreaOfSorenessNonBilateralAreaClicked();
    let soreBodyParts = helperFunctions.handleSoreBodyParts(3);
    let expectedResult = helperFunctions.handleAreasOfSorenessBodyPartExpectedResult('Abs.svg', false, 'ABDOMINALS');
    expect(PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, absBodyParts, soreBodyParts)).toEqual(expectedResult);
});

it('Areas of Soreness Body Part - Selected Muscle (Abs)', () => {
    let areaOfSorenessClicked = helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPart(3);
    let absBodyParts = helperFunctions.getAreaOfSorenessNonBilateralAreaClicked();
    let soreBodyParts = helperFunctions.handleSoreBodyParts(3);
    let expectedResult = helperFunctions.handleAreasOfSorenessBodyPartExpectedResult('Abs.svg', true, 'ABDOMINALS');
    expect(PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, absBodyParts, soreBodyParts)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Recent Sport - Pool Sports Competition', () => {
    let selectedSport = 'pool sports';
    let filteredSessionType = [{index: 2, order: 2, label: 'Competition'}];
    let postSession = { session_type: 2 };
    let isFormValid = false;
    let step = 3;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('duration', 'pool sports competition', 'time');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Recent Sport - Strength Training', () => {
    let selectedSport = 'strength';
    let filteredSessionType = [];
    let postSession = { session_type: 1 };
    let isFormValid = false;
    let step = 3;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('duration', 'strength training', 'time');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Recent Sport - Cross Training', () => {
    let selectedSport = 'distance running';
    let filteredSessionType = [{index: 0, order: 1, label: 'Practice'}];
    let postSession = { session_type: 0 };
    let isFormValid = false;
    let step = 3;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('duration', 'distance running practice', 'time');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Sport - Cross Training', () => {
    let selectedSport = 'cross';
    let filteredSessionType = [];
    let postSession = { session_type: 1 };
    let isFormValid = false;
    let step = 2;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('', 'cross ', '');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Sport - Basketball', () => {
    let selectedSport = 'basketball';
    let filteredSessionType = [];
    let postSession = { session_type: null };
    let isFormValid = false;
    let step = 2;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('', 'basketball ', '');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Sport, & Type - Speed & Agility', () => {
    let selectedSport = 'speed & agility';
    let filteredSessionType = [];
    let postSession = { session_type: 1 };
    let isFormValid = false;
    let step = 3;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('duration', 'speed & agility training', 'time');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Sport, & Type - Soccer Practice', () => {
    let selectedSport = 'soccer';
    let filteredSessionType = [{index: 0, order: 1, label: 'Practice'}];
    let postSession = { session_type: 0 };
    let isFormValid = false;
    let step = 3;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('duration', 'soccer practice', 'time');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Selected Sport, Type, Time, & Duration', () => {
    let selectedSport = 'basketball';
    let filteredSessionType = [{index: 6, order: 3, label: 'Training'}];
    let postSession = { session_type: 1 };
    let isFormValid = true;
    let step = 3;
    let selectedStartTime = moment('06:30', 'HH:mm');
    let selectedDuration = 60;
    let expectedResult = helperFunctions.handleGetFinalSportTextString('60', 'basketball training', '6:30');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Sport Text - Empty Data', () => {
    let selectedSport = null;
    let filteredSessionType = null;
    let postSession = helperFunctions.getPostSessionRPEInputExpectedResult(0);
    let isFormValid = false;
    let step = 0;
    let selectedStartTime = `${moment().toISOString(true).split('.')[0]}Z`;
    let selectedDuration = '';
    let expectedResult = helperFunctions.handleGetFinalSportTextString('', 'activity type', '');
    expect(PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Is Valid with data #1', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(11, 1).durationValueGroups;
    let isFormValid = true;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(4, 0, 0).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult(60, false, timeValueGroups);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Is Valid with data #2', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(17, 1).durationValueGroups;
    let isFormValid = true;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(5, 2, 1).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult(90, false, timeValueGroups);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Is Valid with data #3', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(2, 1).durationValueGroups;
    let isFormValid = true;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(2, 2, 1).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult(15, false, timeValueGroups);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Isn\'t Valid without data', () => {
    let durationValueGroups = false;
    let isFormValid = false;
    let timeValueGroups = false;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult('', `${moment().toISOString(true).split('.')[0]}Z`);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Isn\'t Valid with data', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(2, 1).durationValueGroups;
    let isFormValid = false;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(2, 2, 1).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult('', `${moment().toISOString(true).split('.')[0]}Z`);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Functional Strength Options - Sport - Soccer', () => {
    let session = helperFunctions.getFunctionalStrengthOptionsSession(14, null);
    let expectedResult = helperFunctions.getFunctionalStrengthOptionsExpectedResult(true, false, 'Soccer');
    expect(PlanLogic.handleFunctionalStrengthOptions(session)).toEqual(expectedResult);
});

it('Functional Strength Options - Sport - Basketball', () => {
    let session = helperFunctions.getFunctionalStrengthOptionsSession(0, null);
    let expectedResult = helperFunctions.getFunctionalStrengthOptionsExpectedResult(true, false, 'Basketball');
    expect(PlanLogic.handleFunctionalStrengthOptions(session)).toEqual(expectedResult);
});

it('Functional Strength Options - Strength & Conditioning - Strength', () => {
    let session = helperFunctions.getFunctionalStrengthOptionsSession(null, 3);
    let expectedResult = helperFunctions.getFunctionalStrengthOptionsExpectedResult(false, true, 'Strength TRAINING');
    expect(PlanLogic.handleFunctionalStrengthOptions(session)).toEqual(expectedResult);
});

it('Functional Strength Options - Strength & Conditioning - Endurance', () => {
    let session = helperFunctions.getFunctionalStrengthOptionsSession(null, 0);
    let expectedResult = helperFunctions.getFunctionalStrengthOptionsExpectedResult(false, true, 'Endurance TRAINING');
    expect(PlanLogic.handleFunctionalStrengthOptions(session)).toEqual(expectedResult);
});

it('Area Of Soreness Clicked - Adding Bilateral Body Part', () => {
    let bodyPartIndex = 7;
    let expectedResult = helperFunctions.getAreaOfSorenessAddingBilateralBodyPartExpectedResult(bodyPartIndex);
    let stateObject = helperFunctions.getAreaOfSorenessAddingBilateralBodyPartStateObject(bodyPartIndex);
    let areaClicked = helperFunctions.getAreaOfSorenessBilateralAreaClicked();
    let soreBodyPartsPlan = {body_parts: []};
    expect(PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, false, soreBodyPartsPlan)).toEqual(expectedResult);
});

it('Area Of Soreness Clicked - Adding Non-Bilateral Body Part', () => {
    let bodyPartIndex = 3;
    let expectedResult = helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartExpectedResult(bodyPartIndex);
    let stateObject = helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartStateObject(bodyPartIndex);
    let areaClicked = helperFunctions.getAreaOfSorenessNonBilateralAreaClicked();
    let soreBodyPartsPlan = {body_parts: []};
    expect(PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, false, soreBodyPartsPlan)).toEqual(expectedResult);
});

it('Area Of Soreness Clicked - Removing Bilateral Body Part', () => {
    let bodyPartIndex = 7;
    let expectedResult = helperFunctions.getAreaOfSorenessRemovingBilateralBodyPartExpectedResult(bodyPartIndex);
    let stateObject = helperFunctions.getAreaOfSorenessRemovingBilateralBodyPartStateObject(bodyPartIndex);
    let areaClicked = helperFunctions.getAreaOfSorenessBilateralAreaClicked();
    let soreBodyPartsPlan = {body_parts: []};
    expect(PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, false, soreBodyPartsPlan)).toEqual(expectedResult);
});

it('Area Of Soreness Clicked - Removing Non-Bilateral Body Part', () => {
    let bodyPartIndex = 3;
    let expectedResult = helperFunctions.getAreaOfSorenessRemovingNonBilateralBodyPartExpectedResult(bodyPartIndex);
    let stateObject = helperFunctions.getAreaOfSorenessRemovingNonBilateralBodyPartStateObject(bodyPartIndex);
    let areaClicked = helperFunctions.getAreaOfSorenessNonBilateralAreaClicked();
    let soreBodyPartsPlan = {body_parts: []};
    expect(PlanLogic.handleAreaOfSorenessClick(stateObject, areaClicked, false, soreBodyPartsPlan)).toEqual(expectedResult);
});

it('Area Of Soreness Clicked - No, All Good Button Clicked', () => {
    let stateObject = {soreness: []};
    let soreBodyPartsPlan = {body_parts: []};
    expect(PlanLogic.handleAreaOfSorenessClick(stateObject, false, true, soreBodyPartsPlan)).toEqual([]);
});

it('Daily Readiness Form Change - Readiness Input', () => {
    let key = 3;
    let expectedResult = helperFunctions.getDailyReadinessReadinessInputExpectedResult(key);
    let value = (key * 2);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('readiness', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Sleep Quality Input', () => {
    let key = 3;
    let expectedResult = helperFunctions.getDailyReadinessSleepQualityInputExpectedResult(key);
    let value = (key * 2);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('sleep_quality', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Wants FS Input - T', () => {
    let value = true;
    let expectedResult = helperFunctions.getDailyReadinessFSInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('wants_functional_strength', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Wants FS Input - F', () => {
    let value = false;
    let expectedResult = helperFunctions.getDailyReadinessFSInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('wants_functional_strength', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Current Position Input', () => {
    let value = 0;
    let expectedResult = helperFunctions.getDailyReadinessCurrentPositionInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('current_position', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Current Sport Name Input', () => {
    let value = 0;
    let expectedResult = helperFunctions.getDailyReadinessCurrentSportNameInputExpectedResult(value);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('current_sport_name', value, false, false, false, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Soreness for NEW bodyPart WITH pain Input', () => {
    let bodyPartIndex = 8;
    let side = 1;
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Soreness for NEW bodyPart WITHOUT pain Input', () => {
    let bodyPartIndex = 3;
    let side = 0;
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, false, bodyPartIndex, side, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Soreness for EXSISTING bodyPart WITH pain Input', () => {
    let bodyPartIndex = 9;
    let side = 2;
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side);
    let dailyReadinessDefaultStateWithBodyPart = helperFunctions.getDailyReadinessDefaultStateWithBodyPart(bodyPartIndex, side);
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, dailyReadinessDefaultStateWithBodyPart)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Soreness for EXSISTING bodyPart WITH pain Input', () => {
    let bodyPartIndex = 10;
    let side = 1;
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side);
    let dailyReadinessDefaultStateWithBodyPart = helperFunctions.getDailyReadinessDefaultStateWithBodyPart(bodyPartIndex, side);
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, false, bodyPartIndex, side, dailyReadinessDefaultStateWithBodyPart)).toEqual(expectedResult);
});

it('Post Session Form Change - RPE Input', () => {
    let key = 3;
    let expectedResult = helperFunctions.getPostSessionRPEInputExpectedResult(key);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('RPE', key, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Soreness for NEW bodyPart WITH pain Input', () => {
    let bodyPartIndex = 4;
    let side = 1;
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Soreness for NEW bodyPart WITHOUT pain Input', () => {
    let bodyPartIndex = 11;
    let side = 2;
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, false, bodyPartIndex, side, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Soreness for EXSISTING bodyPart WITH pain Input', () => {
    let bodyPartIndex = 12;
    let side = 0;
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side);
    let postSessionDefaultStateWithBodyPart = helperFunctions.getPostSessionDefaultStateWithBodyPart(bodyPartIndex, side);
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, postSessionDefaultStateWithBodyPart)).toEqual(expectedResult);
});

it('Post Session Form Change - Soreness for EXSISTING bodyPart WITH pain Input', () => {
    let bodyPartIndex = 18;
    let side = 0;
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side);
    let postSessionDefaultStateWithBodyPart = helperFunctions.getPostSessionDefaultStateWithBodyPart(bodyPartIndex, side);
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, false, bodyPartIndex, side, postSessionDefaultStateWithBodyPart)).toEqual(expectedResult);
});

it('Post Session Form Change - Event Date Input', () => {
    let date = '2018-10-31T15:00:00Z';
    let expectedResult = helperFunctions.getPostSessionEventDateInputExpectedResult(date);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('event_date', date, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Duration Input', () => {
    let duration = 30;
    let expectedResult = helperFunctions.getPostSessionDurationInputExpectedResult(duration);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('duration', duration, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Session Type Input', () => {
    let sessionType = 2;
    let expectedResult = helperFunctions.getPostSessionSessionTypeInputExpectedResult(sessionType);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('session_type', sessionType, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Sport Name Input', () => {
    let sportName = 0;
    let expectedResult = helperFunctions.getPostSessionSportNameInputExpectedResult(sportName);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('sport_name', sportName, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Strength and Conditioning Type Input', () => {
    let strengthConditioningType = 2;
    let expectedResult = helperFunctions.getPostSessionStrengthAndConditioningTypeInputExpectedResult(strengthConditioningType);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('strength_and_conditioning_type', strengthConditioningType, false, false, false, postSessionDefaultState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationAPExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Prep Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_PREP', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_PREP', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationARExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Active Recovery Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_ACTIVE_RECOVERY', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_ACTIVE_RECOVERY', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationReadinessExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Daily Readiness Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('COMPLETE_DAILY_READINESS', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('COMPLETE_DAILY_READINESS', helperProps);
    let expectedResult = helperFunctions.getPushNotificationIgnoreExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - FTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TFF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TTF', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TFT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('View Plan Push Notification Result - TTT', () => {
    let helperProps = helperFunctions.getPushNotificationHelperProps('VIEW_PLAN', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('VIEW_PLAN', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FFF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FFT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FTT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - FTF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', false, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TFF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, false, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TTF', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, true, false);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TFT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, false, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});

it('Error State Push Notification Result - TTT', () => {
    // error condition should still return plan result to simulate everything is fine
    let helperProps = helperFunctions.getPushNotificationHelperProps('FATHOM_BREAK', true, true, true);
    let helperState = helperFunctions.getPushNotificationHelperState('FATHOM_BREAK', helperProps);
    let expectedResult = helperFunctions.getPushNotificationPlanExpectedResult();
    expect(PlanLogic.handlePushNotification(helperProps, helperState)).toEqual(expectedResult);
});
