/**
 * Regimens Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import RegimensRender from './RegimensView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    regimens: state.user.regimens,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    addRegimen:    UserActions.addRegimen,
    removeRegimen: UserActions.removeRegimen,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegimensRender);
