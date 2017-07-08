/**
 * Kit Management Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as AccessoryActions from '@redux/accessory/actions';

// The component we're mapping to
import KitManagementRender from './KitManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:      state.user,
        accessory: state.accessory
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagementRender);
