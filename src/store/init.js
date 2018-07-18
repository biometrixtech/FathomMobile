/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 11:59:09
 */

/* eslint-disable no-process-env */
export default {
    certificate: null,
    email:       null,
    environment: 'DEV', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    jwt:         null,
    password:    null,
    token:       null, // push notification token
    device:      null,
};
