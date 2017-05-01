/**
 * Team Management Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import TeamManagementRender from './TeamManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    regimens:       state.user.regimens,
    trainingGroups: state.user.trainingGroups,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    addGroup:      UserActions.addTG,
    editGroup:     UserActions.editTG,
    removeGroup:   UserActions.removeTG,
    addRegimen:    UserActions.addR,
    editRegimen:   UserActions.editR,
    removeRegimen: UserActions.removeR,
    addAthlete:    UserActions.addA,
    editAthlete:   UserActions.editR,
    removeAthlete: UserActions.removeA,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeamManagementRender);
