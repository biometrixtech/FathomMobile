/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 09:00:00
 * @Last Modified by: Mazen Chami
 * @Last Modified time: 2018-07-12 09:00:00
 */

/**
 * Initial Base Actions
 */
import { Actions } from '../constants/';
import { AppAPI } from '../lib/';

/**
  * Athlete Season
  * - saves an athletes season / used for My Plan
  */
const athleteSeason = (object) => {
    return dispatch => AppAPI.athleteSeason.post(object)
        .then(result => {
            dispatch({
                type: Actions.ATHLETE_SEASON_SUCCESS,
                data: result,
            });
            return result;
        })
        .catch(err => {
            dispatch({
                type: Actions.ATHLETE_SEASON_FAILED,
            });
            return err;
        });
};


export default {
    athleteSeason,
};