/* global it expect jest */
/* global describe expect jest */
/* global fetch console */
// require required libraries to create fetch
require('es6-promise').polyfill();
require('isomorphic-fetch');

// import third-party libraries
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

// import logic file(s)
import { AppAPI, PlanLogic, } from '../';
import { APIConfig, AppConfig, } from '../../constants';
import defaultPlanState from '../../states/plan';

// setup helper functions
const helperFunctions = {

    apiReqs: (method, body, authorization) => {
        let req = {
            method:  method.toUpperCase(),
            headers: {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'User-Agent':   AppConfig.deviceInfo,
            },
        };
        if (body) { req.body = JSON.stringify(body); }
        if (authorization) { req.headers.Authorization = authorization; }
        return req;
    },

    getURL: (tokenKey, environment = 'TEST') => {
        return `${APIConfig.APIs[environment]}${APIConfig.endpoints.get(tokenKey)}`;
    },

    fetcher: async (url, req, delay) => {
        const delayValue = delay ? 3000 : 0;
        const wait = new Promise(resolve => setTimeout(resolve, delayValue));
        const response = await wait.then(() => fetch(url, req)).then(res => res);
        // if(response.status === 200) {}
        const data = await response.json();
        return data;
    },

    getTestUsersLoginInfo: () => {
        return { personal_data: { email: 'dipesh+persona1@fathomai.com', }, password: 'Fathom123!', };
    },

    getNewSoreBodyPartsOptions: (bodyPart, value) => {
        return {
            bodyPartIndex:    bodyPart.body_part,
            isClearCandidate: bodyPart.isClearCandidate,
            pain:             bodyPart.pain,
            side:             bodyPart.side,
            value,
        };
    },

    newNewDailyReadinessExpectedResult: (loginRes, sessions_planned, sessionsArray = [], sorenessArray, clearCandidatesArray) => {
        return {
            sessions_planned,
            clear_candidates:          clearCandidatesArray,
            readiness:                 null,
            sessions:                  sessionsArray,
            sleep_data:                [],
            sleep_quality:             null,
            soreness:                  sorenessArray,
            user_id:                   loginRes.user.id,
            wants_functional_strength: null,
        };
    },

    newPostSessionExpectedResult: (loginRes, eventDate, sessionsArray = []) => {
        return {
            event_date: eventDate,
            sessions:   sessionsArray,
            user_id:    loginRes.user.id,
        };
    },

};

// trigger our tests
describe('Systems Tests for Persona 1', () => {

    jest.setTimeout(60000);

    let user = helperFunctions.getTestUsersLoginInfo();

    it('#1: Submit RS with 1 Clear Candidate (not clear) & 1 Hist Sore Status with tipping point (Screen on Mobilize), Completed Prep with 4 Exercises (Screen on Train), Submit PSS with 1 Session (Screen on Recover), & Complete Recover with 3 Exercises (Screen on Recover)', async () => {
        // login
        const loginRes = await helperFunctions.fetcher(helperFunctions.getURL(APIConfig.tokenKey), helperFunctions.apiReqs('post', user));
        // copy data
        let copyDataObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            copy_all:   false,
        };
        const copyDataRes = await helperFunctions.fetcher(helperFunctions.getURL('copy_test_data'), helperFunctions.apiReqs('post', copyDataObj, loginRes.authorization.jwt));
        expect(copyDataRes.message).toEqual('success');
        // get myPlan
        let myPlanObj = {
            user_id:    loginRes.user.id,
            start_date: moment().format('YYYY-MM-DD'),
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const dailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt));
        // make sure we are successful & valid - Get MyPlan
        expect(dailyPlanRes.daily_plans[0].daily_readiness_survey_completed).toEqual(false);
        expect(dailyPlanRes.readiness.clear_candidates.length).toEqual(1);
        expect(dailyPlanRes.readiness.hist_sore_status.length).toEqual(1);
        // simulate clicks
        let dailyReadinessObj = _.cloneDeep(defaultPlanState.dailyReadiness);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('already_trained_number', false, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions_planned', true, false, false, false, dailyReadinessObj, false);
        let { newSoreBodyParts, } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadinessObj, dailyPlanRes.readiness, { state: { isAllGood: false, showWholeArea: false,}});
        dailyReadinessObj.soreness = newSoreBodyParts;
        _.map(newSoreBodyParts, bodyPart => {
            let {
                bodyPartIndex,
                isClearCandidate,
                pain,
                side,
                value,
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, bodyPart.isClearCandidate ? 1 : 3);
            dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, dailyReadinessObj, isClearCandidate);
        });
        // submit readiness survey
        let prepareObj = { isReadinessSurveyCompleted: false, };
        let healthData = {
            ignoredWorkouts: [],
            sleep:           [],
            workouts:        [],
        };
        let { newDailyReadiness, } = PlanLogic.handleReadinessSurveySubmitLogic(loginRes.user.id, dailyReadinessObj, prepareObj, healthData);
        // check newDailyReadiness is correct before sending
        let newNewDailyReadiness = _.cloneDeep(newDailyReadiness);
        delete newNewDailyReadiness.date_time;
        let sorenessArray = [
            {body_part: 7, pain: true, side: 1, status: 'almost_persistent_2_pain_acute', severity: 3}
        ];
        let clearCandidatesArray = [
            {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 1}
        ];
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, [], sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        let dailyPlanObj = readinessSurveyRes.daily_plans[0];
        let exerciseList = _.concat(dailyPlanObj.pre_recovery.inhibit_exercises, dailyPlanObj.pre_recovery.lengthen_exercises, dailyPlanObj.pre_recovery.activate_exercises);
        expect(dailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(dailyPlanObj.landing_screen).toEqual(0);
        expect(dailyPlanObj.pre_recovery.display_exercises).toEqual(true);
        expect(dailyPlanObj.post_recovery.display_exercises).toEqual(false);
        expect(exerciseList.length === 0).toEqual(false);
        // check after submit we have the right previous soreness
        let previousSorenessObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
        expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(2);
        _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
            expect(
                soreBodyPart.status === 'persistent_2_pain' ||
                soreBodyPart.status === 'persistent_pain'
            ).toBe(true);
        });
        // simulate completing a round of exercises
        let completedExercises = [`${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-0`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-1`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-2`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-2`];
        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(completedExercises);
        let patchActiveRecoveryObj = {
            user_id:             loginRes.user.id,
            event_date:          `${moment().toISOString(true).split('.')[0]}Z`,
            recovery_type:       'pre',
            completed_exercises: newCompletedExercises,
        };
        const patchActiveRecoveryRes = await helperFunctions.fetcher(helperFunctions.getURL('active_recovery'), helperFunctions.apiReqs('patch', patchActiveRecoveryObj, loginRes.authorization.jwt));
        let activeRecoveryDailyPlanObj = patchActiveRecoveryRes.daily_plans[0];
        expect(activeRecoveryDailyPlanObj.landing_screen).toEqual(1);
        expect(activeRecoveryDailyPlanObj.pre_recovery.completed).toEqual(true);
        // Submit PSS with 1 Session (Screen on Recover) - fetch daily plan again with DELAY
        let postSessionObj = _.cloneDeep(defaultPlanState.postSession);
        let trainObj = _.cloneDeep(defaultPlanState.train);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].sport_name', 73, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].session_type', 6, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].event_date', `${moment().toISOString(true).split('.')[0]}Z`, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.event_date', `${moment().toISOString(true).split('.')[0]}Z`, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].duration', 65, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.RPE', 3, null, null, null, postSessionObj);
        let { newPostSession, } = PlanLogic.handlePostSessionSurveySubmitLogic(loginRes.user.id, postSessionObj, trainObj, healthData);
        const postSessionSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_session_survey'), helperFunctions.apiReqs('post', newPostSession, loginRes.authorization.jwt));
        let thirdDailyPlanObj = postSessionSurveyRes.daily_plans[0];
        let newExerciseList = _.concat(thirdDailyPlanObj.pre_recovery.inhibit_exercises, thirdDailyPlanObj.pre_recovery.lengthen_exercises, thirdDailyPlanObj.pre_recovery.activate_exercises);
        expect(thirdDailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(thirdDailyPlanObj.landing_screen).toEqual(2);
        expect(thirdDailyPlanObj.pre_recovery.display_exercises).toEqual(false);
        expect(thirdDailyPlanObj.post_recovery.display_exercises).toEqual(true);
        expect(newExerciseList.length === 0).toEqual(false);
        expect(thirdDailyPlanObj.training_sessions.length === 1).toEqual(true);
        // simulate completing recover with 3 exercises
        let anotherCompletedExercises = [`${newExerciseList[_.random(0, (newExerciseList.length - 1))].library_id}-0`, `${newExerciseList[_.random(0, (newExerciseList.length - 1))].library_id}-1`, `${newExerciseList[_.random(0, (newExerciseList.length - 1))].library_id}-2`];
        let { newNewCompletedExercises, } = PlanLogic.handleCompletedExercises(anotherCompletedExercises);
        let newPatchActiveRecoveryObj = {
            user_id:             loginRes.user.id,
            event_date:          `${moment().toISOString(true).split('.')[0]}Z`,
            recovery_type:       'post',
            completed_exercises: newNewCompletedExercises,
        };
        const newPatchActiveRecoveryRes = await helperFunctions.fetcher(helperFunctions.getURL('active_recovery'), helperFunctions.apiReqs('patch', newPatchActiveRecoveryObj, loginRes.authorization.jwt));
        let newActiveRecoveryDailyPlanObj = newPatchActiveRecoveryRes.daily_plans[0];
        expect(newActiveRecoveryDailyPlanObj.landing_screen).toEqual(2);
        expect(newActiveRecoveryDailyPlanObj.pre_recovery.completed).toEqual(true);
        expect(newActiveRecoveryDailyPlanObj.post_recovery.completed).toEqual(true);
    });

    it('#2: Submit RS with 1 Clear Candidate (not clear) & 1 Hist Sore Status with tipping point (Severity of 4) - (Screen on Mobilize (LOCKED))', async () => {
        // login
        const loginRes = await helperFunctions.fetcher(helperFunctions.getURL(APIConfig.tokenKey), helperFunctions.apiReqs('post', user));
        // copy data
        let copyDataObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            copy_all:   false,
        };
        const copyDataRes = await helperFunctions.fetcher(helperFunctions.getURL('copy_test_data'), helperFunctions.apiReqs('post', copyDataObj, loginRes.authorization.jwt));
        expect(copyDataRes.message).toEqual('success');
        // get myPlan
        let myPlanObj = {
            user_id:    loginRes.user.id,
            start_date: moment().format('YYYY-MM-DD'),
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const dailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt));
        // make sure we are successful & valid - Get MyPlan
        expect(dailyPlanRes.daily_plans[0].daily_readiness_survey_completed).toEqual(false);
        expect(dailyPlanRes.readiness.clear_candidates.length).toEqual(1);
        expect(dailyPlanRes.readiness.hist_sore_status.length).toEqual(1);
        // simulate clicks
        let dailyReadinessObj = _.cloneDeep(defaultPlanState.dailyReadiness);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('already_trained_number', false, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions_planned', true, false, false, false, dailyReadinessObj, false);
        let { newSoreBodyParts, } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadinessObj, dailyPlanRes.readiness, { state: { isAllGood: false, showWholeArea: false,}});
        dailyReadinessObj.soreness = newSoreBodyParts;
        _.map(newSoreBodyParts, bodyPart => {
            let {
                bodyPartIndex,
                isClearCandidate,
                pain,
                side,
                value,
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, bodyPart.isClearCandidate ? 1 : 4);
            dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, dailyReadinessObj, isClearCandidate);
        });
        // submit readiness survey
        let prepareObj = { isReadinessSurveyCompleted: false, };
        let healthData = {
            ignoredWorkouts: [],
            sleep:           [],
            workouts:        [],
        };
        let { newDailyReadiness, } = PlanLogic.handleReadinessSurveySubmitLogic(loginRes.user.id, dailyReadinessObj, prepareObj, healthData);
        // check newDailyReadiness is correct before sending
        let newNewDailyReadiness = _.cloneDeep(newDailyReadiness);
        delete newNewDailyReadiness.date_time;
        let sorenessArray = [
            {body_part: 7, pain: true, side: 1, status: 'almost_persistent_2_pain_acute', severity: 4}
        ];
        let clearCandidatesArray = [
            {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 1}
        ];
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, [], sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        let dailyPlanObj = readinessSurveyRes.daily_plans[0];
        let exerciseList = _.concat(dailyPlanObj.pre_recovery.inhibit_exercises, dailyPlanObj.pre_recovery.lengthen_exercises, dailyPlanObj.pre_recovery.activate_exercises);
        expect(dailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(dailyPlanObj.landing_screen).toEqual(0);
        expect(dailyPlanObj.pre_recovery.display_exercises).toEqual(true);
        expect(dailyPlanObj.post_recovery.display_exercises).toEqual(false);
        expect(exerciseList.length === 0).toEqual(true);
        // check after submit we have the right previous soreness
        let previousSorenessObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
        expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(2);
        _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
            expect(
                soreBodyPart.status === 'persistent_2_pain' ||
                soreBodyPart.status === 'persistent_pain'
            ).toBe(true);
        });
    });

    it('#3: Submit RS with 1 Clear Candidate (clear) & 1 Hist Sore Status with tipping point (Screen on Recover), Complete Recover with 4 Exercises (Screen on Recover)', async () => {
        // login
        const loginRes = await helperFunctions.fetcher(helperFunctions.getURL(APIConfig.tokenKey), helperFunctions.apiReqs('post', user));
        // copy data
        let copyDataObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            copy_all:   false,
        };
        const copyDataRes = await helperFunctions.fetcher(helperFunctions.getURL('copy_test_data'), helperFunctions.apiReqs('post', copyDataObj, loginRes.authorization.jwt));
        expect(copyDataRes.message).toEqual('success');
        // get myPlan
        let myPlanObj = {
            user_id:    loginRes.user.id,
            start_date: moment().format('YYYY-MM-DD'),
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const dailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt));
        // make sure we are successful & valid - Get MyPlan
        expect(dailyPlanRes.daily_plans[0].daily_readiness_survey_completed).toEqual(false);
        expect(dailyPlanRes.readiness.clear_candidates.length).toEqual(1);
        expect(dailyPlanRes.readiness.hist_sore_status.length).toEqual(1);
        // simulate clicks
        let dailyReadinessObj = _.cloneDeep(defaultPlanState.dailyReadiness);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('already_trained_number', false, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions_planned', false, false, false, false, dailyReadinessObj, false);
        let { newSoreBodyParts, } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadinessObj, dailyPlanRes.readiness, { state: { isAllGood: false, showWholeArea: false,}});
        dailyReadinessObj.soreness = newSoreBodyParts;
        _.map(newSoreBodyParts, bodyPart => {
            let {
                bodyPartIndex,
                isClearCandidate,
                pain,
                side,
                value,
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, bodyPart.isClearCandidate ? 0 : 3);
            dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, dailyReadinessObj, isClearCandidate);
        });
        // submit readiness survey
        let prepareObj = { isReadinessSurveyCompleted: false, };
        let healthData = {
            ignoredWorkouts: [],
            sleep:           [],
            workouts:        [],
        };
        let { newDailyReadiness, } = PlanLogic.handleReadinessSurveySubmitLogic(loginRes.user.id, dailyReadinessObj, prepareObj, healthData);
        // check newDailyReadiness is correct before sending
        let newNewDailyReadiness = _.cloneDeep(newDailyReadiness);
        delete newNewDailyReadiness.date_time;
        let sorenessArray = [
            {body_part: 7, pain: true, side: 1, status: 'almost_persistent_2_pain_acute', severity: 3}
        ];
        let clearCandidatesArray = [
            {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 0}
        ];
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, false, [], sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        let dailyPlanObj = readinessSurveyRes.daily_plans[0];
        let exerciseList = _.concat(dailyPlanObj.post_recovery.inhibit_exercises, dailyPlanObj.post_recovery.lengthen_exercises, dailyPlanObj.post_recovery.activate_exercises);
        expect(dailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(dailyPlanObj.landing_screen).toEqual(2);
        expect(dailyPlanObj.pre_recovery.display_exercises).toEqual(false);
        expect(dailyPlanObj.post_recovery.display_exercises).toEqual(true);
        expect(exerciseList.length === 0).toEqual(false);
        // check after submit we have the right previous soreness
        let previousSorenessObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
        expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(1);
        _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
            expect(soreBodyPart.status).toEqual('persistent_2_pain');
        });
        // simulate completing a round of exercises
        let completedExercises = [`${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-0`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-1`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-2`, `${exerciseList[_.random(0, (exerciseList.length - 1))].library_id}-2`];
        let { newCompletedExercises, } = PlanLogic.handleCompletedExercises(completedExercises);
        let patchActiveRecoveryObj = {
            user_id:             loginRes.user.id,
            event_date:          `${moment().toISOString(true).split('.')[0]}Z`,
            recovery_type:       'post',
            completed_exercises: newCompletedExercises,
        };
        const patchActiveRecoveryRes = await helperFunctions.fetcher(helperFunctions.getURL('active_recovery'), helperFunctions.apiReqs('patch', patchActiveRecoveryObj, loginRes.authorization.jwt));
        let activeRecoveryDailyPlanObj = patchActiveRecoveryRes.daily_plans[0];
        expect(activeRecoveryDailyPlanObj.landing_screen).toEqual(2);
        expect(activeRecoveryDailyPlanObj.post_recovery.completed).toEqual(true);
    });

    it('#4: Submit RS with 1 Clear Candidate (clear), 1 Hist Sore Status with tipping point (clear), 1 Extra Body Part, & 1 session (Screen on Mobilize), PSS with 2 Sessions & 2 Extra Body Parts (Screen on Recover)', async () => {
        // initialize date time
        let eventDate = `${moment().toISOString(true).split('.')[0]}Z`;
        // login
        const loginRes = await helperFunctions.fetcher(helperFunctions.getURL(APIConfig.tokenKey), helperFunctions.apiReqs('post', user));
        // copy data
        let copyDataObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            copy_all:   false,
        };
        const copyDataRes = await helperFunctions.fetcher(helperFunctions.getURL('copy_test_data'), helperFunctions.apiReqs('post', copyDataObj, loginRes.authorization.jwt));
        expect(copyDataRes.message).toEqual('success');
        // get myPlan
        let myPlanObj = {
            user_id:    loginRes.user.id,
            start_date: moment().format('YYYY-MM-DD'),
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const dailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt));
        // make sure we are successful & valid - Get MyPlan
        expect(dailyPlanRes.daily_plans[0].daily_readiness_survey_completed).toEqual(false);
        expect(dailyPlanRes.readiness.clear_candidates.length).toEqual(1);
        expect(dailyPlanRes.readiness.hist_sore_status.length).toEqual(1);
        // simulate clicks - 1 session, sessions planned, answer to previous soreness, & adding new soreness
        let dailyReadinessObj = _.cloneDeep(defaultPlanState.dailyReadiness);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('already_trained_number', 1, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].sport_name', 70, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].session_type', 6, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].event_date', eventDate, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.event_date', eventDate, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].duration', 45, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.RPE', 4, false, false, false, dailyReadinessObj, false);
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions_planned', true, false, false, false, dailyReadinessObj, false);
        let { newSoreBodyParts, } = PlanLogic.handleReadinessSurveyRenderLogic(dailyReadinessObj, dailyPlanRes.readiness, { state: { isAllGood: false, showWholeArea: false,}});
        dailyReadinessObj.soreness = newSoreBodyParts;
        _.map(newSoreBodyParts, bodyPart => {
            let {
                bodyPartIndex,
                isClearCandidate,
                pain,
                side,
                value,
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, 0);
            dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, dailyReadinessObj, isClearCandidate);
        });
        dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', 2, false, 21, 1, dailyReadinessObj, false);
        // submit readiness survey
        let prepareObj = { isReadinessSurveyCompleted: false, };
        let healthData = {
            ignoredWorkouts: [],
            sleep:           [],
            workouts:        [],
        };
        let { newDailyReadiness, } = PlanLogic.handleReadinessSurveySubmitLogic(loginRes.user.id, dailyReadinessObj, prepareObj, healthData);
        // check newDailyReadiness is correct before sending
        let newNewDailyReadiness = _.cloneDeep(newDailyReadiness);
        delete newNewDailyReadiness.date_time;
        let sorenessArray = [
            {body_part: 21, side: 1, pain: false, severity: 2, isClearCandidate: false,}
        ];
        let clearCandidatesArray = [
            {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 0}
        ];
        let sessionsArray = [
            {description: '', ignored: false, deleted: false, sport_name: 70, session_type: 6, event_date: eventDate, duration: 45, post_session_survey: {event_date: eventDate, RPE: 4, soreness: []}, strength_and_conditioning_type: null}
        ];
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, sessionsArray, sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        let dailyPlanObj = readinessSurveyRes.daily_plans[0];
        let exerciseList = _.concat(dailyPlanObj.pre_recovery.inhibit_exercises, dailyPlanObj.pre_recovery.lengthen_exercises, dailyPlanObj.pre_recovery.activate_exercises);
        expect(dailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(dailyPlanObj.landing_screen).toEqual(0);
        expect(dailyPlanObj.pre_recovery.display_exercises).toEqual(true);
        expect(dailyPlanObj.post_recovery.display_exercises).toEqual(false);
        expect(dailyPlanObj.training_sessions.length).toEqual(1);
        expect(exerciseList.length === 0).toEqual(false);
        // check after submit we have the right previous soreness
        let previousSorenessObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
        expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(1);
        expect(previousSorenessRes.readiness.body_parts.length).toEqual(1);
        expect(previousSorenessRes.typical_sessions.length).toEqual(1);
        _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
            expect(
                soreBodyPart.status === 'persistent_2_pain' ||
                soreBodyPart.status === 'almost_persistent_2_pain_acute'
            ).toBe(true);
        });
        // Submit PSS with 1 Session (Screen on Recover)
        let postSessionObj = _.cloneDeep(defaultPlanState.postSession);
        let trainObj = _.cloneDeep(defaultPlanState.train);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].sport_name', previousSorenessRes.typical_sessions[0].sport_name, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].session_type', previousSorenessRes.typical_sessions[0].session_type, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].event_date', eventDate, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.event_date', eventDate, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].duration', 65, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[0].post_session_survey.RPE', 3, null, null, null, postSessionObj);
        let newSessions = _.cloneDeep(postSessionObj.sessions);
        newSessions.push(PlanLogic.returnEmptySession());
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions', newSessions, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].sport_name', 4, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].session_type', 6, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].event_date', eventDate, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].post_session_survey.event_date', eventDate, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].duration', 45, null, null, null, postSessionObj);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('sessions[1].post_session_survey.RPE', 5, null, null, null, postSessionObj);
        let newNewSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(previousSorenessRes.readiness);
        postSessionObj.soreness = newNewSoreBodyParts;
        _.map(newNewSoreBodyParts, bodyPart => {
            let {
                bodyPartIndex,
                isClearCandidate,
                pain,
                side,
                value,
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, 0);
            postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, postSessionObj, isClearCandidate);
        });
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', 2, false, 21, 2, postSessionObj, false);
        postSessionObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', 2, true, 12, 0, postSessionObj, false);
        let { newPostSession, } = PlanLogic.handlePostSessionSurveySubmitLogic(loginRes.user.id, postSessionObj, trainObj, healthData, eventDate);
        // check newPostSession is correct before sending
        let newSorenessArray = [
            {body_part: 21, side: 2, pain: false, severity: 2, isClearCandidate: false,},
            {body_part: 12, side: 0, pain: true, severity: 2, isClearCandidate: false,}
        ];
        let newClearCandidatesArray = [];
        let newSessionsArray = [
            {description: '', ignored: false, deleted: false, sport_name: previousSorenessRes.typical_sessions[0].sport_name, session_type: previousSorenessRes.typical_sessions[0].session_type, event_date: eventDate, duration: 65, post_session_survey: {event_date: eventDate, RPE: 3, soreness: []}, strength_and_conditioning_type: null},
            {description: '', ignored: false, deleted: false, sport_name: 4, session_type: 6, event_date: eventDate, duration: 45, post_session_survey: {event_date: eventDate, RPE: 5, soreness: newSorenessArray, clear_candidates: newClearCandidatesArray}, strength_and_conditioning_type: null},
        ];
        expect(newPostSession).toEqual(helperFunctions.newPostSessionExpectedResult(loginRes, eventDate, newSessionsArray));
        const postSessionSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_session_survey'), helperFunctions.apiReqs('post', newPostSession, loginRes.authorization.jwt));
        let thirdDailyPlanObj = postSessionSurveyRes.daily_plans[0];
        let thirdExerciseList = _.concat(thirdDailyPlanObj.post_recovery.inhibit_exercises, thirdDailyPlanObj.post_recovery.lengthen_exercises, thirdDailyPlanObj.post_recovery.activate_exercises);
        expect(thirdDailyPlanObj.daily_readiness_survey_completed).toEqual(true);
        expect(thirdDailyPlanObj.landing_screen).toEqual(2);
        expect(thirdDailyPlanObj.pre_recovery.display_exercises).toEqual(false);
        expect(thirdDailyPlanObj.post_recovery.display_exercises).toEqual(true);
        expect(thirdDailyPlanObj.training_sessions.length).toEqual(3);
        expect(thirdExerciseList.length === 0).toEqual(false);
    });

});