/**
 * Bluetooth Connect Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as AccessoryActions from '@redux/accessory/actions';

// The component we're mapping to
import BluetoothConnectRender from './BluetoothConnectView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:       state.user,
        BleManager: state.accessory.BleManager
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    connectToAccessory: AccessoryActions.connectToAccessory
};

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothConnectRender);
