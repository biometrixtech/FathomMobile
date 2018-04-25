/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:49 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:52:54
 */

/**
 * Kit Owner Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as BluetoothActions from '../../../redux/bluetooth/actions';

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
    assignKitName:    BluetoothActions.assignKitName,
    getKitName:       BluetoothActions.getKitName,
    assignType:       BluetoothActions.assignType,
    storeParams:      BluetoothActions.storeParams,
    loginToAccessory: BluetoothActions.loginToAccessory,
    setKitTime:       BluetoothActions.setKitTime,
    startConnect:     BluetoothActions.startConnect,
    stopConnect:      BluetoothActions.stopConnect,
    setOwnerFlag:     BluetoothActions.setOwnerFlag,
    getOwnerFlag:     BluetoothActions.getOwnerFlag,
};

export default connect(mapStateToProps, mapDispatchToProps)(KitOwnerRender);
