/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:21:11
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 18:43:20
 */

import ble from './ble';
import init from './init';
import plan from './plan';
import user from './user';

const rehydrated = (state = false, action) => {
    switch (action.type) {
    case 'persist/REHYDRATE':
        return true;
    default:
        return state;
    }
};

export default {
    ble,
    init,
    plan,
    rehydrated,
    user
};
