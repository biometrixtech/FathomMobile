/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:34:23 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 18:44:31
 */

/**
 * Kit Assign Screen Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Actions
import BluetoothActions from '../../actions/ble';
import UserActions from '../../actions/user';

const KitAssign = ({
    Layout,
    assignKitOrganization,
    assignKitTeam,
    assignKitIndividual,
    teamSelect,
    user,
    bluetooth
}) => (
    <Layout
        assignKitOrganization={assignKitOrganization}
        assignKitTeam={assignKitTeam}
        assignKitIndividual={assignKitIndividual}
        teamSelect={teamSelect}
        user={user}
        bluetooth={bluetooth}
    />
);

KitAssign.propTypes = {
    Layout:                PropTypes.func.isRequired,
    assignKitOrganization: PropTypes.func.isRequired,
    assignKitTeam:         PropTypes.func.isRequired,
    assignKitIndividual:   PropTypes.func.isRequired,
    teamSelect:            PropTypes.func.isRequired,
    user:                  PropTypes.shape({}).isRequired,
    bluetooth:             PropTypes.shape({}).isRequired,
};

KitAssign.defaultProps = {
    user:      {},
    bluetooth: {},
};

const mapStateToProps = state => ({
    user:      state.user || {},
    bluetooth: state.bluetooth || {},
});

const mapDispatchToProps = {
    assignKitOrganization: BluetoothActions.assignKitOrganization,
    assignKitTeam:         BluetoothActions.assignKitTeam,
    assignKitIndividual:   BluetoothActions.assignKitIndividual,
    teamSelect:            UserActions.teamSelect
};

export default connect(mapStateToProps, mapDispatchToProps)(KitAssign);
