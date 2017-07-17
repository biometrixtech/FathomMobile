/**
 * Kit Owner Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as BluetoothActions from '@redux/bluetooth/actions';

// The component we're mapping to
import KitOwnerRender from './KitOwnerView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:      state.user,
        bluetooth: state.bluetooth
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    getOwnerOrganization: BluetoothActions.getOwnerOrganization,
    getOwnerTeam:         BluetoothActions.getOwnerTeam,
    getOwnerUser:         BluetoothActions.getOwnerUser,
    assignType:           BluetoothActions.assignType
};

export default connect(mapStateToProps, mapDispatchToProps)(KitOwnerRender);
