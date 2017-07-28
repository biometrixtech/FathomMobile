/**
 * Menu Container
 */
import { connect } from 'react-redux';

// Actions
import * as UserActions from '@redux/user/actions';
import * as BluetoothActions from '@redux/bluetooth/actions';

// The component we're mapping to
import MenuRender from './MenuView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    user: state.user,
    id:   state.bluetooth.accessoryData.id
});

// Any actions to map to the component?
const mapDispatchToProps = {
    logout:     UserActions.logout,
    disconnect: BluetoothActions.disconnect,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuRender);
