/*
 * @Author: Vir Desai 
 * @Date: 2018-04-23 18:35:37 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 19:18:42
 */

import init from './init';
import user from './user';

let bluetooth = null;
/* eslint-disable no-process-env */
if (process.env.PLATFORM_ENV === 'web') {
    bluetooth = require('./bluetooth');
}


export { user, init, bluetooth };