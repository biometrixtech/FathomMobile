/* global it expect jest */
/* global it expect beforeAll */
import 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// import logic file(s)
import { PlanLogic, } from '../';

// Consts and Libs
import { MyPlan as MyPlanConstants, } from '../../constants';

// mock async-storage
beforeAll(() => {
    jest.mock('@react-native-community/async-storage');
});

// setup helper functions
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

    getDailyReadinessDefaultState: (current_position = null, current_sport_name = null, readiness = 0, sleep_quality = 0, soreness = [], wants_functional_strength = null) => {
        let dailyReadinessDefaultState = {
            current_position,
            current_sport_name,
            readiness,
            sleep_quality,
            soreness,
            wants_functional_strength,
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

    getPostSessionDefaultState: (RPE = 0, description = '', duration = 0, event_date = null, session_type = null, soreness = [], sport_name = null, strength_and_conditioning_type = null) => {
        let postSessionState = {
            RPE,
            description,
            duration,
            event_date,
            session_type,
            soreness,
            sport_name,
            strength_and_conditioning_type,
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

    getDailyReadinessNewBodyPartSorenessWithPainInputExpectedResult: (bodyPartIndex, side, isClearCandidate = false) => {
        let sorenessObj = {body_part: bodyPartIndex, pain: true, severity: null, side: side};
        if(isClearCandidate) {
            sorenessObj = {body_part: bodyPartIndex, pain: true, severity: null, side: side, isClearCandidate: false};
        }
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [sorenessObj],
            wants_functional_strength: null
        };
        return expectedResult;
    },

    getDailyReadinessNewBodyPartSorenessWithoutPainInputExpectedResult: (bodyPartIndex, side, isClearCandidate = false) => {
        let sorenessObj = {body_part: bodyPartIndex, pain: false, severity: null, side: side};
        if(isClearCandidate) {
            sorenessObj = {body_part: bodyPartIndex, pain: false, severity: null, side: side, isClearCandidate: false};
        }
        let expectedResult = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 0,
            sleep_quality:             0,
            soreness:                  [sorenessObj],
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

    getPostSessionNewBodyPartSorenessWithoutPainInputExpectedResult: (bodyPartIndex, side, isClearCandidate = false) => {
        let sorenessObj = {body_part: bodyPartIndex, pain: false, severity: null, side: side};
        if(isClearCandidate) {
            sorenessObj = {body_part: bodyPartIndex, pain: false, severity: null, side: side, isClearCandidate: false,};
        }
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [sorenessObj],
            sport_name:                     null,
            strength_and_conditioning_type: null,
        };
        return expectedResult;
    },

    getPostSessionNewBodyPartSorenessWithPainInputExpectedResult: (bodyPartIndex, side, isClearCandidate = false) => {
        let sorenessObj = {body_part: bodyPartIndex, pain: true, severity: null, side: side};
        if(isClearCandidate) {
            sorenessObj = {body_part: bodyPartIndex, pain: true, severity: null, side: side, isClearCandidate: false,};
        }
        let expectedResult = {
            RPE:                            0,
            description:                    '',
            duration:                       0,
            event_date:                     null,
            session_type:                   null,
            soreness:                       [sorenessObj],
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
            helping_verb: 'have',
            image:        {0: 'Abs.svg',},
            index:        3,
            label:        'Abdominals',
            location:     'upper body',
            order:        1
        };
        return nonBilateralAreaClicked;
    },

    getAreaOfSorenessAddingBilateralBodyPartExpectedResult: (bodyPartIndex, isPain = false) => {
        let expectedResult = [
            { body_part: bodyPartIndex, pain: isPain, severity: null, side: 1 },
            { body_part: bodyPartIndex, pain: isPain, severity: null, side: 2 },
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
            helping_verb: 'has',
            image:        {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'},
            index:        7,
            label:        'knee',
            location:     'lower body',
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

    getDefaultDurationValuesFromState: (durationHours, durationMinutes, durationLabel) => {
        return {
            durationValueGroups: {
                hours:   durationHours,
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

    handleSoreBodyParts: (bodyPartIndex, side = 0) => {
        return {
            body_parts: [
                {
                    body_part: bodyPartIndex,
                    side:      side,
                }
            ],
            hist_sore_status: [],
            clear_candidates: [],
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
            ['upper body']: [
                {index: 1, order: 3, label: 'Shoulder', location: 'upper body', group: 'muscle', image: {0: 'Shoulder.svg', 1: 'L_Shoulder.svg', 2: 'R_Shoulder.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 2, order: 1, label: 'Pecs', location: 'upper body', group: 'muscle', image: {0: 'Pec.svg', 1: 'L_Pec.svg', 2: 'R_Pec.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 3, order: 2, label: 'Abdominals', location: 'upper body', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'have'},
                {index: 12, order: 6, label: 'Lower Back', location: 'upper body', group: 'muscle', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'has'},
                {index: 18, order: 4, label: 'Upper Back', location: 'upper body', group: 'muscle', image: {0: 'UpperBackNeck.svg'}, bilateral: false, helping_verb: 'has'},
                {index: 19, order: 8, label: 'Elbow', location: 'upper body', group: 'joint', image: {0: 'Elbow.svg', 1: 'L_Elbow.svg', 2: 'R_Elbow.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 20, order: 7, label: 'Wrist', location: 'upper body', group: 'joint', image: {0: 'Wrist.svg', 1: 'L_Wrist.svg', 2: 'R_Wrist.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 21, order: 5, label: 'Lats', location: 'upper body', group: 'muscle', image: {0: 'Lats.svg', 1: 'L_Lats.svg', 2: 'R_Lats.svg'}, bilateral: true, helping_verb: 'has'},
            ],
            ['lower body']: [
                {index: 4, order: 9, label: 'Hip', location: 'lower body', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 5, order: 10, label: 'Groin', location: 'lower body', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 6, order: 12, label: 'Quads', location: 'lower body', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 7, order: 15, label: 'Knee', location: 'lower body', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 8, order: 16, label: 'Shin', location: 'lower body', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 9, order: 18, label: 'Ankle', location: 'lower body', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 10, order: 19, label: 'Foot', location: 'lower body', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 11, order: 13, label: 'IT Band', location: 'lower body', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 14, order: 11, label: 'Glutes', location: 'lower body', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 15, order: 14, label: 'Hamstrings', location: 'lower body', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 16, order: 17, label: 'Calves', location: 'lower body', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 17, order: 20, label: 'Achilles', location: 'lower body', group: 'joint', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'has'},
            ],
        }
    },

    getPostSessionSurveyPostSession: (rpe, soreness, event_date) => {
        return {
            RPE: rpe,
            soreness,
            event_date,
        };
    },

    soreBodyPartLeftGlute: () => {
        let leftGlute = {
            bilateral:    true,
            group:        'muscle',
            helping_verb: 'has',
            image:        {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'},
            index:        14,
            label:        'Glutes',
            location:     'lower body',
            order:        11
        };
        return leftGlute;
    },

    soreBodyPartLowerBack: () => {
        let lowerBack = {
            bilateral:    false,
            group:        'muscle',
            helping_verb: 'has',
            image:        {0: 'LowBack.svg'},
            index:        12,
            label:        'Lower Back',
            location:     'upper body',
            order:        6
        };
        return lowerBack;
    },

    soreBodyPartRightHamstring: () => {
        let rightHamstring = {
            bilateral:    true,
            group:        'muscle',
            helping_verb: 'has',
            image:        {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'},
            index:        15,
            label:        'Hamstrings',
            location:     'lower body',
            order:        14
        };
        return rightHamstring;
    },

    soreBodyPartRenderLogicExpectedResult: (bodyPartMap, bodyPartName, bodyPartGroup, helpingVerb, sorenessPainMapping) => {
        return {
            bodyPartGroup,
            bodyPartMap,
            bodyPartName,
            helpingVerb,
            sorenessPainMapping,
        };
    },

    jointLevelsOfSoreness: () => {
        return [
            '',
            'Ache',
            'Dull Pain',
            'Sharp Pain',
            'Pain Limits Movement',
            'Too Painful to Move',
        ];
    },

    muscleLevelsOfSorenessAndPain: isSoreness => {
        return {
            soreness: [
                { label: 'MILD', value: 1,},
                { label: 'MODERATE', value: 3,},
                { label: 'SEVERE', value: 5,},
            ],
            movement: [
                { label: 'NOT\nLIMITED', value: 1,},
                { label: 'LIMITED', value: 3,},
                { label: 'VERY\nLIMITED', value: 5,},
            ],
        };
    },

    readinessSurveyRenderLogicExpectedResult: (functionalStrengthTodaySubtext, isFirstFunctionalStrength, isFormValid, isFormValidItems, isSecondFunctionalStrength, newSoreBodyParts, partOfDay, selectedSportPositions) => {
        return {
            functionalStrengthTodaySubtext,
            isFirstFunctionalStrength,
            isFormValid,
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
            selectedSportPositions,
        }
    },

    readinessSurveyRenderLogicSoreBodyParts: (body_parts, completed_functional_strength_sessions, current_position, current_sport_name, functional_strength_eligible) => {
        return {
            body_parts,
            completed_functional_strength_sessions,
            current_position,
            current_sport_name,
            functional_strength_eligible,
            hist_sore_status: [],
            clear_candidates: [],
        };
    },

    filteredSportSessionTypes: toIgnoreSelected => {
        if(toIgnoreSelected) {
            return [
                {
                    index:           2,
                    order:           2,
                    label:           'Competition',
                    ignoreSelection: false
                },
                {
                    index:           6,
                    order:           3,
                    label:           'Training',
                    ignoreSelection: false
                },
            ];
        }
        return [
            {
                index:           0,
                order:           1,
                label:           'Practice',
                ignoreSelection: true
            },
            {
                index:           2,
                order:           2,
                label:           'Competition',
                ignoreSelection: false
            },
            {
                index:           6,
                order:           3,
                label:           'Training',
                ignoreSelection: false
            },
        ];
    },

    getStrengthConditioningTypes: () => {
        return [
            { index: 0, order: 1, label: 'Endurance', icon: 'run', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
            { index: 1, order: 2, label: 'Power', icon: 'ios-fitness', iconType: 'ionicon', activitySection: 'exercise_and_fitness', },
            { index: 2, order: 3, label: 'Speed & Agility', icon: 'run-fast', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
            { index: 3, order: 4, label: 'Strength', icon: 'ios-fitness', iconType: 'ionicon', activitySection: '', },
            { index: 4, order: 5, label: 'Cross Training', icon: 'checkbox-multiple-marked-outline', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
        ];
    },

    getTeamSports: () => {
        return [
            { index: 0, label: 'Basketball', positions: ['Center', 'Forward', 'Guard'], imagePath: require('../../../assets/images/sports_images/icons8-basketball-player-200.png'), activitySection: 'team_sports', },
            { index: 1, label: 'Baseball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], imagePath: require('../../../assets/images/sports_images/icons8-baseball-player-200.png'), activitySection: 'team_sports', },
            { index: 2, label: 'Softball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], imagePath: require('../../../assets/images/sports_images/icons8-baseball-player-200.png'), activitySection: 'team_sports', },
            { index: 3, label: 'Cycling', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-cycling-200.png'), activitySection: ['exercise_and_fitness', 'outdoor_activities'], },
            { index: 4, label: 'Field Hockey', positions: ['Goalie', 'Fullback', 'Midfielder', 'Forward'], imagePath: require('../../../assets/images/sports_images/icons8-field-hockey-200.png'), activitySection: 'team_sports', },
            { index: 5, label: 'Football', positions: ['Defensive Back', 'Kicker', 'Linebacker', 'Lineman', 'Quarterback', 'Receiver', 'Running Back'], imagePath: require('../../../assets/images/sports_images/icons8-american-football-200.png'), activitySection: 'team_sports', },
            { index: 6, label: 'General Fitness', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: '', },
            { index: 7, label: 'Golf', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-golf-200.png'), activitySection: ['individual_sports', 'outdoor_activities'], },
            { index: 8, label: 'Gymnastics', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-gymnastics-200.png'), activitySection: 'individual_sports', },
            { index: 9, label: 'Skating Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-speed-skating-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 10, label: 'Lacrosse', positions: ['Attacker', 'Defender', 'Goalie', 'Midfielder'], imagePath: require('../../../assets/images/sports_images/icons8-lacrosse-stick-200.png'), activitySection: 'team_sports', },
            { index: 11, label: 'Rowing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-row-boat-200.png'), activitySection: 'water_activities', },
            { index: 12, label: 'Rugby', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-rugby-sevens-200.png'), activitySection: 'team_sports', },
            { index: 13, label: 'Diving', positions: false, imagePath: null, activitySection: '', },
            { index: 14, label: 'Soccer', positions: ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker'], imagePath: require('../../../assets/images/sports_images/icons8-soccer-200.png'), activitySection: 'team_sports', },
            { index: 15, label: 'Water Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-swimming-200.png'), activitySection: ['individual_sports', 'water_activities'], },
            { index: 16, label: 'Tennis', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-tennis-player-200.png'), activitySection: ['individual_sports', 'racket_sports'], },
            { index: 17, label: 'Running', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-running-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 18, label: 'Sprints', positions: false, imagePath: null, activitySection: '', },
            { index: 19, label: 'Jumps', positions: false, imagePath: null, activitySection: '', },
            { index: 20, label: 'Throws', positions: false, imagePath: null, activitySection: '', },
            { index: 21, label: 'Volleyball', positions: ['Hitter', 'Setter', 'Middle Blocker', 'Libero'], imagePath: require('../../../assets/images/sports_images/icons8-volleyball-player-200.png'), activitySection: 'team_sports', },
            { index: 22, label: 'Wrestling', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-wrestling-200.png'), activitySection: ['martial_arts', 'individual_sports'], },
            { index: 23, label: 'Weightlifting', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-weightlifting-200.png'), activitySection: 'individual_sports', },
            { index: 24, label: 'Track & Field', positions: ['Sprinter', 'Jumper', 'Thrower', 'Distance'], imagePath: require('../../../assets/images/sports_images/icons8-track-and-field-200.png'), activitySection: 'individual_sports', },
            { index: 25, label: 'Archery', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-archery-200.png'), activitySection: 'individual_sports', },
            { index: 26, label: 'Australian Football', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-rugby-sevens-200.png'), activitySection: 'team_sports', },
            { index: 27, label: 'Badminton', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-badminton-player-200.png'), activitySection: 'racket_sports', },
            { index: 28, label: 'Bowling', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-bowling-200.png'), activitySection: 'individual_sports', },
            { index: 29, label: 'Boxing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-boxing-200.png'), activitySection: 'martial_arts', },
            { index: 30, label: 'Cricket', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-cricketer-200.png'), activitySection: 'team_sports', },
            { index: 31, label: 'Curling', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-curling-stone-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 32, label: 'Dance', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-dancing-200.png'), activitySection: 'studio_activities', },
            { index: 33, label: 'Equestrian Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-horseback-riding-200.png'), activitySection: 'outdoor_activities', },
            { index: 34, label: 'Fencing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-fencing-200.png'), activitySection: 'individual_sports', },
            { index: 35, label: 'Fishing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-sports-fishing-200.png'), activitySection: 'outdoor_activities', },
            { index: 36, label: 'Handball', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-handball-200.png'), activitySection: 'team_sports', },
            { index: 37, label: 'Hockey', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-ice-hockey-200.png'), activitySection: 'team_sports', },
            { index: 38, label: 'Martial Arts', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-judo-200.png'), activitySection: 'martial_arts', },
            { index: 39, label: 'Paddle Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-sup-200.png'), activitySection: 'water_activities', },
            { index: 40, label: 'Racquetball', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-racquetball-200.png'), activitySection: 'racket_sports', },
            { index: 41, label: 'Sailing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-sailing-200.png'), activitySection: 'water_activities', },
            { index: 42, label: 'Snow Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-nordic-combined-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 43, label: 'Squash', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-squash-racquet-200.png'), activitySection: 'racket_sports', },
            { index: 44, label: 'Surfing Sports', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-surfing-200.png'), activitySection: 'water_activities', },
            { index: 45, label: 'Swimming', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-swimming-200.png'), activitySection: 'water_activities', },
            { index: 46, label: 'Table Tennis', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-table-tennis-200.png'), activitySection: 'racket_sports', },
            { index: 47, label: 'Water Polo', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-water-polo-200.png'), activitySection: 'water_activities', },
            { index: 48, label: 'Cross Country Skiing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-cross-country-skiing-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 49, label: 'Downhill Skiing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-alpine-skiing-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 50, label: 'Kick Boxing', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-fight-200.png'), activitySection: 'martial_arts', },
            { index: 51, label: 'Snowboarding', positions: false, imagePath: require('../../../assets/images/sports_images/icons8-snowboarding-200.png'), activitySection: 'snow_and_ice_sports', },
            { index: 52, label: 'Endurance', imagePath: require('../../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 53, label: 'Power', imagePath: require('../../../assets/images/sports_images/icons8-bench-press-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 54, label: 'Speed & Agility', imagePath: require('../../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 55, label: 'Strength', imagePath: require('../../../assets/images/sports_images/icons8-bench-press-200.png'), activitySection: '', },
            { index: 56, label: 'Cross Training', imagePath: require('../../../assets/images/sports_images/icons8-crossfit-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 57, label: 'Elliptical', imagePath: require('../../../assets/images/sports_images/icons8-treadmill-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 58, label: 'Functional Strength Training', imagePath: require('../../../assets/images/sports_images/icons8-deadlift-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 59, label: 'Hiking', imagePath: require('../../../assets/images/sports_images/icons8-trekking-200.png'), activitySection: 'outdoor_activities', },
            { index: 60, label: 'Hunting', imagePath: require('../../../assets/images/sports_images/icons8-shooting-200.png'), activitySection: 'outdoor_activities', },
            { index: 61, label: 'Mind & Body', imagePath: require('../../../assets/images/sports_images/icons8-meditation-200.png'), activitySection: 'studio_activities', },
            { index: 62, label: 'Play', imagePath: require('../../../assets/images/sports_images/icons8-frisbee-200.png'), activitySection: 'outdoor_activities', },
            { index: 63, label: 'Preparation & Recovery', imagePath: require('../../../assets/images/sports_images/icons8-warm-up-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 64, label: 'Stair Climbing', imagePath: require('../../../assets/images/sports_images/icons8-staircase-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 65, label: 'Traditional Strength Training', imagePath: require('../../../assets/images/sports_images/icons8-deadlift-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 66, label: 'Walking', imagePath: require('../../../assets/images/sports_images/icons8-walking-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 67, label: 'Water Fitness', imagePath: require('../../../assets/images/sports_images/icons8-swim-200.png'), activitySection: 'water_activities', },
            { index: 68, label: 'Yoga', imagePath: require('../../../assets/images/sports_images/icons8-yoga-200.png'), activitySection: 'studio_activities', },
            { index: 69, label: 'Barre', imagePath: require('../../../assets/images/sports_images/icons8-pullups-200.png'), activitySection: 'studio_activities', },
            { index: 70, label: 'Core Training', imagePath: require('../../../assets/images/sports_images/icons8-sit-ups-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 71, label: 'Flexibility', imagePath: require('../../../assets/images/sports_images/icons8-warm-up-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 72, label: 'High Intensity Interval Training', imagePath: require('../../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 73, label: 'Jump Rope', imagePath: require('../../../assets/images/sports_images/icons8-jump-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 74, label: 'Pilates', imagePath: require('../../../assets/images/sports_images/icons8-pilates-200.png'), activitySection: 'studio_activities', },
            { index: 75, label: 'Stairs', imagePath: require('../../../assets/images/sports_images/icons8-staircase-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 76, label: 'Step Training', imagePath: require('../../../assets/images/sports_images/icons8-stepper-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 77, label: 'Wheelchair Walk Pace', imagePath: require('../../../assets/images/sports_images/icons8-handicapped-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 78, label: 'Wheelchair Run Pace', imagePath: require('../../../assets/images/sports_images/icons8-handicapped-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 79, label: 'Tai Chi', imagePath: require('../../../assets/images/sports_images/icons8-taekwondo-200.png'), activitySection: 'martial_arts', },
            { index: 80, label: 'Mixed Cardio', imagePath: require('../../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 81, label: 'Hand Cycling', imagePath: require('../../../assets/images/sports_images/icons8-rowing-machine-200.png'), activitySection: 'exercise_and_fitness', },
            { index: 82, label: 'Climbing', imagePath: require('../../../assets/images/sports_images/icons8-climbing-200.png'), activitySection: 'outdoor_activities', },
            { index: 83, label: 'Other', imagePath: require('../../../assets/images/sports_images/icons8-netball-200.png'), activitySection: 'other_activities', },
        ];
    },

    readinessSurveyPageState: (durationValueGroups, isFormValid, pickerScrollCount, step, timeValueGroups) => {
        return {
            durationValueGroups,
            isFormValid,
            pickerScrollCount,
            step,
            timeValueGroups,
        };
    },

    sportScheduleBuilderRenderLogicExpectedResult: (durationText, filteredSportSessionTypes, selectedSport, sportText, startTimeText, strengthConditioningTypes, teamSports) => {
        return {
            durationText,
            filteredSportSessionTypes,
            selectedSport,
            sportText,
            startTimeText,
            strengthConditioningTypes,
            teamSports,
        };
    },

    getAthleteCardSelectedAthlete: (color, first_name,last_name) => {
        return {
            color,
            first_name,
            last_name,
        };
    },

    athleteCardModalRenderLogicExpectedResult: (athleteName, mainColor, subHeader) => {
        return {
            athleteName,
            mainColor,
            subHeader,
        };
    },

    getCoachesDashboardSingleTeamData: (teamName, value) => {
        return {
            athletes:   [{}, {}, {}, {}, {}, {}, {}],
            compliance: {
                complete: [
                    {first_name: 'Dipesh', last_name: 'Gautam'},
                    {first_name: 'Mazen', last_name: 'Chami'},
                ],
                incomplete: [
                    {first_name: 'Paul', last_name: 'LaForge'},
                    {first_name: 'Gabby', last_name: 'Levac'},
                    {first_name: 'Chris', last_name: 'Perry'},
                    {first_name: 'Melissa', last_name: 'White'},
                    {first_name: 'Ivonna', last_name: 'Dumanyan'},
                ]
            },
            daily_insights:  [{}],
            label:           teamName.toUpperCase(),
            name:            teamName,
            value:           value,
            weekly_insights: [{
                add_variety:               [],
                address_pain_soreness:     [],
                balance_overtraining_risk: [],
                increase_workload:         [],
            }],
        };
    },

    getCoachesDashboardMultipleTeamsData: (firstTeamName, secondTeamName) => {
        return [
            helperFunctions.getCoachesDashboardSingleTeamData(firstTeamName, 0),
            helperFunctions.getCoachesDashboardSingleTeamData(secondTeamName, 1)
        ];
    },

    getCoachesDashboardRenderLogicExpectedResult: (coachesTeams, completedAthletes, complianceColor, incompleteAthletes, numOfCompletedAthletes, numOfIncompletedAthletes, numOfTotalAthletes, selectedTeam, trainingCompliance) => {
        return {
            coachesTeams,
            completedAthletes,
            complianceColor,
            incompleteAthletes,
            numOfCompletedAthletes,
            numOfIncompletedAthletes,
            numOfTotalAthletes,
            selectedTeam,
            trainingCompliance,
        };
    },

    getCoachesDashboardSectionRenderLoopLogicAthlets: () => {
        return [
            {color: 0, first_name: 'Dipesh', last_name: 'Gautam', user_id: '1'},
            {color: 1, first_name: 'Mazen', last_name: 'Chami', user_id: '2'},
            {color: 2, first_name: 'Paul', last_name: 'LaForge', user_id: '3'},
            {color: 2, first_name: 'Melissa', last_name: 'White', user_id: '4'},
        ];
    },

    getCoachesDashboardSectionRenderLoopLogicItem: (first_name, last_name, color, user_id, didUserCompleteReadinessSurvey) => {
        return {
            didUserCompleteReadinessSurvey,
            first_name,
            last_name,
            color,
            user_id,
        };
    },

    getRenderCoachesDashboardSectionExpectedResult: (athleteFName, athleteLName, backgroundColor, filteredAthlete) => {
        return {
            athleteName: `${athleteFName.toUpperCase()}\n${athleteLName.charAt(0).toUpperCase()}.`,
            backgroundColor,
            filteredAthlete,
        }
    },

    getSearchAreaWeeklyInsights: hasInsights => {
        return {
            add_variety_to_training_risk: [],
            address_pain_or_soreness:     hasInsights ? ['ADDRESS'] : [],
            all_good:                     [],
            balance_overtraining_risk:    [],
            evaluate_health_status:       hasInsights ? ['EVALUATE'] : [],
            increase_weekly_workload:     [],
        };
    },

    getSearchAreaWeeklyInsightsExpectedResult: doWeHaveWeeklyInsights => {
        return {
            doWeHaveWeeklyInsights,
        };
    },

    readinessSurveyRenderLogicFormValidItems: (areAreasOfSorenessValid, areQuestionsValid, isFunctionalStrengthValid, isPrevSorenessValid, isSecondFunctionalStrengthValid, isTrainedTodayValid, selectAreasOfSorenessValid, willTrainLaterValid) => {
        return {
            areAreasOfSorenessValid,
            areQuestionsValid,
            isFunctionalStrengthValid,
            isPrevSorenessValid,
            isSecondFunctionalStrengthValid,
            isTrainedTodayValid,
            selectAreasOfSorenessValid,
            willTrainLaterValid,
        };
    },

    postSessionRenderLogicFormValidItems: (areAreasOfSorenessValid, isPrevSorenessValid, selectAreasOfSorenessValid, areQuestionsValid) => {
        return {
            areAreasOfSorenessValid,
            areQuestionsValid,
            isPrevSorenessValid,
            selectAreasOfSorenessValid,
        };
    },

    getReadinessSurveySingleSessionValidationSession: (RPE, sport_name, duration, session_type) => {
        return {
            post_session_survey: {
                RPE,
            },
            sport_name,
            duration,
            session_type,
        };
    },

    getPostSessionSurveySingleSessionValidationSession: (RPE, sport_name, duration, session_type) => {
        return {
            RPE,
            sport_name,
            duration,
            session_type,
        };
    },

    getSportScheduleBuilderRef: isFormValid => {
        return {
            state: {
                durationValueGroups: {minutes: 4, label: 1},
                pickerScrollCount:   2,
                step:                3,
                timeValueGroups:     {hours: 2, minutes: 2, amPM: 1},
                isFormValid,
            }
        };
    },

    getSingleSessionValidationExpectedResult: (isRPEValid, isSportValid, sportText) => {
        return {
            isRPEValid,
            isSportValid,
            sportText,
        };
    },

    getSoreBodyPartsBodyParts: () => {
        return {
            body_parts:       [{body_part: 6, side: 1, pain: true, status: 'persistent_pain'}, {body_part: 6, side: 1, pain: true, status: 'persistent_pain'}],
            hist_sore_status: [],
            clear_candidates: [],
        };
    },

    getSoreBodyPartsHistSoreStatus: () => {
        return {
            body_parts:       [],
            hist_sore_status: [{body_part: 3, side: 0, pain: false, status: 'persistent_soreness'}, {body_part: 12, side: 0, pain: true, status: 'persistent_2_pain'}],
            clear_candidates: [],
        };
    },

    getSoreBodyPartsClearCandidates: () => {
        return {
            body_parts:       [],
            hist_sore_status: [],
            clear_candidates: [{body_part: 12, side: 0, pain: true, status: 'persistent_2_pain', isClearCandidate: true,}],
        };
    },

    getAllSoreBodyParts: () => {
        return {
            body_parts:       [{body_part: 6, side: 1, pain: true, status: 'persistent_pain'}, {body_part: 6, side: 1, pain: true, status: 'persistent_pain'}],
            hist_sore_status: [{body_part: 3, side: 0, pain: false, status: 'persistent_soreness'}],
            clear_candidates: [{body_part: 12, side: 0, pain: true, status: 'persistent_2_pain', isClearCandidate: true,}],
        };
    },

    getExerciseTimersExecptedResult: (number_of_sets, pre_start_time, seconds_per_set, switch_sides_time, up_next_interval) => {
        return {
            number_of_sets,
            pre_start_time,
            seconds_per_set,
            switch_sides_time,
            up_next_interval,
        }
    },

    getFSModalExpectedResult: (hasPositions, isValid, selectedSportPositions) => {
        return {
            hasPositions,
            isValid,
            selectedSportPositions,
        }
    },

    getExercisesRenderLogicExpectedResult: (availableSectionsCount, cleanedExerciseList, flatListExercises, firstItemIndex) => {
        return {
            availableSectionsCount,
            cleanedExerciseList,
            flatListExercises,
            firstItemIndex,
        }
    },

    getSingleSectionSampleExerciseList: () => {
        return {
            cleanedExerciseList: {'FOAM ROLL': [{library_id: 0, set_number: 1,}, {library_id: 1, set_number: 1,}, {library_id: 2, set_number: 1,}, {library_id: 3, set_number: 1,}, {library_id: 4, set_number: 1,}], 'STRETCH': [], 'ACTIVATE': [], 'INTEGRATE': [],},
            flatListExercises:   [{library_id: 0, set_number: 1,}, {library_id: 1, set_number: 1,}, {library_id: 2, set_number: 1,}, {library_id: 3, set_number: 1,}, {library_id: 4, set_number: 1,}],
        }
    },

    getTwoSectionsSampleExerciseList: () => {
        return {
            cleanedExerciseList: {
                'FOAM ROLL': [{library_id: 0, set_number: 1,}, {library_id: 1, set_number: 1,}, {library_id: 2, set_number: 1,}, {library_id: 3, set_number: 1,}, {library_id: 4, set_number: 1,}],
                'STRETCH':   [{library_id: 5, set_number: 1,}, {library_id: 6, set_number: 1,}, {library_id: 7, set_number: 1,}, {library_id: 8, set_number: 1,}, {library_id: 9, set_number: 1,}],
                'ACTIVATE':  [],
                'INTEGRATE': [],
            },
            flatListExercises: [{library_id: 0, set_number: 1,}, {library_id: 1, set_number: 1,}, {library_id: 2, set_number: 1,}, {library_id: 3, set_number: 1,}, {library_id: 4, set_number: 1,}, {library_id: 5, set_number: 1,}, {library_id: 6, set_number: 1,}, {library_id: 7, set_number: 1,}, {library_id: 8, set_number: 1,}, {library_id: 9, set_number: 1,}],
        }
    },

    getHealthKitWorkoutExpectedResult: (partOfDay, sportDuration, sportImage, sportName, sportStartTime, sportText) => {
        return {
            partOfDay,
            sportDuration,
            sportImage,
            sportName,
            sportStartTime,
            sportText,
        }
    },

};

// setup tests
it('HealthKit Workout Page Render Logic - Evening Tennis', () => {
    let workout = {
        sport_name: 79,
        duration:   100,
        event_date: '2019-01-10T18:00:00',
    };
    let expectedResult = helperFunctions.getHealthKitWorkoutExpectedResult(
        'evening',
        100,
        require('../../../assets/images/sports_images/icons8-taekwondo-200.png'),
        'Tai Chi',
        '11:00pm',
        '11:00pm tai chi workout'
    );
    expect(PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout)).toEqual(expectedResult);
});

it('HealthKit Workout Page Render Logic - Afternoon Tennis', () => {
    let workout = {
        sport_name: 16,
        duration:   60,
        event_date: '2019-01-10T11:00:00',
    };
    let expectedResult = helperFunctions.getHealthKitWorkoutExpectedResult(
        'afternoon',
        60,
        require('../../../assets/images/sports_images/icons8-tennis-player-200.png'),
        'Tennis',
        '4:00pm',
        '4:00pm tennis workout'
    );
    expect(PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout)).toEqual(expectedResult);
});

it('HealthKit Workout Page Render Logic - Morning Soccer', () => {
    let workout = {
        sport_name: 14,
        duration:   90,
        event_date: '2019-01-10T06:00:00',
    };
    let expectedResult = helperFunctions.getHealthKitWorkoutExpectedResult(
        'morning',
        90,
        require('../../../assets/images/sports_images/icons8-soccer-200.png'),
        'Soccer',
        '11:00am',
        '11:00am soccer workout'
    );
    expect(PlanLogic.handleHealthKitWorkoutPageRenderLogic(workout)).toEqual(expectedResult);
});

it('Exercises Render Logic - Two Sections - Selected Item Deeper in List', () => {
    let exerciseList = helperFunctions.getTwoSectionsSampleExerciseList();
    let selectedExercise = {library_id: 8, set_number: 1,};
    let expectedResult = helperFunctions.getExercisesRenderLogicExpectedResult(
        2,
        helperFunctions.getTwoSectionsSampleExerciseList().cleanedExerciseList,
        helperFunctions.getTwoSectionsSampleExerciseList().flatListExercises,
        8
    );
    expect(PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise)).toEqual(expectedResult);
});

it('Exercises Render Logic - Two Sections - Selected First Item', () => {
    let exerciseList = helperFunctions.getTwoSectionsSampleExerciseList();
    let selectedExercise = {library_id: 0, set_number: 1,};
    let expectedResult = helperFunctions.getExercisesRenderLogicExpectedResult(
        2,
        helperFunctions.getTwoSectionsSampleExerciseList().cleanedExerciseList,
        helperFunctions.getTwoSectionsSampleExerciseList().flatListExercises,
        0
    );
    expect(PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise)).toEqual(expectedResult);
});

it('Exercises Render Logic - Single Section', () => {
    let exerciseList = helperFunctions.getSingleSectionSampleExerciseList();
    let selectedExercise = {library_id: 2, set_number: 1,};
    let expectedResult = helperFunctions.getExercisesRenderLogicExpectedResult(
        1,
        helperFunctions.getSingleSectionSampleExerciseList().cleanedExerciseList,
        helperFunctions.getSingleSectionSampleExerciseList().flatListExercises,
        2
    );
    expect(PlanLogic.handleExercisesRenderLogic(exerciseList, selectedExercise)).toEqual(expectedResult);
});

it('FS Modal Render Logic - Sport (Soccer) WITH Position(s) - NOT Valid', () => {
    let functionalStrength = {current_sport_name: 14};
    let expectedResult = helperFunctions.getFSModalExpectedResult(true, false, ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker']);
    expect(PlanLogic.fsModalRenderLogic(functionalStrength)).toEqual(expectedResult);
});

it('FS Modal Render Logic - Sport (Soccer) WITH Position(s) - Valid', () => {
    let functionalStrength = {current_sport_name: 14, current_position: 2,};
    let expectedResult = helperFunctions.getFSModalExpectedResult(true, true, ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker']);
    expect(PlanLogic.fsModalRenderLogic(functionalStrength)).toEqual(expectedResult);
});

it('FS Modal Render Logic - Sport (Diving) WITHOUT Position(s) - Valid', () => {
    let functionalStrength = {current_sport_name: 13};
    let expectedResult = helperFunctions.getFSModalExpectedResult(false, true, []);
    expect(PlanLogic.fsModalRenderLogic(functionalStrength)).toEqual(expectedResult);
});

it('FS Modal Render Logic - Empty State', () => {
    let functionalStrength = {current_sport_name: null};
    let expectedResult = helperFunctions.getFSModalExpectedResult(false, false, []);
    expect(PlanLogic.fsModalRenderLogic(functionalStrength)).toEqual(expectedResult);
});

// it('Post Session Survey Previous Page & Validation Logic - Page 4 (Selected Areas of Soreness)', () => {
//     let currentPage = 4;
//     let pageState = {pageIndex: 6,};
//     let newSoreBodyParts = [];
//     let expectedResult = {pageNum: 5,};
//     expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts)).toEqual(expectedResult);
// });

// it('Post Session Survey Previous Page & Validation Logic - Page 3 (Areas of Soreness) - WITHOUT Sore Body Parts - TWO HK SESSIONS', () => {
//     let currentPage = 3;
//     let pageState = {pageIndex: 4,};
//     let newSoreBodyParts = [];
//     let expectedResult = {pageNum: 1,};
//     expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts, null, [{}, {}])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Previous Page & Validation Logic - Page 3 (Areas of Soreness) - WITHOUT Sore Body Parts - TWO SESSIONS', () => {
//     let currentPage = 3;
//     let pageState = {pageIndex: 4,};
//     let newSoreBodyParts = [];
//     let expectedResult = {pageNum: 2,};
//     expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts, [{}, {}])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Previous Page & Validation Logic - Page 3 (Areas of Soreness) - WITHOUT Sore Body Parts - NO Sessions', () => {
//     let currentPage = 3;
//     let pageState = {pageIndex: 4,};
//     let newSoreBodyParts = [];
//     let expectedResult = {pageNum: 1,};
//     expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts)).toEqual(expectedResult);
// });
//
// it('Post Session Survey Previous Page & Validation Logic - Page 3 (Areas of Soreness) - WITH Sore Body Parts', () => {
//     let currentPage = 3;
//     let pageState = {pageIndex: 4,};
//     let newSoreBodyParts = [{}];
//     let expectedResult = {pageNum: 3,};
//     expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts)).toEqual(expectedResult);
// });

it('Post Session Survey Previous Page & Validation Logic - Page 2 (F/U P/S) - NO Sessions', () => {
    let currentPage = 2;
    let pageState = {pageIndex: 3,};
    let newSoreBodyParts = [];
    let expectedResult = {pageNum: 0,};
    expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts, [])).toEqual(expectedResult);
});

it('Post Session Survey Previous Page & Validation Logic - Page 2 (F/U P/S) - TWO Sessions', () => {
    let currentPage = 2;
    let pageState = {pageIndex: 3,};
    let newSoreBodyParts = [];
    let expectedResult = {pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts, [{}, {}])).toEqual(expectedResult);
});

it('Post Session Survey Previous Page & Validation Logic - Page 1 (Sport Schedule Builder)', () => {
    let currentPage = 1;
    let pageState = {pageIndex: 0,};
    let newSoreBodyParts = [];
    let expectedResult = {pageNum: 0,};
    expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts)).toEqual(expectedResult);
});

it('Post Session Survey Previous Page & Validation Logic - Page 0 (HealthKit)', () => {
    let currentPage = 0;
    let pageState = {pageIndex: 0,};
    let newSoreBodyParts = [];
    let expectedResult = {pageNum: 0,};
    expect(PlanLogic.handlePostSessionSurveyPreviousPage(pageState, currentPage, newSoreBodyParts)).toEqual(expectedResult);
});

it('Exercises Timer Logic - Nothing Passed', () => {
    let exercises = {};
    let expectedResult = helperFunctions.getExerciseTimersExecptedResult(1, 5, null, 5 ,10);
    expect(PlanLogic.handleExercisesTimerLogic(exercises)).toEqual(expectedResult);
});

it('Exercises Timer Logic - Bilateral Exercise', () => {
    let exercises = {bilateral: true,};
    let expectedResult = helperFunctions.getExerciseTimersExecptedResult(2, 5, null, 5 ,10);
    expect(PlanLogic.handleExercisesTimerLogic(exercises)).toEqual(expectedResult);
});

it('Exercises Timer Logic - Bilateral & Timed Exercise', () => {
    let exercises = {bilateral: true, seconds_per_set: 60,};
    let expectedResult = helperFunctions.getExerciseTimersExecptedResult(2, 5, 60, 5 ,10);
    expect(PlanLogic.handleExercisesTimerLogic(exercises)).toEqual(expectedResult);
});

it('New Sore Body Part Logic - Nothing Passed', () => {
    let expectedResult = [];
    expect(PlanLogic.handleNewSoreBodyPartLogic()).toEqual(expectedResult);
});

it('New Sore Body Part Logic - Empty Object', () => {
    let soreBodyParts = {};
    let expectedResult = [];
    expect(PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts)).toEqual(expectedResult);
});

it('New Sore Body Part Logic - Only Body Parts', () => {
    let soreBodyParts = helperFunctions.getSoreBodyPartsBodyParts();
    let expectedResult = _.concat(soreBodyParts.clear_candidates, soreBodyParts.hist_sore_status, soreBodyParts.body_parts);
    expect(PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts)).toEqual(expectedResult);
});

it('New Sore Body Part Logic - Only Hist Sore', () => {
    let soreBodyParts = helperFunctions.getSoreBodyPartsHistSoreStatus();
    let expectedResult = _.concat(soreBodyParts.clear_candidates, soreBodyParts.hist_sore_status, soreBodyParts.body_parts);
    expect(PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts)).toEqual(expectedResult);
});

it('New Sore Body Part Logic - Only Clear Candidates', () => {
    let soreBodyParts = helperFunctions.getSoreBodyPartsClearCandidates();
    let expectedResult = _.concat(soreBodyParts.clear_candidates, soreBodyParts.hist_sore_status, soreBodyParts.body_parts);
    expect(PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts)).toEqual(expectedResult);
});

it('New Sore Body Part Logic - All 3', () => {
    let soreBodyParts = helperFunctions.getAllSoreBodyParts();
    let expectedResult = _.concat(soreBodyParts.clear_candidates, soreBodyParts.hist_sore_status, soreBodyParts.body_parts);
    expect(PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts)).toEqual(expectedResult);
});

// it('Post Session Survey Next Page & Validation Logic - Page 4 (Selected Areas of Soreness) - NOT Valid', () => {
//     let isFormValidItems = {areAreasOfSorenessValid: false};
//     let pageState = { pageIndex: 5, };
//     let expectedResult = {isValid: false, pageNum: 5,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 4, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 4 (Selected Areas of Soreness) - Valid', () => {
//     let isFormValidItems = {areAreasOfSorenessValid: true};
//     let pageState = { pageIndex: 5, };
//     let expectedResult = {isValid: true, pageNum: 5,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 4, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 3 (Areas of Soreness) - NOT Valid', () => {
//     let isFormValidItems = {selectAreasOfSorenessValid: false};
//     let pageState = { pageIndex: 4, };
//     let expectedResult = {isValid: false, pageNum: 5,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 3, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 3 (Areas of Soreness) - Valid', () => {
//     let isFormValidItems = {selectAreasOfSorenessValid: true};
//     let pageState = { pageIndex: 4, };
//     let expectedResult = {isValid: true, pageNum: 5,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 3, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 2 (F/U P/S) - NOT Valid', () => {
//     let isFormValidItems = {isPrevSorenessValid: false};
//     let pageState = { pageIndex: 3, };
//     let expectedResult = {isValid: false, pageNum: 4,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 2, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 2 (F/U P/S) - Valid', () => {
//     let isFormValidItems = {isPrevSorenessValid: true};
//     let pageState = { pageIndex: 3, };
//     let expectedResult = {isValid: true, pageNum: 4,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 2, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 1 (Sport Builder) - NOT Valid', () => {
//     let isFormValidItems = {};
//     let pageState = { pageIndex: 2, };
//     let expectedResult = {isValid: true, pageNum: 4,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 1, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 1 (Sport Builder) - NOT Valid', () => {
//     let isFormValidItems = {};
//     let pageState = { pageIndex: 2, };
//     let expectedResult = {isValid: true, pageNum: 3,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 1, isFormValidItems, [{}, {}])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 1 (Sport Builder) - Valid', () => {
//     let isFormValidItems = {};
//     let pageState = { pageIndex: 2, };
//     let expectedResult = {isValid: true, pageNum: 4,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 1, isFormValidItems, [])).toEqual(expectedResult);
// });
//
// it('Post Session Survey Next Page & Validation Logic - Page 1 (Sport Builder) - Valid', () => {
//     let isFormValidItems = {};
//     let pageState = { pageIndex: 2, };
//     let expectedResult = {isValid: true, pageNum: 3,};
//     expect(PlanLogic.handlePostSessionSurveyNextPage(pageState, 1, isFormValidItems, [{}, {}])).toEqual(expectedResult);
// });

it('Post Session Survey Next Page & Validation Logic - Page 0 (HealthKit) - Valid', () => {
    let isFormValidItems = {};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, [], false, true, '')).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 (HealthKit) - Valid', () => {
    let isFormValidItems = {};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, [], false, true, 'add_session')).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 (HealthKit) - Valid', () => {
    let isFormValidItems = {};
    let expectedResult = {isValid: true, pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, [{}, {}], false, true, 'continue')).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 (HealthKit) - Valid', () => {
    let isFormValidItems = {};
    let expectedResult = {isValid: true, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, [], false, true, 'continue')).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 (HealthKit) - NOT Valid', () => {
    let isFormValidItems = {};
    let expectedResult = {isValid: false, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, [], false, false, '')).toEqual(expectedResult);
});

it('Single Session Validation - First Open (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, null, null, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport & Session Type (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, & Duration (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, true, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, Duration, & RPE (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(1, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(true, true, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - First Open (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, null, null, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 0, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport & Session Type (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, & Duration (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 25, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, true, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, Duration, & RPE (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(1, 14, 25, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(true, true, '');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Coaches Dashboard Search Area Render Logic - No Insights', () => {
    let weeklyInsights = helperFunctions.getSearchAreaWeeklyInsights(false);
    let expectedResult = helperFunctions.getSearchAreaWeeklyInsightsExpectedResult(false);
    expect(PlanLogic.coachesDashboardSearchAreaRenderLogic(weeklyInsights)).toEqual(expectedResult);
});

it('Coaches Dashboard Search Area Render Logic - With Insights', () => {
    let weeklyInsights = helperFunctions.getSearchAreaWeeklyInsights(true);
    let expectedResult = helperFunctions.getSearchAreaWeeklyInsightsExpectedResult(true);
    expect(PlanLogic.coachesDashboardSearchAreaRenderLogic(weeklyInsights)).toEqual(expectedResult);
});

it('Coaches Dashboard Section Render Loop Logic - Dipesh Gautam', () => {
    let athletes = helperFunctions.getCoachesDashboardSectionRenderLoopLogicAthlets();
    let item = helperFunctions.getCoachesDashboardSectionRenderLoopLogicItem('Dipesh', 'Gautam', 0, '1', false);
    let expectedResult = helperFunctions.getRenderCoachesDashboardSectionExpectedResult('*Dipesh', 'Gautam', '#2EA985', item);
    expect(PlanLogic.handleRenderCoachesDashboardSection(athletes, item)).toEqual(expectedResult);
});

it('Coaches Dashboard Section Render Loop Logic - Paul LaForge', () => {
    let athletes = helperFunctions.getCoachesDashboardSectionRenderLoopLogicAthlets();
    let item = helperFunctions.getCoachesDashboardSectionRenderLoopLogicItem('Paul', 'LaForge', 2, '3', false);
    let expectedResult = helperFunctions.getRenderCoachesDashboardSectionExpectedResult('*Paul', 'LaForge', '#E6583D', item);
    expect(PlanLogic.handleRenderCoachesDashboardSection(athletes, item)).toEqual(expectedResult);
});

it('Coaches Dashboard Section Render Loop Logic - Mazen Chami', () => {
    let athletes = helperFunctions.getCoachesDashboardSectionRenderLoopLogicAthlets();
    let item = helperFunctions.getCoachesDashboardSectionRenderLoopLogicItem('Mazen', 'Chami', 1, '2', false);
    let expectedResult = helperFunctions.getRenderCoachesDashboardSectionExpectedResult('*Mazen', 'Chami', '#EBBA2D', item);
    expect(PlanLogic.handleRenderCoachesDashboardSection(athletes, item)).toEqual(expectedResult);
});

it('Coaches Dashboard Render Logic - 1 Team', () => {
    let coachesDashboardData = [helperFunctions.getCoachesDashboardSingleTeamData('fathom-1', 0)];
    let selectedTeamIndex = 0;
    let expectedResult = helperFunctions.getCoachesDashboardRenderLogicExpectedResult(
        coachesDashboardData,
        coachesDashboardData[selectedTeamIndex].compliance.complete,
        '#E6583D',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.complete.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.complete.length),
        coachesDashboardData[selectedTeamIndex],
        coachesDashboardData[selectedTeamIndex].compliance.training_compliance
    );
    expect(PlanLogic.handleCoachesDashboardRenderLogic(coachesDashboardData, selectedTeamIndex)).toEqual(expectedResult);
});

it('Coaches Dashboard Render Logic - 2 Teams, First Team Selected', () => {
    let coachesDashboardData = helperFunctions.getCoachesDashboardMultipleTeamsData('fathom', 'fathom-1');
    let selectedTeamIndex = 0;
    let expectedResult = helperFunctions.getCoachesDashboardRenderLogicExpectedResult(
        coachesDashboardData,
        coachesDashboardData[selectedTeamIndex].compliance.complete,
        '#E6583D',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.complete.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.complete.length),
        coachesDashboardData[selectedTeamIndex],
        coachesDashboardData[selectedTeamIndex].compliance.training_compliance
    );
    expect(PlanLogic.handleCoachesDashboardRenderLogic(coachesDashboardData, selectedTeamIndex)).toEqual(expectedResult);
});

it('Coaches Dashboard Render Logic - 2 Teams, Second Team Selected', () => {
    let coachesDashboardData = helperFunctions.getCoachesDashboardMultipleTeamsData('fathom', 'fathom-1');
    let selectedTeamIndex = 1;
    let expectedResult = helperFunctions.getCoachesDashboardRenderLogicExpectedResult(
        coachesDashboardData,
        coachesDashboardData[selectedTeamIndex].compliance.complete,
        '#E6583D',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.complete.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.complete.length),
        coachesDashboardData[selectedTeamIndex],
        coachesDashboardData[selectedTeamIndex].compliance.training_compliance
    );
    expect(PlanLogic.handleCoachesDashboardRenderLogic(coachesDashboardData, selectedTeamIndex)).toEqual(expectedResult);
});

it('Athlete Card Modal Render Logic - No Information - Dipesh', () => {
    let selectedAthlete = helperFunctions.getAthleteCardSelectedAthlete(0, 'Dipesh', 'Gautam');
    let expectedResult = helperFunctions.athleteCardModalRenderLogicExpectedResult('*DIPESH GAUTAM', '#2EA985', 'Train as normal');
    expect(PlanLogic.handleAthleteCardModalRenderLogic(selectedAthlete)).toEqual(expectedResult);
});

it('Athlete Card Modal Render Logic - With Information - Mazen', () => {
    let selectedAthlete = helperFunctions.getAthleteCardSelectedAthlete(1, 'Mazen', 'Chami');
    let expectedResult = helperFunctions.athleteCardModalRenderLogicExpectedResult('*MAZEN CHAMI', '#EBBA2D', 'Consider altering training plan');
    expect(PlanLogic.handleAthleteCardModalRenderLogic(selectedAthlete)).toEqual(expectedResult);
});

it('Athlete Card Modal Render Logic - With Information - Gabby', () => {
    let selectedAthlete = helperFunctions.getAthleteCardSelectedAthlete(2, 'Gabby', 'Lavac');
    let expectedResult = helperFunctions.athleteCardModalRenderLogicExpectedResult('*GABBY LAVAC', '#E6583D', 'Consider not training today');
    expect(PlanLogic.handleAthleteCardModalRenderLogic(selectedAthlete)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport, RPE, & All Good', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(5, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = { sportImage: '', sportText: '' };
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport & RPE', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(5, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = { sportImage: '', sportText: '' };
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(0, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = { sportImage: '', sportText: '' };
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - On Enter', () => {
    let postSession = helperFunctions.getPostSessionDefaultState();
    let pageState = helperFunctions.readinessSurveyPageState({minutes: 3, label: 1}, false, 0, 0, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = { sportImage: '', sportText: '' };
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Readiness Survey Render Logic - On Enter, No Previous Soreness (FS Eligible, NOT Valid Form, & In the Afternoon)', () => {
    let dailyReadiness = helperFunctions.getDailyReadinessDefaultState(null, null, 6, 8, [], null);
    let soreBodyParts = helperFunctions.readinessSurveyRenderLogicSoreBodyParts([], 0, 2, 14, true);
    let areasOfSorenessRef = {state: {isAllGood: true}};
    let isFormValidItems = helperFunctions.readinessSurveyRenderLogicFormValidItems(false, true, false, true, false, false, true, true);
    let expectedResult = helperFunctions.readinessSurveyRenderLogicExpectedResult('(0/2 completed in last 7 days)', false, false, isFormValidItems, true, [], 'AFTERNOON', []);
    expect(PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, areasOfSorenessRef, 14)).toEqual(expectedResult);
});

it('Readiness Survey Render Logic - On Enter, No Previous Soreness (FS Eligible & In the Evening)', () => {
    let dailyReadiness = helperFunctions.getDailyReadinessDefaultState();
    let soreBodyParts = helperFunctions.readinessSurveyRenderLogicSoreBodyParts([], 0, 2, 14, true);
    let areasOfSorenessRef = {state: {isAllGood: false}};
    let isFormValidItems = helperFunctions.readinessSurveyRenderLogicFormValidItems(false, false, false, true, false, false, false, true);
    let expectedResult = helperFunctions.readinessSurveyRenderLogicExpectedResult('(0/2 completed in last 7 days)', false, false, isFormValidItems, true, [], 'EVENING', []);
    expect(PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, areasOfSorenessRef, 21)).toEqual(expectedResult);
});

it('Readiness Survey Render Logic - On Enter, No Previous Soreness (NOT FS Eligible, Valid Form, & In the Evening)', () => {
    let dailyReadiness = helperFunctions.getDailyReadinessDefaultState(null, null, 6, 8, [], null);
    let soreBodyParts = helperFunctions.readinessSurveyRenderLogicSoreBodyParts([], 0, 2, 14, false);
    let areasOfSorenessRef = {state: {isAllGood: true}};
    let isFormValidItems = helperFunctions.readinessSurveyRenderLogicFormValidItems(false, true, true, true, false, false, true, true);
    let expectedResult = helperFunctions.readinessSurveyRenderLogicExpectedResult('', false, false, isFormValidItems, false, [], 'EVENING', []);
    expect(PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, areasOfSorenessRef, 18)).toEqual(expectedResult);
});

it('Readiness Survey Render Logic - On Enter, No Previous Soreness (NOT FS Eligible & In the Morning)', () => {
    let dailyReadiness = helperFunctions.getDailyReadinessDefaultState();
    let soreBodyParts = {body_parts: [], completed_functional_strength_sessions: 0, current_position: 2, current_sport_name: 14, functional_strength_eligible: false, hist_sore_status: [], clear_candidates: []};
    let areasOfSorenessRef = {state: {isAllGood: false}};
    let isFormValidItems = helperFunctions.readinessSurveyRenderLogicFormValidItems(false, false, true, true, false, false, false, true)
    let expectedResult = helperFunctions.readinessSurveyRenderLogicExpectedResult('', false, false, isFormValidItems, false, [], 'MORNING', []);
    expect(PlanLogic.handleReadinessSurveyRenderLogic(dailyReadiness, soreBodyParts, areasOfSorenessRef, 8)).toEqual(expectedResult);
});

it('Sore Body Part Render Logic - On Enter, Right Hamstring (PAIN Selected)', () => {
    let bodyPart = helperFunctions.handleSoreBodyParts(15, 2).body_parts[0];
    let bodyPartSide = 2;
    let pageStateType = 'pain';
    let expectedResult = helperFunctions.soreBodyPartRenderLogicExpectedResult(helperFunctions.soreBodyPartRightHamstring(), 'Right Hamstring', 'muscle', 'has', helperFunctions.muscleLevelsOfSorenessAndPain());
    expect(PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, pageStateType)).toEqual(expectedResult);
});

it('Sore Body Part Render Logic - On Enter, Lower Back (SORE Selected)', () => {
    let bodyPart = helperFunctions.handleSoreBodyParts(12, 0).body_parts[0];
    let bodyPartSide = 0;
    let pageStateType = '';
    let expectedResult = helperFunctions.soreBodyPartRenderLogicExpectedResult(helperFunctions.soreBodyPartLowerBack(), 'Lower Back', 'muscle', 'has', helperFunctions.muscleLevelsOfSorenessAndPain());
    expect(PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, pageStateType)).toEqual(expectedResult);
});

it('Sore Body Part Render Logic - On Enter, Left Glute', () => {
    let bodyPart = helperFunctions.handleSoreBodyParts(14, 1).body_parts[0];
    let bodyPartSide = 1;
    let pageStateType = '';
    let expectedResult = helperFunctions.soreBodyPartRenderLogicExpectedResult(helperFunctions.soreBodyPartLeftGlute(), 'Left Glute', 'muscle', 'has', helperFunctions.muscleLevelsOfSorenessAndPain());
    expect(PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, pageStateType)).toEqual(expectedResult);
});

// it('Post Session Survey Render Logic - Sport Builder Done, RPE Selected & All Good Selected, NO Previous Soreness', () => {
//     let postSession = helperFunctions.getPostSessionSurveyPostSession(4, [], '2018-11-14T15:30:00Z');
//     let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
//     let areasOfSorenessRef = {state: {isAllGood: true}};
//     let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, true, true), newSoreBodyParts: []};
//     expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
// });
//
// it('Post Session Survey Render Logic - Sport Builder Done & RPE Selected, NO Previous Soreness', () => {
//     let postSession = helperFunctions.getPostSessionSurveyPostSession(4, [], '2018-11-14T15:30:00Z');
//     let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
//     let areasOfSorenessRef = {state: {isAllGood: false}};
//     let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false, true), newSoreBodyParts: []};
//     expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
// });
//
// it('Post Session Survey Render Logic - Sport Builder Done, NO Previous Soreness', () => {
//     let postSession = helperFunctions.getPostSessionSurveyPostSession(0, [], '2018-11-14T15:30:00Z');
//     let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
//     let areasOfSorenessRef = {state: {isAllGood: false}};
//     let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false, true), newSoreBodyParts: []};
//     expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
// });
//
// it('Post Session Survey Render Logic - On Enter, NO Previous Soreness', () => {
//     let postSession = helperFunctions.getPostSessionSurveyPostSession(0, [], '');
//     let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
//     let areasOfSorenessRef = {state: {isAllGood: false}};
//     let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false, false), newSoreBodyParts: []};
//     expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
// });

it('Area Of Soreness Render Logic - On Enter, NO Previous Soreness', () => {
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let soreBodyPartsState = [];
    let expectedResult = {areaOfSorenessClicked: [], groupedNewBodyPartMap: helperFunctions.getAreaOfSorenessFullGroupedBodyPartMap()};
    expect(PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState)).toEqual(expectedResult);
});

it('Area Of Soreness Render Logic - Selected Abs, NO Previous Soreness', () => {
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let soreBodyPartsState = helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartStateObject(3).soreness;
    let expectedResult = {areaOfSorenessClicked: helperFunctions.getAreaOfSorenessAddingNonBilateralBodyPartStateObject(3).soreness, groupedNewBodyPartMap: helperFunctions.getAreaOfSorenessFullGroupedBodyPartMap()};
    expect(PlanLogic.handleAreaOfSorenessRenderLogic(soreBodyParts, soreBodyPartsState)).toEqual(expectedResult);
});

it('Area Of Soreness Render Logic - Selected Glutes, NO Previous Soreness', () => {
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
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

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Is Valid with data #1', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(0, 11, 1).durationValueGroups;
    let isFormValid = true;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(4, 0, 0).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult(55, false, timeValueGroups);
    expect(PlanLogic.handleGetDateTimeDurationFromState(durationValueGroups, isFormValid, timeValueGroups)).toEqual(expectedResult);
});

it('Sport Schedule Builder Cleaning of Date and Time Duration from State - Form Is Valid with data #2', () => {
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(0, 2, 1).durationValueGroups;
    let isFormValid = true;
    let timeValueGroups = helperFunctions.getDefaulTimeValuesFromState(2, 2, 1).timeValueGroups;
    let expectedResult = helperFunctions.getSportScheduleBuilderDateTimeDurationFromStateExpectedResult(10, false, timeValueGroups);
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
    let durationValueGroups = helperFunctions.getDefaultDurationValuesFromState(0, 2, 1).durationValueGroups;
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
    let expectedResult = helperFunctions.getAreaOfSorenessAddingBilateralBodyPartExpectedResult(bodyPartIndex, true);
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
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side, true);
    let dailyReadinessDefaultState = helperFunctions.getDailyReadinessDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, dailyReadinessDefaultState)).toEqual(expectedResult);
});

it('Daily Readiness Form Change - Soreness for NEW bodyPart WITHOUT pain Input', () => {
    let bodyPartIndex = 3;
    let side = 0;
    let expectedResult = helperFunctions.getDailyReadinessNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side, true);
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
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithPainInputExpectedResult(bodyPartIndex, side, true);
    let postSessionDefaultState = helperFunctions.getPostSessionDefaultState();
    expect(PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', null, true, bodyPartIndex, side, postSessionDefaultState)).toEqual(expectedResult);
});

it('Post Session Form Change - Soreness for NEW bodyPart WITHOUT pain Input', () => {
    let bodyPartIndex = 11;
    let side = 2;
    let expectedResult = helperFunctions.getPostSessionNewBodyPartSorenessWithoutPainInputExpectedResult(bodyPartIndex, side, true);
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
