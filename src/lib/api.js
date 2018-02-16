/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:16:44 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-02-01 12:14:21
 */

/**
 * API Functions
 */
/* global fetch console */
import DeviceInfo from 'react-native-device-info';

// Consts and Libs
import JWT from '@lib/api.jwt';
import { AppUtil } from '@lib/';
import { AppConfig, ErrorMessages, APIConfig } from '@constants/';

// We'll use JWT for API Authentication
// const Token = {};
const Token = new JWT();

// Config
// const HOSTNAME = APIConfig.hostname;
const ENDPOINTS = APIConfig.endpoints;
const STATS =     APIConfig.statsEndpoints;

let USER_AGENT, HOSTNAME, STATS_HOSTNAME;
try {
    // Build user agent string
    USER_AGENT = `${AppConfig.appName} ${DeviceInfo.getVersion()}; ${DeviceInfo.getSystemName()} ` +
        `${DeviceInfo.getSystemVersion()}; ${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}`;
} catch (e) {
    USER_AGENT = `${AppConfig.appName}`;
}

// Enable debug output when in Debug mode
const DEBUG_MODE = AppConfig.DEV;

// Number each API request (used for debugging)
let requestCounter = 0;


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
function fetcher(method, inputEndpoint, inputParams, body, stats) {
    let endpoint = inputEndpoint;
    const params = inputParams;

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
                'User-Agent':   USER_AGENT,
            },
        };

        // Add Token
        // Don't add on the login endpoint
        if (Token.getStoredToken && endpoint !== APIConfig.endpoints.get(APIConfig.tokenKey)) {
            const apiToken = await Token.getStoredToken();
            if (apiToken) {
                if (stats) {
                    req.headers.Authorization = apiToken;
                } else {
                    req.headers.jwt = apiToken;
                }
            }
        }

        // Add Host name
        // Don't add on anything but the login endpoint if host name already exists
        if (!HOSTNAME || endpoint === APIConfig.endpoints.get(APIConfig.tokenKey)) {
            HOSTNAME = await Token.getAPIHost();
        }

        if (!STATS_HOSTNAME) {
            STATS_HOSTNAME = await Token.getStatsHost();
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
                debug('You provided params, but it wasn\'t an object!', (stats ? STATS_HOSTNAME : HOSTNAME) + endpoint + urlParams);
            }
        }

        // Add Body
        if (body) { req.body = JSON.stringify(body); }

        const thisUrl = `${stats ? STATS_HOSTNAME : HOSTNAME}${endpoint}${urlParams}`;

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
                    if (rawRes.status !== 200) {
                        const err = { message: ErrorMessages.invalidJson };
                        throw err;
                    }
                }

                // Only continue if the header is successful
                if (rawRes && rawRes.status === 200) { return jsonRes; }
                throw jsonRes;
            })
            .then((res) => {
                debug(res, `API Response #${requestNum} from ${thisUrl}`);
                return resolve(res);
            })
            .catch((err) => {
                // API got back to us, clear the timeout
                clearTimeout(apiTimedOut);

                const apiCredentials = Token.getStoredCredentials ? Token.getStoredCredentials() : {};

                // If unauthorized, try logging them back in
                if (
                    !AppUtil.objIsEmpty(apiCredentials) &&
                    err &&
                    err.data &&
                    err.data.status.toString().charAt(0) === 4 &&
                    err.code !== 'jwt_auth_failed' &&
                    Token.getToken
                ) {
                    return Token.getToken()
                        .then(() => { fetcher(method, endpoint, params, body); })
                        .catch(error => reject(error));
                }

                debug(err, thisUrl);
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
    handleError,
    getToken:     Token.getToken,
    deleteToken:  Token.deleteToken,
    storeAPIHost: Token.storeAPIHost,
    stats:        {}
};

ENDPOINTS.forEach((endpoint, key) => {
    AppAPI[key] = {
        get:    (params, payload) => fetcher('GET',    endpoint, params, payload, false),
        post:   (params, payload) => fetcher('POST',   endpoint, params, payload, false),
        patch:  (params, payload) => fetcher('PATCH',  endpoint, params, payload, false),
        put:    (params, payload) => fetcher('PUT',    endpoint, params, payload, false),
        delete: (params, payload) => fetcher('DELETE', endpoint, params, payload, false),
    };
});

STATS.forEach((endpoint, key) => {
    AppAPI.stats[key] = {
        get:    (params, payload) => fetcher('GET',    endpoint, params, payload, true),
        post:   (params, payload) => fetcher('POST',   endpoint, params, payload, true),
        patch:  (params, payload) => fetcher('PATCH',  endpoint, params, payload, true),
        put:    (params, payload) => fetcher('PUT',    endpoint, params, payload, true),
        delete: (params, payload) => fetcher('DELETE', endpoint, params, payload, true),
    };
});

/* Export ==================================================================== */
export default AppAPI;
