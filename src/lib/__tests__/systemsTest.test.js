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
        return [
            { personal_data: { email: 'dipesh+persona1@fathomai.com', }, password: 'Fathom123!', },
        ];
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

    newNewDailyReadinessExpectedResult: (loginRes, sessions_planned, sorenessArray, clearCandidatesArray) => {
        return {
            user_id:                   loginRes.user.id,
            soreness:                  sorenessArray,
            clear_candidates:          clearCandidatesArray,
            sleep_quality:             null,
            readiness:                 null,
            wants_functional_strength: null,
            sessions_planned,
            sessions:                  [],
            sleep_data:                []
        };
    },

};

// trigger our tests
describe('Looping through every user', () => {

    jest.setTimeout(60000);

    let user = helperFunctions.getTestUsersLoginInfo()[0];

    it(`TESTING USER: ${user.personal_data.email} - Screen on Mobilize, 1 Clear Candidate (not clear), & 1 Hist Sore Status with tipping point`, async () => {
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
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        expect(readinessSurveyRes.message).toEqual('success');
        // simulate delay as we wait for 'notification' -> getMyPlan
        const secondDailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt), true);
        let dailyPlanObj = secondDailyPlanRes.daily_plans[0];
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
    });

    it(`TESTING USER: ${user.personal_data.email} - Screen on Mobilize (LOCKED), 1 Clear Candidate (not clear), & 1 Hist Sore Status with tipping point`, async () => {
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
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        expect(readinessSurveyRes.message).toEqual('success');
        // simulate delay as we wait for 'notification' -> getMyPlan
        const secondDailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt), true);
        let dailyPlanObj = secondDailyPlanRes.daily_plans[0];
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

    it(`TESTING USER: ${user.personal_data.email} - Screen on Recover, 1 Clear Candidate (clear), & 1 Hist Sore Status with tipping point`, async () => {
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
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, false, sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        expect(readinessSurveyRes.message).toEqual('success');
        // simulate delay as we wait for 'notification' -> getMyPlan
        const secondDailyPlanRes = await helperFunctions.fetcher(helperFunctions.getURL('get_my_plan'), helperFunctions.apiReqs('post', myPlanObj, loginRes.authorization.jwt), true);
        let dailyPlanObj = secondDailyPlanRes.daily_plans[0];
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
    });

    it(`TESTING USER: ${user.personal_data.email} - 1 Clear Candidate (clear) & 1 Hist Sore Status with tipping point (clear)`, async () => {
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
            } = helperFunctions.getNewSoreBodyPartsOptions(bodyPart, 0);
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
        let sorenessArray = [];
        let clearCandidatesArray = [
            {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 0}
        ];
        expect(newNewDailyReadiness).toEqual(helperFunctions.newNewDailyReadinessExpectedResult(loginRes, true, sorenessArray, clearCandidatesArray));
        // make sure we are successful & valid - Readiness Survey Submit
        const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
        expect(readinessSurveyRes.message).toEqual('success');
        // check after submit we have the right previous soreness
        let previousSorenessObj = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
        };
        const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
        expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(1);
        _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
            expect(
                soreBodyPart.status === 'persistent_2_pain' ||
                soreBodyPart.status === 'almost_persistent_2_pain_acute'
            ).toBe(true);
        });
    });

});