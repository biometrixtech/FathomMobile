/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:23 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-02-01 10:29:54
 */

/**
 * Kit Assign Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as BluetoothActions from '@redux/bluetooth/actions';
import * as UserActions from '@redux/user/actions';

// The component we're mapping to
import KitAssignRender from './KitAssignView';

// What data from the store shall we send to the component?
const mapStateToProps = state => {
    return ({
        user:      state.user,
        bluetooth: state.bluetooth
    });
};

// Any actions to map to the component?
const mapDispatchToProps = {
    assignKitOrganization: BluetoothActions.assignKitOrganization,
    assignKitTeam:         BluetoothActions.assignKitTeam,
    assignKitIndividual:   BluetoothActions.assignKitIndividual,
    teamSelect:            UserActions.teamSelect
};

export default connect(mapStateToProps, mapDispatchToProps)(KitAssignRender);
