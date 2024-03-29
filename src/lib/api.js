/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:16:44
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-20 18:11:10
 */

/**
 * API Functions
 */
/* global fetch console */
import { Platform, } from 'react-native';

// Consts and Libs
import * as Fabric from 'react-native-fabric';
import JWT from './jwt';
import { APIConfig, Actions as DispatchActions, AppConfig, ErrorMessages, } from '../constants';
import { store } from '../store';

// import third-party libraries
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// setup consts
const Answers = Fabric.Answers;
const Crashlytics = Fabric.Crashlytics;

// We'll use JWT for API Authentication
// const Token = {};
const Token = new JWT();

const API_ENUM = {
    API:           0,
    HARDWARE:      1,
    PREPROCESSING: 2,
    STATS:         3,
};

// Config
const ENDPOINTS     = APIConfig.endpoints;
const STATS         = APIConfig.statsEndpoints;
const PREPROCESSING = APIConfig.preprocessingEndpoints;
const HARDWARE      = APIConfig.hardwareEndpoints;
const API_MAP       = ['get', 'post', 'patch', 'put', 'delete'];

let HOSTNAME, STATS_HOSTNAME, PREPROCESSING_HOSTNAME, HARDWARE_HOSTNAME;

// Enable debug output when in Debug mode
const DEBUG_MODE = AppConfig.DEV;

// Number each API request (used for debugging)
let requestCounter = 0;
let retryCounter = 0;
let unauthorizedCounter = 0;

/* Helper Functions ==================================================================== */
/**
  * Debug or not to debug
  */
function debug(str, title) {
    if (DEBUG_MODE && (title || str)) {
        if (title) {
            console.log(`=== DEBUG: ${title} ===========================`);
        }
        if (str) {
            console.log(Object.assign({}, str));
            console.log('%c ...', 'color: #CCC');
        }
    }
}

/**
  * Sends requests to the API
  */
function handleError(err) {
    let error = '';
    if (typeof err === 'string') {
        error = err;
    } else if (err && err.error) {
        error = err.error;
    } else if (err && err.message) {
        error = err.message;
    }

    if (!error) { error = ErrorMessages.default; }
    return error;
}

/**
  * Convert param object into query string
  * eg.
  *   {foo: 'hi there', bar: { blah: 123, quux: [1, 2, 3] }}
  *   foo=hi there&bar[blah]=123&bar[quux][0]=1&bar[quux][1]=2&bar[quux][2]=3
  */
function serialize(obj, prefix) {
    const str = [];

    Object.keys(obj).forEach((p) => {
        const k = prefix ? `${prefix}[${p}]` : p;
        const v = obj[p];

        str.push((v !== null && typeof v === 'object') ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    });

    return str.join('&');
}

/*
 * Checks if we need to reauthorize the user before continuing
 */
function _handleReAuthorizing(hostname, currentState) {
    let currentInitState = currentState.init;
    let currentUserState = currentState.user;
    if(!currentInitState.expires) {
        return Promise.resolve();
    }
    let expiresDateTime = moment.utc(currentInitState.expires, 'YYYY-MM-DDTHH:mm:ssZ');
    let currentDateTime = moment();
    let timeDiff = expiresDateTime.diff(currentDateTime, 'minutes', true);
    if(timeDiff <= 5) {
        // reauthorize user since we're close to expiration time
        let reAuthorizeParam = { userId: currentUserState.id, };
        let sessionTokenObj = { session_token: currentInitState.session_token, };
        let reAuthorizeEndpoint = APIConfig.endpoints.get('authorize');
        Object.keys(reAuthorizeParam).forEach(param => {
            if (reAuthorizeEndpoint.includes(`{${param}}`)) {
                reAuthorizeEndpoint = reAuthorizeEndpoint.split(`{${param}}`).join(reAuthorizeParam[param]);
                delete reAuthorizeParam[param];
            }
        });
        let reAuthorizeUrl = `${hostname}${reAuthorizeEndpoint}`;
        let reAuthorizeReqs = {
            body:    JSON.stringify(sessionTokenObj),
            headers: {
                'Accept':        'application/json',
                'Authorization': currentInitState.jwt,
                'Content-Type':  'application/json',
                'User-Agent':    AppConfig.deviceInfo,
            },
            method: 'POST',
        };
        requestCounter += 1;
        debug('', `API Request #${requestCounter} to ${reAuthorizeUrl} @ ${moment()}`);
        return fetch(reAuthorizeUrl, reAuthorizeReqs)
            .then(async res => {
                if(res && /20[012]/.test(`${res.status}`)) {
                    return res.json();
                }
                // log user out
                await store.dispatch({
                    type: DispatchActions.LOGOUT
                });
                return Promise.reject();
            })
            .then(cleanedRes => {
                debug(cleanedRes, `API Response #${requestCounter} from ${reAuthorizeUrl} @ ${moment()}`);
                // successfully fetched, update reducer, and resend API
                store.dispatch({
                    type:    DispatchActions.LOGIN,
                    jwt:     cleanedRes.authorization.jwt,
                    expires: cleanedRes.authorization.expires,
                });
                return Promise.resolve(cleanedRes.authorization.jwt);
            });
    }
    // resolve since we are still in the valid window
    return Promise.resolve();
}

/**
  * Sends requests to the API
  */
function fetcher(method, inputEndpoint, inputParams, body, api_enum) {
    let endpoint = inputEndpoint;
    const params = inputParams;
    let currentState = store.getState();
    let environment = currentState.init.environment;
    let networkState = currentState.network;
    let jwt = currentState.init.jwt;
    let hostname = '';

    return new Promise(async (resolve, reject) => {
        requestCounter += 1;
        const requestNum = requestCounter;

        // reject if there is no internet connection detected
        if(!networkState.connected) {
            reject(handleError({ message: ErrorMessages.timeout, }));
        }
        // After x seconds, let's call it a day!
        const timeoutAfter = 20;
        const apiTimedOut = _.delay(() => reject(handleError({ message: ErrorMessages.timeout, })), timeoutAfter * 1000);

        if (!method || !endpoint) { return reject('Missing params (AppAPI.fetcher).'); }

        // Build request
        const req = {
            method:  method.toUpperCase(),
            headers: {
                'Accept':       'application/json',
                'Content-Type': 'application/json',
                'User-Agent':   AppConfig.deviceInfo,
            },
        };

        // Add Token
        // Don't add on the login endpoint
        if (endpoint !== APIConfig.endpoints.get(APIConfig.tokenKey)) {
            if (jwt) {
                req.headers.Authorization = jwt;
            }
        }

        // Add Host name
        // Don't add on anything but the login endpoint if host name already exists
        if (api_enum === API_ENUM.API) {
            if (!HOSTNAME || endpoint === APIConfig.endpoints.get(APIConfig.tokenKey)) {
                HOSTNAME = APIConfig.APIs[environment];
            }
            hostname = HOSTNAME;
        } else if (api_enum === API_ENUM.HARDWARE) {
            if (!HARDWARE_HOSTNAME) {
                HARDWARE_HOSTNAME = APIConfig.HARDWARE_APIs[environment];
            }
            hostname = HARDWARE_HOSTNAME;
        } else if (api_enum === API_ENUM.PREPROCESSING) {
            if (!PREPROCESSING_HOSTNAME) {
                PREPROCESSING_HOSTNAME = APIConfig.PREPROCESSING_APIs[environment];
            }
            hostname = PREPROCESSING_HOSTNAME;
        } else if (api_enum === API_ENUM.STATS) {
            if (!STATS_HOSTNAME) {
                STATS_HOSTNAME = APIConfig.STATS_APIs[environment];
            }
            hostname = STATS_HOSTNAME;
        }

        // Add Endpoint Params
        let urlParams = '';
        if (params) {
            // Object - eg. /users?title=this&cat=2
            if (typeof params === 'object') {
                // Replace matching params in API routes eg. /users/{param}/foo
                Object.keys(params).forEach((param) => {
                    if (endpoint.includes(`{${param}}`)) {
                        endpoint = endpoint.split(`{${param}}`).join(params[param]);
                        delete params[param];
                    }
                });

                // Check if there's still an 'id' prop, /{id}?
                if (params.id) {
                    if (typeof params.id === 'string' || typeof params.id === 'number') {
                        urlParams = `/${params.id}`;
                        delete params.id;
                    }
                }

                // Add the rest of the params as a query string
                urlParams = `?${serialize(params)}`;

            // String or Number - eg. /users/23
            } else if (typeof params === 'string' || typeof params === 'number') {
                urlParams = `/${params}`;

            // Something else? Just log an error
            } else {
                debug('You provided params, but it wasn\'t an object!', hostname + endpoint + urlParams);
            }
        }

        // Add Body
        if (body) { req.body = JSON.stringify(body); }

        const thisUrl = `${hostname}${endpoint}${urlParams}`;

        debug('', `API Request #${requestNum} to ${thisUrl} @ ${moment()}`);

        // Make the request
        return await _handleReAuthorizing(hostname, currentState)
            .then(async newJwt => {
                if(newJwt) {
                    jwt = newJwt;
                    req.headers.Authorization = newJwt;
                }
                return await fetch(thisUrl, req);
            })
            .then(async rawRes => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);
                // run through logic
                if(rawRes && /20[012]/.test(`${rawRes.status}`)) {
                    // success reset counters and send body
                    unauthorizedCounter = 0;
                    retryCounter = 0;
                    return rawRes.json();
                } else if(rawRes && /401/.test(`${rawRes.status}`) && endpoint !== APIConfig.endpoints.get(APIConfig.tokenKey)) {
                    // unauthorized error encountered
                    if(unauthorizedCounter === 0 && currentState && currentState.user && currentState.user.id) {
                        // update counter and re-authorize user
                        unauthorizedCounter += 1;
                        let reAuthorizeParam = { userId: currentState.user.id, };
                        let sessionTokenObj = { session_token: currentState.init.session_token, };
                        let reAuthorizeEndpoint = APIConfig.endpoints.get('authorize');
                        Object.keys(reAuthorizeParam).forEach(param => {
                            if (reAuthorizeEndpoint.includes(`{${param}}`)) {
                                reAuthorizeEndpoint = reAuthorizeEndpoint.split(`{${param}}`).join(reAuthorizeParam[param]);
                                delete reAuthorizeParam[param];
                            }
                        });
                        let reAuthorizeUrl = `${hostname}${reAuthorizeEndpoint}`;
                        let reAuthorizeReqs = {
                            body:    JSON.stringify(sessionTokenObj),
                            headers: {
                                'Accept':        'application/json',
                                'Authorization': jwt,
                                'Content-Type':  'application/json',
                                'User-Agent':    AppConfig.deviceInfo,
                            },
                            method: 'POST',
                        };
                        requestCounter += 1;
                        debug('', `API Request #${requestCounter} to ${reAuthorizeUrl} @ ${moment()}`);
                        return await fetch(reAuthorizeUrl, reAuthorizeReqs)
                            .then(res => {
                                if(res && /20[012]/.test(`${res.status}`)) {
                                    return res.json();
                                }
                                // reached limit, reset timer and log user out
                                unauthorizedCounter = 0;
                                store.dispatch({
                                    type: DispatchActions.LOGOUT
                                });
                                throw {};
                            })
                            .then(cleanedRes => {
                                debug(cleanedRes, `API Response #${requestCounter} from ${reAuthorizeUrl} @ ${moment()}`);
                                // successfully fetched, reset counter, update reducer, and resend API
                                unauthorizedCounter = 0;
                                store.dispatch({
                                    type:    DispatchActions.LOGIN,
                                    jwt:     cleanedRes.authorization.jwt,
                                    expires: cleanedRes.authorization.expires,
                                });
                                return fetcher(method, endpoint, params, body, api_enum);
                            });
                    }
                    // reached limit, reset timer and log user out
                    unauthorizedCounter = 0;
                    store.dispatch({
                        type: DispatchActions.LOGOUT
                    });
                    throw {};
                } else if( (/500/.test(`${rawRes.status}`) || /429/.test(`${rawRes.status}`)) && endpoint !== APIConfig.endpoints.get(APIConfig.tokenKey) ) {
                    if(retryCounter < 2) {
                        // update counter and retry api
                        retryCounter += 1;
                        return fetcher(method, endpoint, params, body, api_enum);
                    }
                    // reached limit, reset timer, send fabric error, and show generic error message
                    retryCounter = 0;
                    if(Platform.OS === 'ios') {
                        Crashlytics.recordError(`${endpoint} - ${rawRes.message ? rawRes.message.toString() : ''}`);
                    } else {
                        Crashlytics.logException(`${endpoint} - ${rawRes.message ? rawRes.message.toString() : ''}`);
                    }
                    let errorMessage = handleError({ message: ErrorMessages.systemError, });
                    throw {
                        message: errorMessage,
                        status:  rawRes.headers && rawRes.headers.map && rawRes.headers.map.status ? rawRes.headers.map.status : false,
                    };
                }
                // error reset counters and send message
                unauthorizedCounter = 0;
                retryCounter = 0;
                // setup res
                let jsonRes = {};
                try {
                    jsonRes = await rawRes.json();
                } catch (error) {
                    if (rawRes && /20[012]/.test(`${rawRes.status}`)) {
                        const err = { message: ErrorMessages.default };
                        throw err;
                    }
                }
                /*eslint no-throw-literal: 0*/
                throw jsonRes;
            })
            .then(res => {
                debug(res, `API Response #${requestNum} from ${thisUrl} @ ${moment()}`);
                // log Fabric Answers
                try {
                    // Don't send plaintext password to Answers logs
                    if (endpoint === APIConfig.endpoints.get(APIConfig.tokenKey)) {
                        let answerBody = Object.assign({}, body);
                        delete answerBody.password;
                        Answers.logLogin('Mobile App Login', true, {
                            body:          JSON.stringify(answerBody),
                            headers:       JSON.stringify(req.headers),
                            method:        req.method,
                            response:      JSON.stringify(res),
                            requestNumber: requestNum,
                            url:           thisUrl,
                        });
                    } else {
                        Answers.logCustom('API Response success', {
                            body:          JSON.stringify(body),
                            headers:       JSON.stringify(req.headers),
                            method:        req.method,
                            response:      JSON.stringify(res),
                            requestNumber: requestNum,
                            url:           thisUrl,
                        });
                    }
                } catch (error) {
                    console.log(handleError(error));
                }
                // return resolve promise
                return resolve(res);
            })
            .catch(err => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);
                debug(err, thisUrl);
                // log Fabric Answers
                try {
                    // Don't send plaintext password to Answers logs
                    if (endpoint === APIConfig.endpoints.get(APIConfig.tokenKey)) {
                        let answerBody = Object.assign({}, body);
                        delete answerBody.password;
                        Answers.logLogin('Mobile App Login', false, {
                            body:          JSON.stringify(answerBody),
                            headers:       JSON.stringify(req.headers),
                            method:        req.method,
                            response:      JSON.stringify(err),
                            requestNumber: requestNum,
                            url:           thisUrl,
                        });
                    } else {
                        Answers.logCustom('API Response failed', {
                            body:          JSON.stringify(req.body),
                            headers:       JSON.stringify(req.headers),
                            method:        req.method,
                            response:      JSON.stringify(err),
                            requestNumber: requestNum,
                            url:           thisUrl,
                        });
                    }
                } catch (error) {
                    console.log(handleError(error));
                }
                // return reject promise
                return reject(err);
            });
    });
}

/* Create the API Export ==================================================================== */
/**
  * Build services from Endpoints
  * - So we can call AppAPI.users.get() for example
  */
const AppAPI = {
    debug,
    handleError,
    hardware:      {},
    getToken:      Token.getToken,
    preprocessing: {},
    stats:         {},
};

ENDPOINTS.forEach((endpoint, key) => {
    AppAPI[key] = {};
    API_MAP.forEach(apiType => {
        AppAPI[key][apiType] = (params, payload) => fetcher(apiType.toUpperCase(), endpoint, params, payload, API_ENUM.API);
    });
});

HARDWARE.forEach((endpoint, key) => {
    AppAPI.hardware[key] = {};
    API_MAP.forEach(apiType => {
        AppAPI.hardware[key][apiType] = (params, payload) => fetcher(apiType.toUpperCase(), endpoint, params, payload, API_ENUM.HARDWARE);
    });
});

PREPROCESSING.forEach((endpoint, key) => {
    AppAPI.preprocessing[key] = {};
    API_MAP.forEach(apiType => {
        AppAPI.preprocessing[key][apiType] = (params, payload) => fetcher(apiType.toUpperCase(), endpoint, params, payload, API_ENUM.PREPROCESSING);
    });
});

STATS.forEach((endpoint, key) => {
    AppAPI.stats[key] = {};
    API_MAP.forEach(apiType => {
        AppAPI.stats[key][apiType] = (params, payload) => fetcher(apiType.toUpperCase(), endpoint, params, payload, API_ENUM.STATS);
    });
});

/* Export ==================================================================== */
export default AppAPI;
