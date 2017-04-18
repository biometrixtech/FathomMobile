/**
 * Sidemenu Actions
 */

const Actions = require('../actionTypes');

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
