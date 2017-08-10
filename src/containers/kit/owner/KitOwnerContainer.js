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
    assignKitName:        BluetoothActions.assignKitName,
    getKitName:           BluetoothActions.getKitName,
    assignType:           BluetoothActions.assignType,
    storeParams:          BluetoothActions.storeParams,
    loginToAccessory:     BluetoothActions.loginToAccessory,
    setKitTime:           BluetoothActions.setKitTime,
    resetAccessory:       BluetoothActions.resetAccessory,
    startConnect:         BluetoothActions.startConnect,
    stopConnect:          BluetoothActions.stopConnect,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitOwnerRender);
