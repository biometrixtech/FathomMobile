/*
 * @Author: Vir Desai 
 * @Date: 2018-07-27 21:51:46 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-30 02:50:06
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, init as InitActions } from '../../actions';

const Home = ({
    Layout,
    appLoaded,
    getMyPlan,
    getSoreBodyParts,
    lastOpened,
    notification,
    plan,
    postReadinessSurvey,
    postSessionSurvey,
    user,
}) => (
    <Layout
        appLoaded={appLoaded}
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        lastOpened={lastOpened}
        notification={notification}
        plan={plan}
        postReadinessSurvey={postReadinessSurvey}
        postSessionSurvey={postSessionSurvey}
        user={user}
    />
);

Home.propTypes = {
    Layout:              PropTypes.func.isRequired,
    appLoaded:           PropTypes.func.isRequired,
    getMyPlan:           PropTypes.func.isRequired,
    getSoreBodyParts:    PropTypes.func.isRequired,
    lastOpened:          PropTypes.string, // cannot make it required as null would not be a valid value for an isRequired check which is a bug in the prop-types packages that is being discussed
    notification:        PropTypes.bool.isRequired,
    plan:                PropTypes.object.isRequired,
    postReadinessSurvey: PropTypes.func.isRequired,
    postSessionSurvey:   PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

Home.defaultProps = {
    lastOpened: null,
};

const mapStateToProps = state => ({
    lastOpened:   state.init.lastOpened,
    notification: state.init.notification,
    plan:         state.plan,
    user:         state.user,
});

const mapDispatchToProps = {
    appLoaded:           InitActions.appLoaded,
    getMyPlan:           PlanActions.getMyPlan,
    getSoreBodyParts:    PlanActions.getSoreBodyParts,
    postReadinessSurvey: PlanActions.postReadinessSurvey,
    postSessionSurvey:   PlanActions.postSessionSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
