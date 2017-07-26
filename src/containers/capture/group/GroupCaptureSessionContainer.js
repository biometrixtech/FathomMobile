/**
 * Capture Session Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import GroupCaptureSessionView from './GroupCaptureSessionView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user: state.user,
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    patchTrainingGroup: UserActions.patchTrainingGroup,
    removeUser:         UserActions.removeUser,
    startSession:       UserActions.startSession,
    stopSession:        UserActions.stopSession
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupCaptureSessionView);
