/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-28 19:32:12
 */

/* eslint-disable no-process-env */
export default {
    certificate:   null,
    device:        null,
    email:         null,
    environment:   'TEST', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    expires:       null,
    jwt:           null,
    lastOpened:    null, // for user entering the app for the first time in a day to track the last day the app was opened
    notification:  false,
    password:      null,
    session_token: null,
    token:         null, // push notification token
};
