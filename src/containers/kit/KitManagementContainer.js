/**
 * Kit Management Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import KitManagementRender from './KitManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({
});

// Any actions to map to the component?
const mapDispatchToProps = {
    login: UserActions.login,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagementRender);
