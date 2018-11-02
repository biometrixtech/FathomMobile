/* global it expect jest */
import 'react-native';

import { PlanLogic, } from '../';

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

};

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
