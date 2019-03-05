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

    fetcher: async (url, req) => {
        const response = await fetch(url, req).then(res => res);
        // if(response.status === 200) {}
        const data = await response.json();
        return data;
    },

    getTestUsersLoginInfo: () => {
        return [
            { personal_data: { email: 'dipesh+persona1@fathomai.com', }, password: 'Fathom123!', },
        ];
    },

};

// trigger our tests
describe('Looping through every user', () => {

    jest.setTimeout(20000);

    _.map(helperFunctions.getTestUsersLoginInfo(), user => {

        it(`TESTING USER: ${user.personal_data.email}`, async () => {
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
                let value = bodyPart.isClearCandidate ? 1 : 3;
                let pain = bodyPart.pain;
                let bodyPartIndex = bodyPart.body_part;
                let side = bodyPart.side;
                let isClearCandidate = bodyPart.isClearCandidate;
                dailyReadinessObj = PlanLogic.handleDailyReadinessAndPostSessionFormChange('soreness', value, pain, bodyPartIndex, side, dailyReadinessObj, isClearCandidate);
            });
            // submit readiness survey
            let prepareObj = { isReadinessSurveyCompleted: false, };
            let healthData = {
                ignoredWorkouts: [],
                sleep:           [],
                workouts:        [],
            };
            let { newDailyReadiness, } = PlanLogic.hanldeReadinessSurveySubmitLogic(loginRes.user.id, dailyReadinessObj, prepareObj, healthData);
            // check newDailyReadiness is correct before sending
            let newNewDailyReadiness = _.cloneDeep(newDailyReadiness);
            delete newNewDailyReadiness.date_time;
            expect(newNewDailyReadiness).toEqual(
                {
                    user_id:  loginRes.user.id,
                    soreness: [
                        {body_part: 7, pain: true, side: 1, status: 'almost_persistent_2_pain_acute', severity: 3}
                    ],
                    clear_candidates: [
                        {body_part: 7, pain: true, side: 2, status: 'persistent_2_pain', isClearCandidate: true, severity: 1}
                    ],
                    sleep_quality:             null,
                    readiness:                 null,
                    wants_functional_strength: null,
                    sessions_planned:          true,
                    sessions:                  [],
                    sleep_data:                []
                }
            );
            // make sure we are successful & valid - Readiness Survey Submit
            const readinessSurveyRes = await helperFunctions.fetcher(helperFunctions.getURL('post_readiness_survey'), helperFunctions.apiReqs('post', newDailyReadiness, loginRes.authorization.jwt));
            expect(readinessSurveyRes.message).toEqual('success');
            // check after submit we have the right previous soreness
            let previousSorenessObj = {
                event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            };
            const previousSorenessRes = await helperFunctions.fetcher(helperFunctions.getURL('get_sore_body_parts'), helperFunctions.apiReqs('post', previousSorenessObj, loginRes.authorization.jwt));
            expect(previousSorenessRes.readiness.hist_sore_status.length).toEqual(2);
            _.map(previousSorenessRes.readiness.hist_sore_status, soreBodyPart => {
                // console.log(soreBodyPart);
                // expect(soreBodyPart.status).toEqual('persistent_2_pain');
            });
        });

    });

});