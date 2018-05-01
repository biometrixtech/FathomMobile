/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:21:11 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:21:11 
 */

import init from './init';
import bluetooth from './bluetooth';
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
    rehydrated,
    init,
    bluetooth,
    user
};
