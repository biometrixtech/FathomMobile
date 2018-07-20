/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-18 18:17:07
 */

/* eslint-disable no-process-env */
export default {
    certificate:  null,
    device:       null,
    email:        null,
    environment:  'DEV', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    jwt:          null,
    notification: false,
    password:     null,
    token:        null, // push notification token
};
