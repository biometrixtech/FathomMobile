/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:21:13 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:46:20
 */

/**
 * Sidemenu Actions
 */

import { Actions } from '../../constants/';

export function toggle() {
    return {
        type: Actions.SIDEMENU_TOGGLE,
    };
}

export function open() {
    return {
        type: Actions.SIDEMENU_OPEN,
    };
}

export function close() {
    return {
        type: Actions.SIDEMENU_CLOSE,
    };
}
