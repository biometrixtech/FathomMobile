/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 03:56:09 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 13:20:42
 */

/* eslint-disable no-process-env */
export default {
    environment: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    email:       null,
    password:    null,
    jwt:         null,
};
