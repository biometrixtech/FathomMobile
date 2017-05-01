/**
 * Groups Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import GroupsRender from './GroupsView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    trainingGroups: state.user.trainingGroups,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    addGroup:    UserActions.addTG,
    editGroup:   UserActions.editTG,
    removeGroup: UserActions.removeTG,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupsRender);
