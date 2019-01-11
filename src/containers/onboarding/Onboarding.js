import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init as InitActions, plan as PlanActions, user as UserActions, } from '../../actions';

const Onboarding = ({
    Layout,
    authorizeUser,
    createUser,
    finalizeLogin,
    getSoreBodyParts,
    getUser,
    lastOpened,
    network,
    onFormSubmit,
    preReadiness,
    registerDevice,
    setAppLogs,
    updateUser,
    user,
}) => (
    <Layout
        authorizeUser={authorizeUser}
        createUser={createUser}
        finalizeLogin={finalizeLogin}
        getSoreBodyParts={getSoreBodyParts}
        getUser={getUser}
        lastOpened={lastOpened}
        network={network}
        onFormSubmit={onFormSubmit}
        preReadiness={preReadiness}
        registerDevice={registerDevice}
        setAppLogs={setAppLogs}
        updateUser={updateUser}
        user={user}
    />
);

Onboarding.propTypes = {
    Layout:           PropTypes.func.isRequired,
    authorizeUser:    PropTypes.func.isRequired,
    createUser:       PropTypes.func.isRequired,
    finalizeLogin:    PropTypes.func.isRequired,
    getMyPlan:        PropTypes.func.isRequired,
    getSoreBodyParts: PropTypes.func.isRequired,
    lastOpened:       PropTypes.object.isRequired,
    network:          PropTypes.object.isRequired,
    onFormSubmit:     PropTypes.func.isRequired,
    preReadiness:     PropTypes.func.isRequired,
    registerDevice:   PropTypes.func.isRequired,
    setAppLogs:       PropTypes.func.isRequired,
    updateUser:       PropTypes.func.isRequired,
    user:             PropTypes.object.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({
    lastOpened: state.plan.lastOpened,
    network:    state.network,
    user:       state.user,
});

const mapDispatchToProps = {
    authorizeUser:    InitActions.authorizeUser,
    createUser:       UserActions.createUser,
    finalizeLogin:    InitActions.finalizeLogin,
    getMyPlan:        PlanActions.getMyPlan,
    getSoreBodyParts: PlanActions.getSoreBodyParts,
    onFormSubmit:     InitActions.startLogin,
    preReadiness:     PlanActions.preReadiness,
    registerDevice:   InitActions.registerDevice,
    setAppLogs:       PlanActions.setAppLogs,
    updateUser:       UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
