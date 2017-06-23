/**
 * Kit Management Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as AccessoryActions from '@redux/accessory/actions';

// The component we're mapping to
import KitManagementRender from './KitManagementView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    user: state.user.user,
});

// Any actions to map to the component?
const mapDispatchToProps = {
    upsertAccessory: AccessoryActions.upsertAccessory,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitManagementRender);
