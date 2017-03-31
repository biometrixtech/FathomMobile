/**
 * Recipe Actions
 */

import AppAPI from '@lib/api';

/**
  * Get Meals
  */
export function getMeals() {
    return dispatch =>
    AppAPI.meals.get()
      .then((res) => {
          dispatch({
              type: 'MEALS_REPLACE',
              data: res,
          });
      });
}

/**
  * Reset Meals
  */
export function reset() {
    return {
        type: 'MEALS_RESET',
    };
}
