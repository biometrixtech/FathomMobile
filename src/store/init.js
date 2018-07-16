/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 03:56:09 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 11:17:05
 */

/* eslint-disable no-process-env */
export default {
    certificate: null,
    email:       null,
    environment: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
    jwt:         null,
    password:    null,
};
