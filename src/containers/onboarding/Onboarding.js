import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { ble, init as InitActions, plan as PlanActions, user as UserActions, } from '../../actions';

const Onboarding = ({
    Layout,
    accountCode,
    accountRole,
    authorizeUser,
    createUser,
    finalizeLogin,
    getMyPlan,
    getSensorFiles,
    getUser,
    lastOpened,
    network,
    onFormSubmit,
    postSurvey,
    registerDevice,
    setAccountCode,
    setAppLogs,
    updateUser,
    user,
}) => (
    <Layout
        accountCode={accountCode}
        accountRole={accountRole}
        authorizeUser={authorizeUser}
        createUser={createUser}
        finalizeLogin={finalizeLogin}
        getMyPlan={getMyPlan}
        getSensorFiles={getSensorFiles}
        getUser={getUser}
        lastOpened={lastOpened}
        network={network}
        onFormSubmit={onFormSubmit}
        postSurvey={postSurvey}
        registerDevice={registerDevice}
        setAccountCode={setAccountCode}
        setAppLogs={setAppLogs}
        updateUser={updateUser}
        user={user}
    />
);

Onboarding.propTypes = {
    Layout:         PropTypes.func.isRequired,
    accountCode:    PropTypes.string.isRequired,
    accountRole:    PropTypes.string.isRequired,
    authorizeUser:  PropTypes.func.isRequired,
    createUser:     PropTypes.func.isRequired,
    finalizeLogin:  PropTypes.func.isRequired,
    getMyPlan:      PropTypes.func.isRequired,
    getSensorFiles: PropTypes.func.isRequired,
    lastOpened:     PropTypes.object.isRequired,
    network:        PropTypes.object.isRequired,
    onFormSubmit:   PropTypes.func.isRequired,
    postSurvey:     PropTypes.func.isRequired,
    registerDevice: PropTypes.func.isRequired,
    setAccountCode: PropTypes.func.isRequired,
    setAppLogs:     PropTypes.func.isRequired,
    updateUser:     PropTypes.func.isRequired,
    user:           PropTypes.object.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({
    accountCode: state.init.account_code,
    accountRole: state.init.account_role,
    lastOpened:  state.plan.lastOpened,
    network:     state.network,
    user:        state.user,
});

const mapDispatchToProps = {
    authorizeUser:  InitActions.authorizeUser,
    createUser:     UserActions.createUser,
    finalizeLogin:  InitActions.finalizeLogin,
    getMyPlan:      PlanActions.getMyPlan,
    getSensorFiles: ble.getSensorFiles,
    onFormSubmit:   InitActions.startLogin,
    postSurvey:     PlanActions.postSurvey,
    registerDevice: InitActions.registerDevice,
    setAccountCode: InitActions.setAccountCode,
    setAppLogs:     PlanActions.setAppLogs,
    updateUser:     UserActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
