/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 03:56:09
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-28 19:32:12
 */

/* eslint-disable no-process-env */
export default {
    certificate:          null,
    connectionInfo:       { connectionType: 'unknown', online: false },
    device:               null,
    email:                null,
    environment:          'PROD', // process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    expires:              null,
    jwt:                  null,
    notification:         false,
    password:             null,
    session_token:        null,
    scheduledMaintenance: { addressed: false, end_date: null, start_date: null },
    token:                null, // push notification token
};
