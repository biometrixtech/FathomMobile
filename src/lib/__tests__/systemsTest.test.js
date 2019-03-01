/* global it expect jest */
/* global describe expect jest */
/* global fetch console */
// import 'react-native';

// import third-party libraries
import _ from 'lodash';

// import logic file(s)
import { AppAPI, PlanLogic, } from '../';
import { APIConfig, AppConfig, } from '../../constants';

const helperFunctions = {

    apiReqs: (method, body) => {
        let req = {
            method:  method.toUpperCase(),
            headers: {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'User-Agent':   AppConfig.deviceInfo,
            },
        };
        if (body) { req.body = JSON.stringify(body); }
        return req;
    },

    getURL: () => {
        let environment = 'TEST';
        return `${APIConfig.APIs[environment]}${APIConfig.endpoints.get(APIConfig.tokenKey)}`;
    },

    fetcher: (url, req) => {
        return new Promise(resolve => fetch(url, req).then(response => response.json()).then(json => json) );
    },

    getTestUsersLoginInfo: () => {
        return [
            { personal_data: { email: 'mazen+mvp@fathomai.com', }, password: 'Fathom123!', },
            { personal_data: { email: 'dipesh+mvp@fathomai.com', }, password: 'Fathom123!', },
            { personal_data: { email: 'chrisp+mvp@fathomai.com', }, password: 'Fathom123!', },
        ];
    },

};

describe('Looping through every user', () => {

    // _.map(helperFunctions.getTestUsersLoginInfo(), user => {
    let user = helperFunctions.getTestUsersLoginInfo()[0];
    console.log(user);
    it(`TESTING USER: ${user.email}`, async () => {
        console.log(helperFunctions.getURL(), helperFunctions.apiReqs('post'));
        const userAuth = await helperFunctions.fetcher(helperFunctions.getURL(), helperFunctions.apiReqs('post', user));
        console.log(userAuth);
        expect(userAuth).toBeDefined();
        expect(userAuth.name).toEqual('Koen van Gilst');
    });
    // });

});