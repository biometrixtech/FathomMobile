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
    regimens:       state.regimens,
    trainingGroups: state.trainingGroups,
});

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AthletesRender);
