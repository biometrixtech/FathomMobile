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

// Consts and Libs
import Fabric from 'react-native-fabric';
import JWT from './jwt';
import { AppConfig, ErrorMessages, APIConfig } from '../constants';
import { store } from '../store';
import { Actions as DispatchActions } from '../constants';

// import third-party libraries
import { Actions } from 'react-native-router-flux';

const { Answers } = Fabric;

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

/**
  * Sends requests to the API
  */
function fetcher(method, inputEndpoint, inputParams, body, api_enum) {
    let endpoint = inputEndpoint;
    const params = inputParams;
    let currentState = store.getState();
    let environment = currentState.init.environment;
    let jwt = currentState.init.jwt;
    let hostname = '';

    return new Promise(async (resolve, reject) => {
        requestCounter += 1;
        const requestNum = requestCounter;

        // After x seconds, let's call it a day!
        const timeoutAfter = 25;
        const apiTimedOut = setTimeout(() => (
            reject(ErrorMessages.timeout)
        ), timeoutAfter * 1000);

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

        debug('', `API Request #${requestNum} to ${thisUrl}`);

        // Make the request
        return fetch(thisUrl, req)
            .then(async (rawRes) => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);
                let jsonRes = {};

                try {
                    jsonRes = await rawRes.json();
                } catch (error) {
                    if (rawRes.status !== 200 || rawRes.status !== 201 || rawRes.status !== 202) {
                        const err = { message: ErrorMessages.invalidJson };
                        throw err;
                    }
                }

                // if we get a 401 - authorization failed, re-authorizeUser
                console.log('++++++++++',rawRes);
                if (rawRes && /401/.test(`${rawRes.status}`) && endpoint !== APIConfig.endpoints.get(APIConfig.tokenKey)) {
                    unauthorizedCounter += 1;
                    if(unauthorizedCounter === 5 && /[/]authorize/.test(endpoint)) {
                        unauthorizedCounter = 0;
                        store.dispatch({
                            type: DispatchActions.LOGOUT
                        });
                        return Actions.login();
                    }
                    let userIdObj = {userId: currentState.user.id};
                    let sessionTokenObj = {session_token: currentState.init.session_token};
                    return fetcher('POST', APIConfig.endpoints.get('authorize'), userIdObj, sessionTokenObj, 0)
                        .then((res) => {
                            unauthorizedCounter = 0;
                            store.dispatch({
                                type:    DispatchActions.LOGIN,
                                jwt:     res.authorization.jwt,
                                expires: res.authorization.expires,
                            });
                            // re-send API
                            return fetcher(method, endpoint, params, body, api_enum);
                        })
                        .catch((err) => {
                            // logout user and route to login
                            store.dispatch({
                                type: DispatchActions.LOGOUT
                            });
                            return Actions.login();
                        });
                }

                // Only continue if the header is successful
                if (rawRes && /20[012]/.test(`${rawRes.status}`)) { return jsonRes; }

                throw jsonRes;
            })
            .then(res => {
                debug(res, `API Response #${requestNum} from ${thisUrl}`);

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
                return resolve(res);
            })
            .catch(err => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);
                debug(err, thisUrl);

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
