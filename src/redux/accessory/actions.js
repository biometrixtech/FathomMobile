/**
 * Accessory Actions
 */

import AppAPI from '@lib/api';

const Actions = require('../actionTypes');

/**
  * Update the connected accessory with user data
  * - Receives complete accessory data in return
  */
export function upsertAccessory(params, payload) {
    return dispatch => AppAPI.accessories.patch(params, payload)
        .then((accessoryData) => {
            dispatch({
                type: Actions.UPSERT_ACCESSORY,
                data: accessoryData,
            });

            return accessoryData;
        });
}

export function getBleManager() {
    return dispatch => dispatch({ type: Actions.GET_BLE_MANAGER });
}