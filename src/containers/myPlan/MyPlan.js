import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan, } from '../../actions/';

const MyPlan = ({
    Layout,
    getMyPlan,
    getSoreBodyParts,
    postReadinessSurvey,
    user,
}) => (
    <Layout
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        postReadinessSurvey={postReadinessSurvey}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:              PropTypes.func.isRequired,
    getMyPlan:           PropTypes.func.isRequired,
    getSoreBodyParts:    PropTypes.func.isRequired,
    postReadinessSurvey: PropTypes.func.isRequired,
    user:                PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {
    getMyPlan:           plan.getMyPlan,
    getSoreBodyParts:    plan.getSoreBodyParts,
    postReadinessSurvey: plan.postReadinessSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);