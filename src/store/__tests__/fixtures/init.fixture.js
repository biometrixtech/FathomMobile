/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 11:59:21
 */

/* eslint-disable no-process-env */
export default {
    certificate:   null,
    device:        null,
    email:         null,
    environment:   'DEV', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    expires:       null,
    jwt:           null,
    notification:  false,
    password:      null,
    session_token: null,
    token:         null, // push notification token
};
