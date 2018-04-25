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
