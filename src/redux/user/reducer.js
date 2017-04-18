/**
 * User Reducer
 */

// Consts and Libs
import { AppColors } from '@theme/';

const Actions = require('../actionTypes');

// Set initial state
const initialState = {
    regimens: [
            { name: 'Weights',  id: 1 },
            { name: 'Game',     id: 2 },
            { name: 'Practice', id: 3 },
    ],
    trainingGroups: [
        {
            title:          'Team',
            trainingActive: true,
            id:             1,
            athletes:       [
                {
                    id:         1,
                    name:       'John Doe 1',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
                {
                    id:         2,
                    name:       'John Doe 2',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
                {
                    id:         3,
                    name:       'John Doe 3',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
                {
                    id:         4,
                    name:       'John Doe 4',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
                {
                    id:         5,
                    name:       'John Doe 5',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
            ],
        },
        {
            title:          'Injured',
            trainingActive: false,
            id:             2,
            athletes:       [
                {
                    id:         6,
                    name:       'John Doe 6',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
            ],
        },
        {
            title:          'Healthy',
            trainingActive: false,
            id:             3,
            athletes:       [
                {
                    id:         7,
                    name:       'John Doe 7',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
            ],
        },
        {
            title:          'Active',
            trainingActive: false,
            id:             4,
            athletes:       [
                {
                    id:         8,
                    name:       'John Doe 8',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
            ],
        },
        {
            title:          'Inactive',
            trainingActive: false,
            id:             5,
            athletes:       [
                {
                    id:         9,
                    name:       'John Doe 9',
                    avatar_url: 'https://biometrix-useruploads.s3.amazonaws.com/users/avatars/481/1e0/fa-/full/diana.png?1481801448',
                },
            ],
        },
    ],
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
    case Actions.USER_REPLACE:
        delete action.data.created_at;
        return {
            ...state,
            user: action.data,
        };
    case Actions.SIGN_UP_SUCCESS:
        return {
            ...state,
        };
    case Actions.FORGOT_PASSWORD_SUCCESS:
        return {
            ...state,
        };
    case Actions.GET_TRAINING_GROUPS:
        return {
            ...state,
            trainingGroups: action.data,
        };
    case Actions.ADD_TG:
        return {
            user:           state.user,
            regimens:       state.regimens,
            trainingGroups: state.trainingGroups.concat([action.data]),
        };
    case Actions.REMOVE_TG:
        return {
            user:           state.user,
            regimens:       state.regimens,
            trainingGroups: state.trainingGroups.filter(group => group.id !== action.data),
        };
    case Actions.ADD_R:
        return {
            user:           state.user,
            regimens:       state.regimens.concat([action.data]),
            trainingGroups: state.trainingGroups,
        };
    case Actions.REMOVE_R:
        return {
            user:           state.user,
            regimens:       state.regimens.filter(regimen => regimen.id !== action.data),
            trainingGroups: state.trainingGroups,
        };

    default:
        return state;
    }
}
