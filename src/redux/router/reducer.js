/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:21:20 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2017-10-12 11:21:20 
 */

/**
 * Router Reducer
 */
import { ActionConst } from 'react-native-router-flux';

// Set initial state
const initialState = {
    scene: {},
};

export default function routerReducer(state = initialState, action) {
    switch (action.type) {
    // focus action is dispatched when a new screen comes into focus
    case ActionConst.FOCUS :
        return {
            ...state,
            scene: action.scene,
        };

    // ...other actions

    default :
        return state;
    }
}
