/**
 * Athletes Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import AthletesRender from './AthletesView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    regimens:       state.user.regimens,
    trainingGroups: state.user.trainingGroups,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    addAthlete:    UserActions.addA,
    removeAthlete: UserActions.removeA,
};

export default connect(mapStateToProps, mapDispatchToProps)(AthletesRender);
