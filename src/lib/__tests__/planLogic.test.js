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
            helping_verb: 'have',
            image:        {0: 'Abs.svg',},
            index:        3,
            label:        'Abdominals',
            location:     'front',
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
            back: [
                {index: 12, order: 11, label: 'Lower Back', location: 'back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'has'},
                {index: 14, order: 12, label: 'Glutes', location: 'back', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 15, order: 13, label: 'Hamstrings', location: 'back', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 16, order: 14, label: 'Calves', location: 'back', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 17, order: 15, label: 'Achilles', location: 'back', group: 'joint', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 18, order: 10, label: 'Upper Back', location: 'back', group: 'muscle', image: {0: 'UpperBackNeck.svg'}, bilateral: false, helping_verb: 'has'},
            ],
            front: [
                {index: 3, order: 1, label: 'Abdominals', location: 'front', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'have'},
                {index: 4, order: 3, label: 'Hip', location: 'front', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 5, order: 2, label: 'Groin', location: 'front', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 6, order: 4, label: 'Quads', location: 'front', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 7, order: 6, label: 'Knee', location: 'front', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 8, order: 7, label: 'Shin', location: 'front', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 9, order: 8, label: 'Ankle', location: 'front', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 10, order: 9, label: 'Foot', location: 'front', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'has'},
                {index: 11, order: 5, label: 'IT Band', location: 'front', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'has'},
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
            location:     'back',
            order:        12
        };
        return leftGlute;
    },

    soreBodyPartLowerBack: () => {
        let lowerBack = {
            bilateral:    false,
            group:        'joint',
            helping_verb: 'has',
            image:        {0: 'LowBack.svg'},
            index:        12,
            label:        'Lower Back',
            location:     'back',
            order:        11
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
            location:     'back',
            order:        13
        };
        return rightHamstring;
    },

    soreBodyPartRenderLogicExpectedResult: (bodyPartMap, bodyPartName, bodyPartGroup, helpingVerb, sorenessPainMapping) => {
        return {
            bodyPartMap,
            bodyPartName,
            bodyPartGroup,
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
        if(isSoreness) {
            return [
                '',
                'Tight',
                'Sore',
                'Movement Limited',
                'Struggling to Move',
                'Cannot Move',
            ];
        }
        return [
            '',
            'Barely Noticeable',
            'Dull Pain',
            'Sharp Pain',
            'Pain Limits Movement ',
            'Too Painful to Move',
        ];
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
            { index: 0, order: 1, label: 'Endurance', icon: 'ios-fitness', iconType: 'ionicon', },
            { index: 1, order: 2, label: 'Power', icon: 'ios-fitness', iconType: 'ionicon', },
            { index: 2, order: 3, label: 'Speed & Agility', icon: 'ios-fitness', iconType: 'ionicon', },
            { index: 3, order: 4, label: 'Strength', icon: 'ios-fitness', iconType: 'ionicon', },
            { index: 4, order: 5, label: 'Cross Training', icon: 'ios-fitness', iconType: 'ionicon', },
        ];
    },

    getTeamSports: () => {
        return [
            { index: 0, order: 1, label: 'Basketball', positions: ['Center', 'Forward', 'Guard'], icon: 'basketball', iconType: 'material-community', },
            { index: 1, order: 2, label: 'Baseball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], icon: 'baseball', iconType: 'material-community', },
            { index: 3, order: 3, label: 'Cycling', positions: false, icon: 'ios-bicycle', iconType: 'ionicon', },
            { index: 17, order: 4, label: 'Distance Running', positions: false, icon: 'run', iconType: 'material-community', },
            { index: 4, order: 5, label: 'Field Hockey', positions: ['Goalie', 'Fullback', 'Midfielder', 'Forward'], icon: 'hockey-sticks', iconType: 'material-community', },
            { index: 5, order: 6, label: 'Football', positions: ['Defensive Back', 'Kicker', 'Linebacker', 'Lineman', 'Quarterback', 'Receiver', 'Running Back'], icon: 'football', iconType: 'material-community', },
            { index: 10, order: 7, label: 'Lacrosse', positions: ['Attacker', 'Defender', 'Goalie', 'Midfielder'], icon: 'volleyball', iconType: 'material-community', },
            { index: 15, order: 8, label: 'Pool Sports', positions: false, icon: 'pool', iconType: 'material-community', },
            { index: 11, order: 9, label: 'Rowing', positions: false, icon: 'rowing', iconType: 'material-community', },
            { index: 9, order: 10, label: 'Skate Sports', positions: false, icon: 'hockey-sticks', iconType: 'material-community', },
            { index: 14, order: 11, label: 'Soccer', positions: ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker'], icon: 'ios-football', iconType: 'ionicon', },
            { index: 2, order: 12, label: 'Softball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], icon: 'baseball', iconType: 'material-community', },
            { index: 16, order: 13, label: 'Tennis', positions: false, icon: 'md-tennisball', iconType: 'ionicon', },
            { index: 24, order: 14, label: 'Track & Field', positions: ['Sprinter', 'Jumper', 'Thrower', 'Distance'], icon: 'run-fast', iconType: 'material-community', },
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
                completed: [
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

    getCoachesDashboardRenderLogicExpectedResult: (coachesTeams, completedAtheltes, complianceColor, incompleteAtheltes, numOfCompletedAthletes, numOfIncompletedAthletes, numOfTotalAthletes, selectedTeam, trainingCompliance) => {
        return {
            coachesTeams,
            completedAtheltes,
            complianceColor,
            incompleteAtheltes,
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

    postSessionRenderLogicFormValidItems: (areAreasOfSorenessValid, isPrevSorenessValid,selectAreasOfSorenessValid) => {
        return {
            areAreasOfSorenessValid,
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
    }

};

it('Post Session Survey Next Page & Validation Logic - Page 4 - Back & Valid', () => {
    let isFormValidItems = {areAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 4, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 4 - Back & NOT Valid', () => {
    let isFormValidItems = {areAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 4, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 4 - NOT Back & Valid', () => {
    let isFormValidItems = {areAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 4,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 4, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 4 - NOT Back & NOT Valid', () => {
    let isFormValidItems = {areAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 4,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 4, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - Back, Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - Back, NOT Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - Back, Valid, & WITH New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, true, [{}], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - Back, NOT Valid, & WITH New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, true, [{}], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - NOT Back, Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - NOT Back, NOT Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - NOT Back, Valid, & WITH Areas Of Soreness Clicked', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 4,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, false, [], [{}])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 3 - NOT Back, NOT Valid, & WITH Areas Of Soreness Clicked', () => {
    let isFormValidItems = {selectAreasOfSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 4,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 3, isFormValidItems, false, [], [{}])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 2 - Back & Valid', () => {
    let isFormValidItems = {isPrevSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 2, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 2 - Back & NOT Valid', () => {
    let isFormValidItems = {isPrevSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 2, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 2 - NOT Back & Valid', () => {
    let isFormValidItems = {isPrevSorenessValid: true};
    let expectedResult = {isValid: true, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 2, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 2 - NOT Back & NOT Valid', () => {
    let isFormValidItems = {isPrevSorenessValid: false};
    let expectedResult = {isValid: false, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 2, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - Back & Valid', () => {
    let isFormValidItems = {isRPEValid: true};
    let expectedResult = {isValid: true, pageNum: 0,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - Back & NOT Valid', () => {
    let isFormValidItems = {isRPEValid: false};
    let expectedResult = {isValid: false, pageNum: 0,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - NOT Back, NOT Valid, & WITH New Sore Body Parts', () => {
    let isFormValidItems = {isRPEValid: false};
    let expectedResult = {isValid: false, pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, false, [{}], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - NOT Back, NOT Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {isRPEValid: false};
    let expectedResult = {isValid: false, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - NOT Back, Valid, & WITH New Sore Body Parts', () => {
    let isFormValidItems = {isRPEValid: true};
    let expectedResult = {isValid: true, pageNum: 2,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, false, [{}], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 1 - NOT Back, Valid, & WITHOUT New Sore Body Parts', () => {
    let isFormValidItems = {isRPEValid: true};
    let expectedResult = {isValid: true, pageNum: 3,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 1, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 - Back & Valid', () => {
    let isFormValidItems = {isSportValid: true};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 - Back & NOT Valid', () => {
    let isFormValidItems = {isSportValid: false};
    let expectedResult = {isValid: false, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, true, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 - NOT Back & Valid', () => {
    let isFormValidItems = {isSportValid: true};
    let expectedResult = {isValid: true, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Post Session Survey Next Page & Validation Logic - Page 0 - NOT Back & NOT Valid', () => {
    let isFormValidItems = {isSportValid: false};
    let expectedResult = {isValid: false, pageNum: 1,};
    expect(PlanLogic.handlePostSessionSurveyNextPage({}, 0, isFormValidItems, false, [], [])).toEqual(expectedResult);
});

it('Single Session Validation - First Open (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, null, null, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, ' ');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, 'soccer ');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport & Session Type (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, 'soccer training');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, & Duration (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, true, 'soccer training');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, Duration, & RPE (Readiness Survey)', () => {
    let session = helperFunctions.getReadinessSurveySingleSessionValidationSession(1, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(true, true, 'soccer training');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - First Open (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, null, null, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, ' ');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 0, null);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, 'soccer ');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport & Session Type (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 0, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(false);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, false, 'soccer training');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, & Duration (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(null, 14, 25, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(false, true, 'soccer training');
    expect(PlanLogic.handleSingleSessionValidation(session, sportScheduleBuilderRef)).toEqual(expectedResult);
});

it('Single Session Validation - Selected Sport, Session Type, Duration, & RPE (Post Session Survey)', () => {
    let session = helperFunctions.getPostSessionSurveySingleSessionValidationSession(1, 14, 25, 6);
    let sportScheduleBuilderRef = helperFunctions.getSportScheduleBuilderRef(true);
    let expectedResult = helperFunctions.getSingleSessionValidationExpectedResult(true, true, 'soccer training');
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
    let expectedResult = helperFunctions.getRenderCoachesDashboardSectionExpectedResult('*Paul', 'LaForge', '#C8432A', item);
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
        coachesDashboardData[selectedTeamIndex].compliance.completed,
        '#C8432A',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.completed.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.completed.length),
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
        coachesDashboardData[selectedTeamIndex].compliance.completed,
        '#C8432A',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.completed.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.completed.length),
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
        coachesDashboardData[selectedTeamIndex].compliance.completed,
        '#C8432A',
        coachesDashboardData[selectedTeamIndex].compliance.incomplete,
        coachesDashboardData[selectedTeamIndex].compliance.completed.length,
        coachesDashboardData[selectedTeamIndex].compliance.incomplete.length,
        (coachesDashboardData[selectedTeamIndex].compliance.incomplete.length + coachesDashboardData[selectedTeamIndex].compliance.completed.length),
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
    let expectedResult = helperFunctions.athleteCardModalRenderLogicExpectedResult('*GABBY LAVAC', '#C8432A', 'Consider not training today');
    expect(PlanLogic.handleAthleteCardModalRenderLogic(selectedAthlete)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport, RPE, & All Good', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(5, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = helperFunctions.sportScheduleBuilderRenderLogicExpectedResult('15', helperFunctions.filteredSportSessionTypes(true), 'basketball', 'basketball competition', '3:30', helperFunctions.getStrengthConditioningTypes(), helperFunctions.getTeamSports());
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport & RPE', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(5, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = helperFunctions.sportScheduleBuilderRenderLogicExpectedResult('15', helperFunctions.filteredSportSessionTypes(true), 'basketball', 'basketball competition', '3:30', helperFunctions.getStrengthConditioningTypes(), helperFunctions.getTeamSports());
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - Valid Sport', () => {
    let postSession = helperFunctions.getPostSessionDefaultState(0, '', 20, '2018-11-15T15:30:00Z', 2, [], 0, null);
    let pageState = helperFunctions.readinessSurveyPageState({hours: 0, minutes: 3, label: 1}, true, 1, 3, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = helperFunctions.sportScheduleBuilderRenderLogicExpectedResult('15', helperFunctions.filteredSportSessionTypes(true), 'basketball', 'basketball competition', '3:30', helperFunctions.getStrengthConditioningTypes(), helperFunctions.getTeamSports());
    expect(PlanLogic.handleSportScheduleBuilderRenderLogic(postSession, pageState)).toEqual(expectedResult);
});

it('Sport Schedule Builder Render Logic - On Enter', () => {
    let postSession = helperFunctions.getPostSessionDefaultState();
    let pageState = helperFunctions.readinessSurveyPageState({minutes: 3, label: 1}, false, 0, 0, {hours: 2, minutes: 2, amPM: 1});
    let expectedResult = helperFunctions.sportScheduleBuilderRenderLogicExpectedResult('', helperFunctions.filteredSportSessionTypes(), '', 'activity type', '', helperFunctions.getStrengthConditioningTypes(), helperFunctions.getTeamSports());
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
    let expectedResult = helperFunctions.soreBodyPartRenderLogicExpectedResult(helperFunctions.soreBodyPartLowerBack(), 'Lower Back', 'joint', 'has', helperFunctions.jointLevelsOfSoreness());
    expect(PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, pageStateType)).toEqual(expectedResult);
});

it('Sore Body Part Render Logic - On Enter, Left Glute', () => {
    let bodyPart = helperFunctions.handleSoreBodyParts(14, 1).body_parts[0];
    let bodyPartSide = 1;
    let pageStateType = '';
    let expectedResult = helperFunctions.soreBodyPartRenderLogicExpectedResult(helperFunctions.soreBodyPartLeftGlute(), 'Left Glute', 'muscle', 'has', []);
    expect(PlanLogic.handleSoreBodyPartRenderLogic(bodyPart, bodyPartSide, pageStateType)).toEqual(expectedResult);
});

it('Post Session Survey Render Logic - Sport Builder Done, RPE Selected & All Good Selected, NO Previous Soreness', () => {
    let postSession = helperFunctions.getPostSessionSurveyPostSession(4, [], '2018-11-14T15:30:00Z');
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let areasOfSorenessRef = {state: {isAllGood: true}};
    let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, true), newSoreBodyParts: []};
    expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
});

it('Post Session Survey Render Logic - Sport Builder Done & RPE Selected, NO Previous Soreness', () => {
    let postSession = helperFunctions.getPostSessionSurveyPostSession(4, [], '2018-11-14T15:30:00Z');
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let areasOfSorenessRef = {state: {isAllGood: false}};
    let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false), newSoreBodyParts: []};
    expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
});

it('Post Session Survey Render Logic - Sport Builder Done, NO Previous Soreness', () => {
    let postSession = helperFunctions.getPostSessionSurveyPostSession(0, [], '2018-11-14T15:30:00Z');
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let areasOfSorenessRef = {state: {isAllGood: false}};
    let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false), newSoreBodyParts: []};
    expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
});

it('Post Session Survey Render Logic - On Enter, NO Previous Soreness', () => {
    let postSession = helperFunctions.getPostSessionSurveyPostSession(0, [], '');
    let soreBodyParts = {body_parts: [], hist_sore_status: [], clear_candidates: []};
    let areasOfSorenessRef = {state: {isAllGood: false}};
    let expectedResult = {isFormValid: false, isFormValidItems: helperFunctions.postSessionRenderLogicFormValidItems(false, true, false), newSoreBodyParts: []};
    expect(PlanLogic.handlePostSessionSurveyRenderLogic(postSession, soreBodyParts, areasOfSorenessRef)).toEqual(expectedResult);
});

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
