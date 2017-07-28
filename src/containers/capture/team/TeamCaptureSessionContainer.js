/**
 * Capture Session Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import TeamCaptureSessionView from './TeamCaptureSessionView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user: state.user,
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    createTrainingGroup: UserActions.createTrainingGroup,
    patchTrainingGroup:  UserActions.patchTrainingGroup,
    removeTrainingGroup: UserActions.removeTrainingGroup,
    teamSelect:          UserActions.teamSelect,
    selectTrainingGroup: UserActions.selectTrainingGroup,
    getAccessories:      UserActions.getAccessories,
    getTeams:            UserActions.getTeams,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamCaptureSessionView);
