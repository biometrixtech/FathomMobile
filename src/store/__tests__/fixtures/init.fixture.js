/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-17 11:59:21
 */

/* eslint-disable no-process-env */
export default {
    account_code:         '',
    account_role:         'athlete',
    certificate:          null,
    device:               null,
    email:                null,
    environment:          'TEST', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    expires:              null,
    jwt:                  null,
    notification:         false,
    password:             null,
    session_token:        null,
    scheduledMaintenance: { addressed: false, end_date: null, start_date: null },
    token:                null, // push notification token
};
