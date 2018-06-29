/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:16:35 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-29 01:17:53
 */

/**
 * API JWT Auth Functions
 */
import jwtDecode from 'jwt-decode';

// Consts and Libs
import { AppAPI } from './';
import { APIConfig } from '../constants/';

export default class JWT {
    apiCredentials = {};

    /**
      * Login
      */
    getToken = credentials => new Promise(async (resolve, reject) => {
        // Use credentials or AsyncStore Creds?
        if (credentials && typeof credentials === 'object' && credentials.email && credentials.password) {
            this.apiCredentials.email = credentials.email;
            this.apiCredentials.password = credentials.password;
        } else {
            return reject({
                data:    { status: 403 },
                message: 'Credentials missing (JWT.getToken).',
            });
        }

        // Let's try logging in
        return AppAPI[APIConfig.tokenKey].post(null, {
            email:    this.apiCredentials.email,
            password: this.apiCredentials.password,
        }).then(async (res) => {
            if (!res.authorization || !res.authorization.jwt) {
                return reject(res);
            }
            const jwt = res.authorization.jwt;

            const tokenIsNowValid = this.tokenIsValid ? this.tokenIsValid(jwt,res.user.id) : null;
            if (!tokenIsNowValid) { return reject(res); }

            return resolve(res);
        }).catch(err => reject(err));
    });

    /**
      * Tests whether a token is valid
      */
    tokenIsValid = (token, userId = null) => {
        let decodedToken;
        try {
            decodedToken = jwtDecode(token);
        } catch (e) {
            // Decode failed, must be invalid
            return false;
        }

        // const NOW = (Date.now() / 1000) || 0; // current UTC time in whole seconds
        // const eagerRenew = 60; // number of seconds prior to expiry that a token is considered 'old'

        // Validate against 'expiry', 'not before' and 'sub' fields in token
        // if (NOW > (decodedToken.exp - eagerRenew)) { return false; } // Expired
        // if (NOW < decodedToken.nbf - 300) { return false; } // Not yet valid (too early!)

        // Don't worry about http vs https - strip it out
        // const thisHostname = APIConfig.hostname.replace(/.*?:\/\//g, '');
        // const tokenHostname = decodedToken.iss.replace(/.*?:\/\//g, '').substr(0, thisHostname.length);
        // if (thisHostname !== tokenHostname) {
        // return false; // Issuing server is different
        // }
        // if (this.apiCredentials.email && this.apiCredentials.email.toLowerCase() !== decodedToken.email) {
        //     return false;
        // }

        if (userId && decodedToken.user_id !== userId) {
            return false; // Token is for another user
        }

        return true;
    }
}
